'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  animate,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue
} from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const WASH_IN = 0.3;
const WASH_OUT = 0.2;
const SINK_DELAY = 0.06;
const SINK_STEP = 0.03;
const CHECK_DELAY = 0.28;
const CHECK_RISE = 8;
const SINK_FADE = 0.6;

export type CodeSlotsStatus = 'idle' | 'error' | 'success';

export interface CodeSlotsProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  status?: CodeSlotsStatus;
  mask?: boolean;
  caret?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  accentColor?: string;
  inkColor?: string;
  slotColor?: string;
  digitColor?: string;
  dangerColor?: string;
  slotSize?: number;
  gap?: number;
  radius?: number;
  bounce?: number;
  settle?: number;
  rise?: number;
  cascade?: number;
  ariaLabel?: string;
  className?: string;
}

interface Live {
  settle: number;
  bounce: number;
  cascade: number;
  reduce: boolean | null;
}

interface SlotProps {
  mv: MotionValue<number>;
  drop: MotionValue<number>;
  char: string;
  active: boolean;
  rise: number;
  sink: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const digitsOf = (raw: string | undefined) => String(raw ?? '').replace(/\D/g, '');
const toSlots = (raw: string | undefined, n: number) => {
  const d = digitsOf(raw).slice(0, n);
  return Array.from({ length: n }, (_, i) => d[i] ?? '');
};
const firstEmptyOf = (slots: string[]) => {
  const i = slots.indexOf('');
  return i === -1 ? slots.length - 1 : i;
};
const isFull = (slots: string[]) => slots.every(Boolean);

const STYLE = `
@keyframes code-slots-blink{0%,49.9%{opacity:1}50%,100%{opacity:0}}
.cs-root{position:relative;display:inline-block}
.cs-row{position:relative;display:inline-flex;cursor:text;touch-action:manipulation;gap:var(--cs-gap);-webkit-tap-highlight-color:transparent;transition:opacity 200ms ease}
.cs-row[data-disabled]{cursor:not-allowed;opacity:0.5}
.cs-input{position:absolute;inset:0;z-index:4;width:100%;height:100%;margin:0;cursor:inherit;appearance:none;border:0;background:transparent;padding:0;font-size:16px;color:transparent;opacity:0;outline:0;caret-color:transparent}
.cs-slot{position:relative;height:var(--cs-height);width:var(--cs-size);overflow:hidden;border-radius:var(--cs-radius);background-color:var(--cs-slot);user-select:none;transition:background-color 200ms ease,box-shadow 200ms ease;box-shadow:inset 0 0 0 1px rgba(21,52,91,0.12)}
.cs-slot[data-active]{background-color:color-mix(in srgb,var(--cs-ink) 12%,var(--cs-slot));box-shadow:inset 0 0 0 2px var(--cs-ink)}
.cs-row[data-status="error"] .cs-slot,.cs-row[data-status="error"] .cs-slot[data-active]{background-color:color-mix(in srgb,var(--cs-danger) 20%,var(--cs-slot));box-shadow:inset 0 0 0 2px var(--cs-danger)}
@media(hover:hover) and (pointer:fine){
  .cs-row[data-status="idle"]:not([data-disabled]):hover .cs-slot:not([data-active]){
    background-color:color-mix(in srgb,var(--cs-ink) 6%,var(--cs-slot));
  }
}
.cs-slot-fill{position:absolute;inset:0;transform-origin:center;border-radius:inherit;background-color:var(--cs-accent);transition:background-color 200ms ease}
.cs-row[data-status="error"] .cs-slot-fill{background-color:var(--cs-danger)}
.cs-slot-digit{position:absolute;inset:0;z-index:2;display:grid;place-items:center;font-size:var(--cs-font);line-height:1;font-weight:600;font-variant-numeric:tabular-nums;font-family:var(--font-mono,inherit);color:var(--cs-digit)}
.cs-wash{pointer-events:none;position:absolute;inset:0;z-index:1;display:grid;place-items:center;border-radius:var(--cs-radius);background-color:var(--cs-accent);color:var(--cs-digit)}
.cs-check{display:grid;place-items:center}
.cs-caret{pointer-events:none;position:absolute;top:25%;left:calc(var(--cs-size) / 2 - 0.75px);z-index:3;height:50%;width:1.5px;opacity:0}
.cs-caret[data-show]{opacity:1}
.cs-caret-bar{display:block;height:100%;width:100%;background-color:var(--cs-ink);animation:code-slots-blink 1s linear infinite}
@media(prefers-reduced-motion:reduce){
  .cs-slot-digit{transform:none !important;transition:opacity 150ms ease}
  .cs-wash{opacity:0;transition:opacity 200ms ease}
  .cs-row[data-status="success"] .cs-wash{opacity:1}
  .cs-check{transform:none !important;transition:opacity 150ms ease}
  .cs-caret-bar{animation:none}
}
`;

export const CodeSlots: React.FC<CodeSlotsProps> = ({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  status = 'idle',
  mask = false,
  caret = true,
  disabled = false,
  autoFocus = false,
  accentColor = '#3978D4',
  inkColor = '#3978D4',
  slotColor = '#E4EEFB',
  digitColor = '#FFFFFF',
  dangerColor = '#ff3b30',
  slotSize = 44,
  gap = 8,
  radius = 12,
  bounce = 0.2,
  settle = 0.3,
  rise = 8,
  cascade = 20,
  ariaLabel = 'One-time code',
  className = ''
}) => {
  const uid = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState(() => toSlots(value ?? defaultValue, length));
  const [active, setActive] = useState(() => firstEmptyOf(slots));
  const [focused, setFocused] = useState(false);
  const [veiled, setVeiled] = useState(status === 'success');
  const activeMv = useMotionValue(active);
  const openMv = useMotionValue(status === 'success' ? 1 : 0);
  const checkMv = useMotionValue(status === 'success' ? 1 : 0);
  const glide = useRef<Set<number>>(new Set());
  const target = useRef<number[]>([]);
  const draining = useRef(false);
  const drainTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statusRef = useRef(status);
  const emitted = useRef(digitsOf(value ?? defaultValue).slice(0, length));
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const live = useRef<Live>({} as Live);
  live.current = { settle, bounce, cascade, reduce };

  const springs = useMemo(
    () => ({
      mvs: Array.from({ length }, (_, i) => motionValue(slotsRef.current[i] ? 1 : 0)),
      drops: Array.from({ length }, () => motionValue(statusRef.current === 'success' ? 1 : 0))
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length]
  );
  const { mvs, drops } = springs;
  const pitch = slotSize + gap;
  const height = Math.round(slotSize * 1.18);
  const washRadius = Math.min(radius, slotSize / 2);

  const drive = useCallback(
    (i: number, to: number, delayMs = 0) => {
      const mv = mvs[i];
      if (!mv) return;
      target.current[i] = to;
      const L = live.current;
      if (L.reduce) {
        mv.jump(to);
        return;
      }
      animate(mv, to, { type: 'spring', duration: L.settle, bounce: L.bounce, delay: delayMs / 1000 });
    },
    [mvs]
  );
  const land = useCallback(
    (i: number, delayMs = 0) => {
      if (mvs[i].get() > 0) mvs[i].jump(0);
      drive(i, 1, delayMs);
    },
    [mvs, drive]
  );
  const moveActive = useCallback(
    (next: number, crossed: number[]) => {
      crossed.forEach(j => glide.current.add(j));
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );
  const jumpActive = useCallback(
    (next: number) => {
      glide.current.clear();
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );

  const caretX = useTransform(() => {
    const a = activeMv.get();
    let x = a * pitch;
    for (let j = 0; j < mvs.length; j++) {
      const h = clamp01(mvs[j].get());
      if (!glide.current.has(j)) continue;
      const to = target.current[j];
      if (to === undefined || h === clamp01(to)) {
        glide.current.delete(j);
        continue;
      }
      x += j < a ? -(1 - h) * pitch : h * pitch;
    }
    return Math.min(Math.max(x, 0), (mvs.length - 1) * pitch);
  });
  const caretTransform = useTransform(caretX, (x: number) => `translateX(${x}px)`);
  const washClip = useTransform(openMv, (o: number) => `inset(0 ${(1 - clamp01(o)) * 50}% round ${washRadius}px)`);
  const checkTransform = useTransform(
    checkMv,
    (c: number) => `translateY(${(1 - c) * CHECK_RISE}px) scale(${0.85 + 0.15 * Math.max(c, 0)})`
  );
  const checkOpacity = useTransform(checkMv, clamp01);

  const commit = useCallback(
    (next: string[]) => {
      const prev = slotsRef.current;
      slotsRef.current = next;
      setSlots(next);
      const code = next.join('');
      emitted.current = code;
      onChange?.(code);
      if (!isFull(prev) && isFull(next)) onComplete?.(code);
    },
    [onChange, onComplete]
  );

  const insert = (raw: string, from = active) => {
    const digits = digitsOf(raw);
    if (!digits) return;
    const next = [...slotsRef.current];
    const crossed: number[] = [];
    const step = reduce ? 0 : cascade;
    let i = from;
    for (const ch of digits) {
      if (i >= length) break;
      next[i] = ch;
      land(i, (i - from) * step);
      crossed.push(i);
      i += 1;
    }
    if (!crossed.length) return;
    commit(next);
    moveActive(Math.min(i, length - 1), crossed);
  };
  const clearSlot = (i: number, stepBack = false) => {
    if (!slotsRef.current[i]) {
      if (stepBack) jumpActive(i);
      return;
    }
    const next = [...slotsRef.current];
    next[i] = '';
    drive(i, 0);
    commit(next);
    if (stepBack) moveActive(i, [i]);
  };

  const busy = disabled || draining.current || status === 'success';
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (busy || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) {
      e.preventDefault();
      insert(k);
    } else if (k === 'Backspace') {
      e.preventDefault();
      if (slots[active]) clearSlot(active);
      else if (active > 0) clearSlot(active - 1, true);
    } else if (k === 'Delete') {
      e.preventDefault();
      clearSlot(active);
    } else if (k === 'ArrowLeft') {
      e.preventDefault();
      jumpActive(Math.max(active - 1, 0));
    } else if (k === 'ArrowRight') {
      e.preventDefault();
      jumpActive(Math.min(active + 1, length - 1));
    } else if (k === 'Home') {
      e.preventDefault();
      jumpActive(0);
    } else if (k === 'End') {
      e.preventDefault();
      jumpActive(length - 1);
    }
  };
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (busy) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const d = digitsOf(pasted);
    insert(pasted, d.length >= length ? 0 : active);
  };
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (busy) return;
    const d = digitsOf(e.target.value);
    if (!d) return;
    insert(d, d.length === 1 ? active : 0);
  };
  const onRowMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    const row = rowRef.current;
    if (row && !draining.current && status !== 'success') {
      const rect = row.getBoundingClientRect();
      const zoom = rect.width / (row.offsetWidth || rect.width) || 1;
      const i = Math.floor((e.clientX - rect.left) / zoom / pitch);
      jumpActive(Math.max(0, Math.min(i, firstEmptyOf(slotsRef.current))));
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    glide.current.clear();
    target.current = [];
    const next = Array.from({ length }, (_, i) => slotsRef.current[i] ?? '');
    slotsRef.current = next;
    setSlots(next);
    jumpActive(firstEmptyOf(next));
    const code = next.join('');
    if (code !== emitted.current) {
      emitted.current = code;
      onChange?.(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  useEffect(() => {
    if (value === undefined) return;
    const clean = digitsOf(value).slice(0, length);
    if (clean === '') {
      clearTimeout(drainTimer.current);
      draining.current = false;
    }
    if (clean === emitted.current) return;
    emitted.current = clean;
    const prev = slotsRef.current;
    const next = toSlots(clean, length);
    const hidden = statusRef.current === 'success';
    const landing: number[] = [];
    const leaving: number[] = [];
    next.forEach((ch, i) => {
      if (ch === prev[i]) return;
      (ch ? landing : leaving).push(i);
    });
    const step = live.current.reduce || hidden ? 0 : live.current.cascade;
    landing.forEach((i, k) => land(i, k * step));
    leaving.reverse().forEach((i, k) => {
      if (hidden) {
        target.current[i] = 0;
        mvs[i].jump(0);
        drops[i].jump(0);
      } else drive(i, 0, k * step);
    });
    slotsRef.current = next;
    setSlots(next);
    moveActive(firstEmptyOf(next), [...landing, ...leaving]);
    if (!isFull(prev) && isFull(next)) onComplete?.(clean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  useEffect(() => {
    const was = statusRef.current;
    const L = live.current;
    if (status === 'success') {
      setVeiled(true);
      if (L.reduce) {
        openMv.jump(1);
        drops.forEach(d => d.jump(1));
        checkMv.jump(1);
        return;
      }
      animate(openMv, 1, { duration: WASH_IN, ease: EASE_OUT });
      drops.forEach((d, k) =>
        animate(d, 1, { type: 'spring', duration: 0.3, bounce: 0, delay: SINK_DELAY + k * SINK_STEP })
      );
      animate(checkMv, 1, { type: 'spring', duration: 0.35, bounce: L.bounce, delay: CHECK_DELAY });
      return;
    }
    if (was !== 'success') return;
    if (L.reduce) {
      openMv.jump(0);
      checkMv.jump(0);
      drops.forEach(d => d.jump(0));
      setVeiled(false);
      return;
    }
    animate(checkMv, 0, { duration: 0.15, ease: EASE_OUT });
    animate(openMv, 0, { duration: WASH_OUT, ease: EASE_OUT, delay: 0.06 }).then(() => {
      if (openMv.get() === 0) setVeiled(false);
    });
    drops.forEach(d => animate(d, 0, { type: 'spring', duration: 0.3, bounce: 0, delay: 0.1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (status !== 'error') {
      clearTimeout(drainTimer.current);
      draining.current = false;
      return;
    }
    const filled = slotsRef.current.map((c, i) => (c ? i : -1)).filter(i => i >= 0);
    if (!filled.length) return;
    filled.reverse();
    draining.current = true;
    const L = live.current;
    const step = L.reduce ? 0 : L.cascade;
    filled.forEach((i, k) => drive(i, 0, k * step));
    moveActive(
      0,
      slotsRef.current.map((_, j) => j)
    );
    clearTimeout(drainTimer.current);
    drainTimer.current = setTimeout(
      () => {
        draining.current = false;
        commit(Array.from({ length }, () => ''));
      },
      L.reduce ? 300 : (filled.length - 1) * step + L.settle * 1000
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => () => clearTimeout(drainTimer.current), []);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const view = slots.length === length ? slots : Array.from({ length }, (_, i) => slots[i] ?? '');
  const showCaret =
    caret && focused && !disabled && !veiled && status !== 'success' && (status === 'error' || !view[active]);

  return (
    <div
      className={`cs-root relative inline-block${className ? ` ${className}` : ''}`}
      style={
        {
          '--cs-accent': accentColor,
          '--cs-ink': inkColor,
          '--cs-slot': slotColor,
          '--cs-digit': digitColor,
          '--cs-danger': dangerColor,
          '--cs-size': `${slotSize}px`,
          '--cs-height': `${height}px`,
          '--cs-gap': `${gap}px`,
          '--cs-radius': `${Math.min(radius, slotSize / 2)}px`,
          '--cs-font': `${Math.round(slotSize * 0.5)}px`
        } as CSSProperties
      }
    >
      <style>{STYLE}</style>
      <div
        ref={rowRef}
        className="cs-row group/row relative inline-flex cursor-text touch-manipulation gap-[var(--cs-gap)] [-webkit-tap-highlight-color:transparent] [transition:opacity_200ms_ease] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        data-status={status}
        data-focused={focused ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        onMouseDown={onRowMouseDown}
      >
        <input
          ref={inputRef}
          className="cs-input absolute inset-0 z-[4] m-0 cursor-[inherit] appearance-none border-0 bg-transparent p-0 text-[16px] text-transparent opacity-0 outline-0 [caret-color:transparent]"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          value=""
          maxLength={length}
          aria-label={ariaLabel}
          aria-invalid={status === 'error'}
          aria-describedby={`${uid}-count`}
          disabled={disabled}
          readOnly={status === 'success'}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onChange={onInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {view.map((ch, i) => (
          <Slot
            key={i}
            mv={mvs[i]}
            drop={drops[i]}
            char={mask && ch ? '•' : ch}
            active={focused && i === active}
            rise={rise}
            sink={Math.round(height * 0.5)}
          />
        ))}
        <motion.span
          className="cs-wash pointer-events-none absolute inset-0 z-[1] grid place-items-center rounded-[var(--cs-radius)] bg-[var(--cs-accent)] [color:var(--cs-digit)] motion-reduce:opacity-0 motion-reduce:[transition:opacity_200ms_ease] motion-reduce:in-data-[status=success]:opacity-100"
          aria-hidden="true"
          style={{ clipPath: washClip }}
        >
          <motion.span
            className="cs-check grid place-items-center motion-reduce:transform-none! motion-reduce:[transition:opacity_150ms_ease]"
            style={{ transform: checkTransform, opacity: checkOpacity }}
          >
            <HugeiconsIcon icon={Tick02Icon} size={Math.round(slotSize * 0.6)} strokeWidth={2.2} />
          </motion.span>
        </motion.span>
        <motion.span
          className="cs-caret pointer-events-none absolute top-1/4 left-[calc(var(--cs-size)/2_-_0.75px)] z-[3] h-1/2 w-[1.5px] opacity-0 data-[show]:opacity-100"
          aria-hidden="true"
          data-show={showCaret ? '' : undefined}
          style={{ transform: caretTransform }}
        >
          <span
            key={active}
            className="cs-caret-bar block h-full w-full bg-[var(--cs-ink)] animate-[code-slots-blink_1s_linear_infinite] motion-reduce:animate-none"
          />
        </motion.span>
      </div>
      <span id={`${uid}-count`} className="sr-only" aria-live="polite">
        {status === 'success' ? 'Code accepted' : `${view.filter(Boolean).length} of ${length} digits entered`}
      </span>
    </div>
  );
};

function Slot({ mv, drop, char, active, rise, sink }: SlotProps) {
  const [shown, setShown] = useState(char);
  if (char && char !== shown) setShown(char);
  const fill = useTransform(mv, (t: number) => `scale(${Math.max(t, 0)})`);
  const lift = useTransform(
    [mv, drop],
    ([t, d]: number[]) => `translateY(${(1 - t) * rise + Math.max(d, 0) * sink}px)`
  );
  const ink = useTransform([mv, drop], ([t, d]: number[]) => clamp01(t) * (1 - clamp01(d / SINK_FADE)));
  return (
    <span
      className="cs-slot relative h-[var(--cs-height)] w-[var(--cs-size)] overflow-hidden rounded-[var(--cs-radius)] bg-[var(--cs-slot)] select-none [transition:background-color_200ms_ease] data-[active]:[background-color:color-mix(in_srgb,var(--cs-ink)_8%,var(--cs-slot))] in-data-[status=error]:[background-color:color-mix(in_srgb,var(--cs-danger)_20%,var(--cs-slot))] in-data-[status=error]:data-[active]:[background-color:color-mix(in_srgb,var(--cs-danger)_20%,var(--cs-slot))] [@media(hover:hover)_and_(pointer:fine)]:group-hover/row:in-data-[status=idle]:not-in-data-[disabled]:not-data-[active]:[background-color:color-mix(in_srgb,var(--cs-ink)_4%,var(--cs-slot))]"
      data-active={active ? '' : undefined}
      data-filled={char ? '' : undefined}
      aria-hidden="true"
    >
      <motion.span
        className="cs-slot-fill absolute inset-0 origin-center rounded-[inherit] bg-[var(--cs-accent)] [transition:background-color_200ms_ease] in-data-[status=error]:bg-[var(--cs-danger)]"
        style={{ transform: fill }}
      />
      {shown ? (
        <motion.span
          className="cs-slot-digit absolute inset-0 z-[2] grid place-items-center text-[length:var(--cs-font)] leading-none font-semibold tabular-nums [font-family:inherit] [color:var(--cs-digit)] motion-reduce:transform-none! motion-reduce:[transition:opacity_150ms_ease]"
          style={{ transform: lift, opacity: ink }}
        >
          {shown}
        </motion.span>
      ) : null}
    </span>
  );
}

export default CodeSlots;

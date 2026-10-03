/**
 * Dock — composant fourni par Stane (React Bits,
 * https://reactbits.dev) — mécanique motion/spring INCHANGÉE
 * (magnification au survol du pointeur, ressorts, tooltip, clavier).
 * Dépendance `motion` déjà installée.
 *
 * Adaptations autorisées (documentées, aucune logique altérée) :
 *  - classes Tailwind → classes projet (.dock, .dock__panel…) et
 *    couleurs du design system bleu (jamais le noir #120F17) ;
 *  - ancrage : le panneau n'est plus « absolute bottom-2 » — la nav
 *    parente (fixed) porte la position (le Dock reste réutilisable
 *    dans le flux) ;
 *  - `showLabels` : étiquette permanente sous chaque icône (sur mobile
 *    il n'y a pas de survol — le menu doit rester lisible sans
 *    toucher : labels visibles = règle permanente du projet) ;
 *  - `activeLabel` : l'entrée active reçoit aria-current="page" et le
 *    style « page courante » (sinon la navigation perd son repère) ;
 *  - reduced-motion : magnification coupée (tailles fixes), tooltip
 *    conservé — menu identique, zéro ressort.
 */
'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '../../motion/useReducedMotion';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  /** Affiche le libellé en permanence sous l'icône (mobile/lisibilité). */
  showLabels?: boolean;
  /** Libellé de l'entrée active (aria-current="page" + style actif). */
  activeLabel?: string;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  label?: React.ReactNode;
  showLabels?: boolean;
  active?: boolean;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  showLabels = false,
  active = false
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const itemClassName = `dock__item${active ? ' dock__item--active' : ''} ${className}`.trim();
  const sharedProps = {
    onHoverStart: () => isHovered.set(1),
    onHoverEnd: () => isHovered.set(0),
    onFocus: () => isHovered.set(1),
    onBlur: () => isHovered.set(0),
    onClick,
    onKeyDown: handleKeyDown,
    className: itemClassName,
    tabIndex: 0,
    role: 'button',
    'aria-haspopup': 'true' as const,
    'aria-current': active ? ('page' as const) : undefined,
    'aria-label': typeof label === 'string' ? label : undefined,
    'data-active': active || undefined
  };

  // Reduced-motion : tailles fixes, jamais de ressort — même contenu.
  if (reducedMotion) {
    return (
      <motion.div ref={ref} style={{ width: baseItemSize, height: baseItemSize }} {...sharedProps}>
        {Children.map(children, child =>
          React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number>; showLabels?: boolean }>, {
                isHovered,
                showLabels
              })
            : child
        )}
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} style={{ width: size, height: size }} {...sharedProps}>
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number>; showLabels?: boolean }>, {
              isHovered,
              showLabels
            })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  showLabels?: boolean;
};

function DockLabel({ children, className = '', isHovered, showLabels = false }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <>
      {/* Étiquette permanente (lecture immédiate, mobile compris). */}
      {showLabels && <span className="dock__label">{children}</span>}
      {/* Étiquette de survol (tooltip — mécanique de la source). */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`${className} dock__tooltip`}
            role="tooltip"
            style={{ x: '-50%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`dock__icon ${className}`.trim()}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
  showLabels = false,
  activeLabel
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification]);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock__panel ${className}`.trim()}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Navigation principale de l'espace"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
            showLabels={showLabels}
            active={activeLabel !== undefined && item.label === activeLabel}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel showLabels={showLabels}>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

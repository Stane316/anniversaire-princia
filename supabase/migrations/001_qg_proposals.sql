-- ============================================================================
-- PRINCIA — Chapter 18 · Migration Supabase pour le système QG (§9.3–§9.7)
-- ============================================================================
-- Ce script crée :
-- 1. La table `public.qg_proposals` pour synchroniser les propositions entre
--    les appareils de Stane et ceux de Princia sans redéployer la PWA ;
-- 2. Le bucket privé `qg-attachments` (PDF et enregistrements vocaux) ;
-- 3. Les politiques Row Level Security (RLS) :
--    - les fichiers et propositions ne sont pas exposés publiquement sans
--      contrôle : la lecture et le suivi d'avancement requièrent soit une
--      session authentifiée, soit l'en-tête partagé configuré (`app.qg_shared_token`) ;
--    - la création et la suppression sont réservées au compte authentifié
--      de Stane (via Supabase Auth JWT).
-- ============================================================================

create table if not exists public.qg_proposals (
  id text primary key,
  title text not null check (char_length(trim(title)) between 1 and 160),
  description text not null default '' check (char_length(description) <= 4000),
  type text not null check (type in ('resource', 'text', 'exercise', 'pdf', 'audio')),
  author text not null default 'Stane' check (author in ('Stane', 'Princia')),
  status text not null default 'proposed' check (status in ('proposed', 'in-progress', 'completed', 'archived')),
  priority text default 'normal' check (priority in ('normal', 'important')),
  due_date text,
  external_url text,
  attachments jsonb not null default '[]'::jsonb,
  response_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.qg_proposals enable row level security;

-- Fonction utilitaire vérifiant soit que l'utilisateur est authentifié (Stane),
-- soit qu'il présente le jeton de lecture partagé configuré pour l'application de Princia.
create or replace function public.has_qg_shared_access()
returns boolean
language sql
stable
as $$
  select
    auth.role() = 'authenticated'
    or (
      current_setting('app.qg_shared_token', true) is not null
      and current_setting('app.qg_shared_token', true) <> ''
      and coalesce(
        (current_setting('request.headers', true)::json ->> 'x-qg-shared-token'),
        ''
      ) = current_setting('app.qg_shared_token', true)
    );
$$;

-- Lecture autorisée uniquement à Stane (authentifié) et à l'application de Princia
create policy "qg_proposals_select_shared"
  on public.qg_proposals
  for select
  using (public.has_qg_shared_access());

-- Création et suppression réservées au compte authentifié de Stane
create policy "qg_proposals_insert_stane"
  on public.qg_proposals
  for insert
  to authenticated
  with check (true);

create policy "qg_proposals_delete_stane"
  on public.qg_proposals
  for delete
  to authenticated
  using (true);

-- Mise à jour (statut, note de réponse ou édition par Stane)
create policy "qg_proposals_update_shared"
  on public.qg_proposals
  for update
  using (public.has_qg_shared_access())
  with check (public.has_qg_shared_access());

-- Bucket privé pour les pièces jointes PDF et audio (jamais public par défaut)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'qg-attachments',
  'qg-attachments',
  false,
  15728640,
  array[
    'application/pdf',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/x-m4a'
  ]
)
on conflict (id) do nothing;

create policy "qg_attachments_read_shared"
  on storage.objects
  for select
  using (bucket_id = 'qg-attachments' and public.has_qg_shared_access());

create policy "qg_attachments_insert_stane"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'qg-attachments');

create policy "qg_attachments_delete_stane"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'qg-attachments');

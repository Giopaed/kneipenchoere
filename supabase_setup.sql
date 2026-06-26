-- Kneipenchöre Forum – Supabase Setup
-- In Supabase öffnen: SQL Editor → New query → diesen Inhalt einfügen → Run

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  choir_name text not null,
  role text not null default 'chor_admin',
  created_at timestamptz not null default now()
);

create table if not exists forum_topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  body text not null,
  status text not null default 'offen',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references forum_topics(id) on delete cascade,
  body text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table forum_topics enable row level security;
alter table forum_replies enable row level security;

-- Vorhandene Policies entfernen, falls das Skript mehrfach ausgeführt wird.
drop policy if exists "Angemeldete Nutzer lesen Profile" on profiles;
drop policy if exists "Angemeldete Nutzer lesen Themen" on forum_topics;
drop policy if exists "Angemeldete Nutzer erstellen Themen" on forum_topics;
drop policy if exists "Eigene Themen bearbeiten oder Admin" on forum_topics;
drop policy if exists "Angemeldete Nutzer lesen Antworten" on forum_replies;
drop policy if exists "Angemeldete Nutzer erstellen Antworten" on forum_replies;

create policy "Angemeldete Nutzer lesen Profile"
on profiles for select
to authenticated
using (true);

create policy "Angemeldete Nutzer lesen Themen"
on forum_topics for select
to authenticated
using (true);

create policy "Angemeldete Nutzer erstellen Themen"
on forum_topics for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Eigene Themen bearbeiten oder Admin"
on forum_topics for update
to authenticated
using (
  auth.uid() = created_by
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
)
with check (
  auth.uid() = created_by
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Angemeldete Nutzer lesen Antworten"
on forum_replies for select
to authenticated
using (true);

create policy "Angemeldete Nutzer erstellen Antworten"
on forum_replies for insert
to authenticated
with check (auth.uid() = created_by);

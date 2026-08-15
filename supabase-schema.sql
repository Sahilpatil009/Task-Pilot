-- Supabase schema for Task Pilot
-- Run this SQL in your Supabase project's SQL editor.

-- 1. Create boards table
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  color text not null default 'bg-blue-500',
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create columns table
create table if not exists public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.columns(id) on delete cascade,
  title text not null,
  description text,
  assignee text,
  due_date date,
  priority text not null default 'low' check (priority in ('low', 'medium', 'high')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Secure Data API access for Clerk-authenticated users.
-- Clerk's Supabase integration adds role=authenticated and exposes the Clerk
-- user ID as auth.jwt()->>'sub'. Anonymous visitors receive no table access.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table
  public.boards,
  public.columns,
  public.tasks
to authenticated;

revoke all on table
  public.boards,
  public.columns,
  public.tasks
from anon;

alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.tasks enable row level security;

-- 5. Board ownership policies.
drop policy if exists "Users can read their boards" on public.boards;
drop policy if exists "Users can create their boards" on public.boards;
drop policy if exists "Users can update their boards" on public.boards;
drop policy if exists "Users can delete their boards" on public.boards;

create policy "Users can read their boards"
on public.boards for select to authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "Users can create their boards"
on public.boards for insert to authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can update their boards"
on public.boards for update to authenticated
using ((select auth.jwt()->>'sub') = user_id)
with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can delete their boards"
on public.boards for delete to authenticated
using ((select auth.jwt()->>'sub') = user_id);

-- 6. Column ownership policies.
drop policy if exists "Users can read their columns" on public.columns;
drop policy if exists "Users can create their columns" on public.columns;
drop policy if exists "Users can update their columns" on public.columns;
drop policy if exists "Users can delete their columns" on public.columns;

create policy "Users can read their columns"
on public.columns for select to authenticated
using ((select auth.jwt()->>'sub') = user_id);

create policy "Users can create their columns"
on public.columns for insert to authenticated
with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can update their columns"
on public.columns for update to authenticated
using ((select auth.jwt()->>'sub') = user_id)
with check ((select auth.jwt()->>'sub') = user_id);

create policy "Users can delete their columns"
on public.columns for delete to authenticated
using ((select auth.jwt()->>'sub') = user_id);

-- 7. Tasks inherit ownership from their parent column. The update check also
-- prevents drag-and-drop from moving a task into another user's column.
drop policy if exists "Users can read their tasks" on public.tasks;
drop policy if exists "Users can create their tasks" on public.tasks;
drop policy if exists "Users can update their tasks" on public.tasks;
drop policy if exists "Users can delete their tasks" on public.tasks;

create policy "Users can read their tasks"
on public.tasks for select to authenticated
using (
  exists (
    select 1 from public.columns
    where columns.id = tasks.column_id
      and columns.user_id = (select auth.jwt()->>'sub')
  )
);

create policy "Users can create their tasks"
on public.tasks for insert to authenticated
with check (
  exists (
    select 1 from public.columns
    where columns.id = tasks.column_id
      and columns.user_id = (select auth.jwt()->>'sub')
  )
);

create policy "Users can update their tasks"
on public.tasks for update to authenticated
using (
  exists (
    select 1 from public.columns
    where columns.id = tasks.column_id
      and columns.user_id = (select auth.jwt()->>'sub')
  )
)
with check (
  exists (
    select 1 from public.columns
    where columns.id = tasks.column_id
      and columns.user_id = (select auth.jwt()->>'sub')
  )
);

create policy "Users can delete their tasks"
on public.tasks for delete to authenticated
using (
  exists (
    select 1 from public.columns
    where columns.id = tasks.column_id
      and columns.user_id = (select auth.jwt()->>'sub')
  )
);

-- 8. Index the ownership and relationship columns used by dashboard queries
-- and RLS checks.
create index if not exists boards_user_id_idx on public.boards(user_id);
create index if not exists columns_user_id_idx on public.columns(user_id);
create index if not exists columns_board_id_idx on public.columns(board_id);
create index if not exists tasks_column_id_idx on public.tasks(column_id);

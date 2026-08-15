-- ============================================================================
-- Meridian — Schema do banco de dados (Supabase / PostgreSQL)
-- ============================================================================
-- Como usar:
-- 1. Abra o painel do seu projeto Supabase -> SQL Editor -> New query
-- 2. Cole todo o conteúdo deste arquivo e execute (Run)
-- 3. Confira em Table Editor se as tabelas "professional_tasks",
--    "personal_activities" e "attachments" foram criadas
-- 4. Confira em Storage se o bucket "attachments" foi criado
-- ============================================================================

-- Extensão para geração de UUIDs
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabela: professional_tasks
-- ----------------------------------------------------------------------------
create table if not exists public.professional_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  requester text,
  start_date date,
  due_date date,
  responsible text,
  priority text not null default 'media' check (priority in ('baixa','media','alta','urgente')),
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_professional_tasks_user_id on public.professional_tasks(user_id);
create index if not exists idx_professional_tasks_due_date on public.professional_tasks(due_date);
create index if not exists idx_professional_tasks_status on public.professional_tasks(status);

-- ----------------------------------------------------------------------------
-- Tabela: personal_activities
-- ----------------------------------------------------------------------------
create table if not exists public.personal_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'pessoal' check (
    category in (
      'trabalho','aws_cloud','ingles','espanhol','programacao',
      'estudos','exercicios','projeto_pessoal','curso','pessoal','outros'
    )
  ),
  date date not null,
  start_time time,
  end_time time,
  priority text not null default 'media' check (priority in ('baixa','media','alta','urgente')),
  status text not null default 'pendente' check (status in ('pendente','em_andamento','concluida')),
  recurrence text not null default 'nenhuma' check (recurrence in ('nenhuma','diaria','semanal','mensal')),
  recurrence_days int[],
  recurrence_group_id uuid,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_personal_activities_user_id on public.personal_activities(user_id);
create index if not exists idx_personal_activities_date on public.personal_activities(date);
create index if not exists idx_personal_activities_status on public.personal_activities(status);

-- ----------------------------------------------------------------------------
-- Tabela: attachments (metadados; os arquivos ficam no Supabase Storage)
-- ----------------------------------------------------------------------------
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  owner_type text not null check (owner_type in ('professional_task','personal_activity')),
  owner_id uuid not null,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  content_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_attachments_owner on public.attachments(owner_type, owner_id);
create index if not exists idx_attachments_user_id on public.attachments(user_id);

-- ----------------------------------------------------------------------------
-- Trigger: manter "updated_at" sempre atualizado
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_professional_tasks_updated_at on public.professional_tasks;
create trigger trg_professional_tasks_updated_at
  before update on public.professional_tasks
  for each row execute function public.set_updated_at();

drop trigger if exists trg_personal_activities_updated_at on public.personal_activities;
create trigger trg_personal_activities_updated_at
  before update on public.personal_activities
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só pode criar, ver, editar e excluir seus próprios registros.
-- ============================================================================

alter table public.professional_tasks enable row level security;
alter table public.personal_activities enable row level security;
alter table public.attachments enable row level security;

-- professional_tasks -----------------------------------------------------
drop policy if exists "professional_tasks_select_own" on public.professional_tasks;
create policy "professional_tasks_select_own"
  on public.professional_tasks for select
  using (auth.uid() = user_id);

drop policy if exists "professional_tasks_insert_own" on public.professional_tasks;
create policy "professional_tasks_insert_own"
  on public.professional_tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "professional_tasks_update_own" on public.professional_tasks;
create policy "professional_tasks_update_own"
  on public.professional_tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "professional_tasks_delete_own" on public.professional_tasks;
create policy "professional_tasks_delete_own"
  on public.professional_tasks for delete
  using (auth.uid() = user_id);

-- personal_activities ------------------------------------------------------
drop policy if exists "personal_activities_select_own" on public.personal_activities;
create policy "personal_activities_select_own"
  on public.personal_activities for select
  using (auth.uid() = user_id);

drop policy if exists "personal_activities_insert_own" on public.personal_activities;
create policy "personal_activities_insert_own"
  on public.personal_activities for insert
  with check (auth.uid() = user_id);

drop policy if exists "personal_activities_update_own" on public.personal_activities;
create policy "personal_activities_update_own"
  on public.personal_activities for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "personal_activities_delete_own" on public.personal_activities;
create policy "personal_activities_delete_own"
  on public.personal_activities for delete
  using (auth.uid() = user_id);

-- attachments ----------------------------------------------------------------
drop policy if exists "attachments_select_own" on public.attachments;
create policy "attachments_select_own"
  on public.attachments for select
  using (auth.uid() = user_id);

drop policy if exists "attachments_insert_own" on public.attachments;
create policy "attachments_insert_own"
  on public.attachments for insert
  with check (auth.uid() = user_id);

drop policy if exists "attachments_update_own" on public.attachments;
create policy "attachments_update_own"
  on public.attachments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "attachments_delete_own" on public.attachments;
create policy "attachments_delete_own"
  on public.attachments for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- SUPABASE STORAGE — bucket de anexos
-- ============================================================================
-- Cria o bucket "attachments" como privado (não público). O acesso aos
-- arquivos é feito via signed URLs geradas pelo backend/frontend autenticado.
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

-- Política de storage: cada usuário só acessa arquivos dentro da sua própria
-- pasta. A aplicação sempre salva os arquivos no caminho:
--   {user_id}/{owner_type}/{owner_id}/{timestamp}-{nome-do-arquivo}
-- então validamos que o primeiro segmento do caminho é o próprio auth.uid().

drop policy if exists "attachments_storage_select_own" on storage.objects;
create policy "attachments_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "attachments_storage_insert_own" on storage.objects;
create policy "attachments_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "attachments_storage_update_own" on storage.objects;
create policy "attachments_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "attachments_storage_delete_own" on storage.objects;
create policy "attachments_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'attachments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Fim do script. Após executar, ative "Enable email confirmations" (opcional)
-- em Authentication -> Providers -> Email, conforme sua preferência.
-- ============================================================================

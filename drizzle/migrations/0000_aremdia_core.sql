-- Roles
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "usuario ve seus papeis" on public.user_roles
for select to authenticated using (user_id = auth.uid());

-- Primeiro usuario autenticado vira admin (apenas se nao existir admin)
create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return exists (select 1 from public.user_roles where user_id = uid and role = 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
  on conflict do nothing;
  return true;
end;
$$;
grant execute on function public.claim_admin() to authenticated;

-- Leads
create type public.lead_status as enum ('novo','contatado','fechado','perdido');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  bairro text not null,
  qtd_aparelhos int not null default 1,
  btus text not null default '',
  ultima_limpeza date,
  ultima_limpeza_desconhecida boolean not null default false,
  status public.lead_status not null default 'novo',
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon;
grant insert on public.leads to authenticated;
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "publico cria lead" on public.leads for insert to anon with check (true);
create policy "autenticado cria lead" on public.leads for insert to authenticated with check (true);
create policy "admin le leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin edita leads" on public.leads for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin apaga leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- Clientes
create type public.assinatura_status as enum ('ativa','cancelada');

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  bairro text not null,
  status public.assinatura_status not null default 'ativa',
  data_inicio date not null default current_date,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.clientes to authenticated;
grant all on public.clientes to service_role;
alter table public.clientes enable row level security;
create policy "admin gerencia clientes" on public.clientes for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Aparelhos
create table public.aparelhos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  apelido text not null default 'Aparelho',
  btus int not null default 9000,
  ultima_limpeza date,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.aparelhos to authenticated;
grant all on public.aparelhos to service_role;
alter table public.aparelhos enable row level security;
create policy "admin gerencia aparelhos" on public.aparelhos for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Visitas
create type public.visita_status as enum ('agendada','feita','cancelada');

create table public.visitas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  aparelho_id uuid references public.aparelhos(id) on delete set null,
  data date not null,
  tecnico text not null default '',
  status public.visita_status not null default 'agendada',
  observacoes text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.visitas to authenticated;
grant all on public.visitas to service_role;
alter table public.visitas enable row level security;
create policy "admin gerencia visitas" on public.visitas for all to authenticated
using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Ao marcar visita como feita, atualiza ultima limpeza do aparelho
create or replace function public.sync_ultima_limpeza()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'feita' and new.aparelho_id is not null then
    update public.aparelhos set ultima_limpeza = new.data where id = new.aparelho_id;
  end if;
  return new;
end;
$$;
create trigger trg_sync_ultima_limpeza
after insert or update on public.visitas
for each row execute function public.sync_ultima_limpeza();

-- Dados ficticios de exemplo
insert into public.leads (nome, whatsapp, bairro, qtd_aparelhos, btus, ultima_limpeza, ultima_limpeza_desconhecida, status) values
('Marina Alves','5511988887777','Pinheiros',2,'9000, 12000','2026-03-10',false,'novo'),
('Rafael Souza','5511977776666','Tatuapé',1,'12000',null,true,'contatado'),
('Juliana Prado','5511966665555','Moema',2,'9000, 18000','2025-11-02',false,'fechado'),
('Carlos Menezes','5511955554444','Santana',1,'9000',null,true,'perdido');

insert into public.clientes (id, nome, whatsapp, bairro, status, data_inicio) values
('11111111-1111-1111-1111-111111111111','Juliana Prado','5511966665555','Moema','ativa','2026-01-15'),
('22222222-2222-2222-2222-222222222222','Eduardo Lima','5511944443333','Vila Mariana','ativa','2025-09-01'),
('33333333-3333-3333-3333-333333333333','Patrícia Nunes','5511933332222','Perdizes','cancelada','2025-05-20');

insert into public.aparelhos (id, cliente_id, apelido, btus, ultima_limpeza) values
('aaaaaaa1-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111','Sala',12000,'2026-04-05'),
('aaaaaaa2-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Quarto',9000,'2026-01-20'),
('aaaaaaa3-3333-3333-3333-333333333333','22222222-2222-2222-2222-222222222222','Sala',18000,'2026-03-25'),
('aaaaaaa4-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333','Quarto',9000,'2025-08-10');

insert into public.visitas (cliente_id, aparelho_id, data, tecnico, status, observacoes) values
('11111111-1111-1111-1111-111111111111','aaaaaaa1-1111-1111-1111-111111111111','2026-10-02','Bruno','agendada','Portaria avisada'),
('22222222-2222-2222-2222-222222222222','aaaaaaa3-3333-3333-3333-333333333333','2026-10-04','Tiago','agendada',''),
('11111111-1111-1111-1111-111111111111','aaaaaaa2-2222-2222-2222-222222222222','2026-01-20','Bruno','feita','Filtro trocado');
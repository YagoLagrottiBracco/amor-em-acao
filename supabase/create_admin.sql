-- ============================================================================
-- ASSOCIAÇÃO HUMANITÁRIA AMOR EM AÇÃO
-- SCRIPT DE CRIAÇÃO / ATUALIZAÇÃO DO USUÁRIO ADMINISTRADOR NO SUPABASE AUTH
-- ============================================================================
-- Como executar:
-- 1. Acesse o painel do seu projeto no Supabase: https://supabase.com/dashboard
-- 2. No menu lateral esquerdo, clique em "SQL Editor" -> "New query"
-- 3. Caso queira um e-mail ou senha específicos, edite as variáveis abaixo:
--      target_email    := 'contato@amoremacao.org';
--      target_password := 'AmorEmAcao@2026Admin!';
-- 4. Clique em "Run" (ou pressione Ctrl+Enter / Cmd+Enter).
--
-- Dica Alternativa (via Interface Gráfica do Supabase):
-- Você também pode criar o usuário com facilidade pelo painel do Supabase:
-- Acesse "Authentication" -> "Users" -> "Add User" -> "Create User",
-- preencha o e-mail e a senha e marque a opção "Auto Confirm User".
-- ============================================================================

create extension if not exists "pgcrypto";

do $$
declare
  target_email text := 'contato@amoremacao.org';
  target_password text := 'AmorEmAcao@2026Admin!';
  target_user_id uuid;
  encrypted_pass text;
  id_data_type text;
  has_provider_id boolean;
begin
  -- Gera o hash bcrypt da senha fornecida
  encrypted_pass := crypt(target_password, gen_salt('bf', 10));

  -- Verifica se o usuário já existe na tabela auth.users
  select id into target_user_id from auth.users where email = target_email limit 1;

  if target_user_id is null then
    target_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      target_user_id,
      'authenticated',
      'authenticated',
      target_email,
      encrypted_pass,
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"admin","name":"Administrador Amor em Ação"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Detecta o tipo da coluna 'id' em auth.identities (uuid vs text)
    select coalesce(data_type, 'uuid') into id_data_type
    from information_schema.columns
    where table_schema = 'auth' and table_name = 'identities' and column_name = 'id';

    -- Verifica se a coluna 'provider_id' existe na tabela auth.identities
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'auth' and table_name = 'identities' and column_name = 'provider_id'
    ) into has_provider_id;

    if has_provider_id then
      if id_data_type = 'uuid' then
        execute 'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, $4, now(), now(), now()) on conflict do nothing'
        using target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email', target_user_id::text;
      else
        execute 'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values ($1, $2, $3, $4, $5, now(), now(), now()) on conflict do nothing'
        using target_user_id::text, target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email', target_user_id::text;
      end if;
    else
      if id_data_type = 'uuid' then
        execute 'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, now(), now(), now()) on conflict do nothing'
        using target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email';
      else
        execute 'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values ($1, $2, $3, $4, now(), now(), now()) on conflict do nothing'
        using target_user_id::text, target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email';
      end if;
    end if;

    raise notice 'Sucesso: Usuário admin criado com sucesso para o e-mail: % (ID: %)', target_email, target_user_id;
  else
    -- Atualiza a senha e confirma o e-mail do usuário existente
    update auth.users
    set
      encrypted_password = encrypted_pass,
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb,
      updated_at = now()
    where id = target_user_id;

    -- Detecta o tipo da coluna 'id' em auth.identities (uuid vs text)
    select coalesce(data_type, 'uuid') into id_data_type
    from information_schema.columns
    where table_schema = 'auth' and table_name = 'identities' and column_name = 'id';

    -- Verifica se a coluna 'provider_id' existe na tabela auth.identities
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'auth' and table_name = 'identities' and column_name = 'provider_id'
    ) into has_provider_id;

    if not exists (select 1 from auth.identities where user_id = target_user_id and provider = 'email') then
      if has_provider_id then
        if id_data_type = 'uuid' then
          execute 'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, $4, now(), now(), now()) on conflict do nothing'
          using target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email', target_user_id::text;
        else
          execute 'insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at) values ($1, $2, $3, $4, $5, now(), now(), now()) on conflict do nothing'
          using target_user_id::text, target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email', target_user_id::text;
        end if;
      else
        if id_data_type = 'uuid' then
          execute 'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values (gen_random_uuid(), $1, $2, $3, now(), now(), now()) on conflict do nothing'
          using target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email';
        else
          execute 'insert into auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values ($1, $2, $3, $4, now(), now(), now()) on conflict do nothing'
          using target_user_id::text, target_user_id, json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb, 'email';
        end if;
      end if;
    else
      update auth.identities
      set
        identity_data = json_build_object('sub', target_user_id::text, 'email', target_email)::jsonb,
        updated_at = now()
      where user_id = target_user_id and provider = 'email';
    end if;

    raise notice 'Sucesso: Usuário admin existente atualizado com sucesso para o e-mail: % (ID: %)', target_email, target_user_id;
  end if;
end $$;

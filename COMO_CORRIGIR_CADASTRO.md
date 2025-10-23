# =' Como Corrigir Erro no Cadastro

## L Erro: "Database error saving new user"

Este erro ocorre quando a fun��o `handle_new_user()` falha ao inserir dados na tabela `public.users` ap�s o signup.

---

## � CORRE��O R�PIDA (3 minutos)

### **Op��o 1: Executar Script de Corre��o (Recomendado)**

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto
3. V� em **SQL Editor** � **New Query**
4. Abra o arquivo `FIX_CADASTRO.sql` deste projeto
5. Copie **TODO** o conte�do
6. Cole no SQL Editor
7. Clique em **RUN** (ou Ctrl+Enter)
8. Aguarde ~5 segundos

Voc� ver� mensagens tipo:
```
 Triggers e fun��es antigas removidas
 Fun��o handle_new_user() recriada
 Trigger on_auth_user_created recriado
 Constraints UNIQUE adicionadas
<� SUCESSO! Fun��o e trigger est�o ativos!
```

### **Op��o 2: Executar via Supabase CLI**

```bash
# Na pasta do projeto
supabase db push --file supabase/migrations/20250123_fix_handle_new_user.sql
```

---

## >� Testar se Funcionou

### Teste 1: Ver se fun��o existe

No SQL Editor:

```sql
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user'
AND pronamespace = 'public'::regnamespace;
```

Deve retornar 1 linha com o c�digo da fun��o.

### Teste 2: Ver se trigger existe

```sql
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Deve retornar:
```
tgname: on_auth_user_created
tgenabled: O (significa "ativo")
```

### Teste 3: Cadastrar usu�rio

1. No app, v� em `/cadastro`
2. Preencha:
   - Nome: Teste Silva
   - Email: teste@example.com
   - Senha: senha123
3. Clique em **Criar conta**

 **Deve funcionar sem erro!**

### Teste 4: Verificar se usu�rio foi criado

No SQL Editor:

```sql
-- Ver usu�rios criados recentemente
SELECT
    u.id,
    u.email,
    u.name,
    u.has_active_token,
    u.created_at,
    au.email as auth_email,
    au.created_at as auth_created_at
FROM public.users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC
LIMIT 5;
```

Deve listar seu usu�rio! 

---

## = Diagn�stico: Por que deu erro?

### Causa 1: Fun��o n�o existia

Se a migration inicial n�o foi executada corretamente, a fun��o `handle_new_user()` n�o foi criada.

**Verificar:**
```sql
SELECT COUNT(*) FROM pg_proc WHERE proname = 'handle_new_user';
```

Se retornar `0`, a fun��o n�o existe.

### Causa 2: Trigger desativado ou n�o existe

O trigger pode estar desativado ou n�o ter sido criado.

**Verificar:**
```sql
SELECT tgname, tgenabled FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Se n�o retornar nada, o trigger n�o existe.

Se retornar `tgenabled = D`, o trigger est� desativado.

### Causa 3: Constraint UNIQUE faltando

Se as constraints `UNIQUE` n�o existem nas tabelas `user_streaks` ou `subscriptions`, pode dar erro ao tentar inserir duplicado.

**Verificar:**
```sql
SELECT conname, contype FROM pg_constraint
WHERE conname IN ('user_streaks_user_id_key', 'subscriptions_user_id_key');
```

Deve retornar 2 linhas.

### Causa 4: Permiss�es RLS

Row Level Security pode estar bloqueando inser��es.

**Verificar:**
```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'user_streaks', 'subscriptions');
```

Se `rowsecurity = true`, verifique as pol�ticas:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('users', 'user_streaks', 'subscriptions');
```

---

## =� Corre��es Adicionais

### Se ainda der erro ap�s executar FIX_CADASTRO.sql

#### 1. Verificar logs do Supabase

Dashboard � **Logs** � **Postgres Logs**

Procure por:
- `ERROR:` ou `WARNING:`
- Mensagens relacionadas a `handle_new_user`

#### 2. Desabilitar RLS temporariamente (apenas para teste)

```sql
-- CUIDADO: Isso remove a seguran�a temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- Tente cadastrar novamente

-- Depois, reabilite:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
```

#### 3. Limpar tabelas e recriar (apenas se necess�rio)

� **ATEN��O: Isso vai apagar TODOS os dados!**

```sql
-- Backup primeiro!
-- CREATE TABLE users_backup AS SELECT * FROM public.users;

-- Limpar
TRUNCATE public.users, public.user_streaks, public.subscriptions CASCADE;

-- Recriar fun��o e trigger
-- Execute FIX_CADASTRO.sql novamente
```

#### 4. Recriar tabela users (�ltimo recurso)

```sql
-- Backup
CREATE TABLE users_backup AS SELECT * FROM public.users;

-- Dropar e recriar
DROP TABLE public.users CASCADE;

-- Execute a migration inicial novamente:
-- supabase/migrations/20250121_init_detox_mental.sql
```

---

## =� Checklist de Verifica��o

Ap�s executar a corre��o, verifique:

- [ ] Fun��o `handle_new_user()` existe
- [ ] Trigger `on_auth_user_created` est� ativo
- [ ] Constraints UNIQUE existem em `user_streaks` e `subscriptions`
- [ ] RLS est� habilitado mas n�o bloqueando
- [ ] Pol�ticas de RLS permitem INSERT via trigger
- [ ] Cadastro funciona sem erro
- [ ] Usu�rio aparece em `public.users` ap�s cadastro
- [ ] Streak inicial � criada automaticamente
- [ ] Assinatura free � criada automaticamente

---

## <� Fluxo Esperado (Como DEVE Funcionar)

```
1. Usu�rio preenche formul�rio de cadastro
   �
2. Frontend chama signUpWithEmail()
   �
3. Supabase Auth cria registro em auth.users
   �
4. Trigger on_auth_user_created dispara
   �
5. Fun��o handle_new_user() executa:
   - Insere em public.users 
   - Insere em public.user_streaks 
   - Insere em public.subscriptions 
   - Verifica token pendente 
   �
6. Cadastro conclu�do com sucesso! <�
```

---

## <� Ainda n�o funcionou?

Se ap�s executar `FIX_CADASTRO.sql` o erro persistir:

### 1. Copiar mensagem de erro exata

No console do navegador (F12 � Console), copie a mensagem completa.

### 2. Ver logs do Supabase

Dashboard � **Logs** � **Postgres Logs**

Procure o timestamp do erro e veja a mensagem completa.

### 3. Testar manualmente

Execute este SQL para simular o que o trigger faz:

```sql
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    -- Inserir em auth.users (simulado)
    -- Inserir em public.users (manual)
    INSERT INTO public.users (id, email, name, created_at, last_login)
    VALUES (test_id, 'teste_manual@example.com', 'Teste Manual', NOW(), NOW());

    RAISE NOTICE 'Usu�rio criado: %', test_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'ERRO: %', SQLERRM;
END $$;
```

Se esse comando der erro, o problema est� nas permiss�es ou estrutura da tabela.

---

##  Ap�s Corrigir

Execute o teste completo:

```bash
# Local
npm run dev

# Acesse
http://localhost:5173/cadastro

# Cadastre:
Nome: Jo�o Silva
Email: joao@example.com
Senha: senha123

# Deve funcionar! 
```

Depois verifique no Supabase:

```sql
SELECT * FROM public.users WHERE email = 'joao@example.com';
SELECT * FROM public.user_streaks WHERE user_id = (SELECT id FROM public.users WHERE email = 'joao@example.com');
SELECT * FROM public.subscriptions WHERE user_id = (SELECT id FROM public.users WHERE email = 'joao@example.com');
```

Deve retornar 1 linha em cada tabela! 

---

## =� Suporte

Se o erro persistir, envie:

1. Mensagem de erro exata
2. Logs do Supabase (Postgres Logs)
3. Resultado de:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

---

**Desenvolvido com d por Claude Code**

=' _"Bugs existem para serem corrigidos"_

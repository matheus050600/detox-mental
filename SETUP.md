# >�B Detox Mental - Guia Completo de Instala��o e Configura��o

Este guia vai te ajudar a configurar completamente o projeto **Detox Mental** integrado com o **Supabase**.

---

## =� Pr�-requisitos

Certifique-se de ter instalado:

- **Node.js** (vers�o 18 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** ou **yarn**
- **Conta no Supabase** (gratuita) - [Criar conta](https://supabase.com/)
- **Supabase CLI** (opcional, mas recomendado) - [Instalar CLI](https://supabase.com/docs/guides/cli)

---

## =� Passo 1: Clonar e Instalar Depend�ncias

```bash
# Navegue at� a pasta do projeto
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"

# Instale as depend�ncias
npm install
```

---

## =' Passo 2: Configurar Vari�veis de Ambiente

### 2.1 Criar arquivo `.env`

Na raiz do projeto, copie o arquivo `.env.example`:

```bash
# Windows (CMD)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 2.2 Obter credenciais do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com/)
2. Selecione seu projeto (ou crie um novo)
3. No menu lateral, v� em **Project Settings** � **API**
4. Copie as seguintes informa��es:
   - **Project URL** (exemplo: `https://xxxxxxxxxxx.supabase.co`)
   - **anon public key** (chave longa come�ando com `eyJhbGc...`)

### 2.3 Editar o arquivo `.env`

Abra o arquivo `.env` e substitua os valores:

```env
# URL do seu projeto Supabase
VITE_SUPABASE_URL=https://uetgenymwhiadqczpicc.supabase.co

# Chave p�blica (anon key) do Supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui_muito_longa
```

> � **IMPORTANTE**: Nunca commite o arquivo `.env` no Git! Ele j� est� no `.gitignore`.

---

## =� Passo 3: Configurar Banco de Dados no Supabase

### Op��o A: Usando o Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie **TODO** o conte�do do arquivo:
   ```
   supabase/migrations/20250121_init_detox_mental.sql
   ```
6. Cole no editor e clique em **Run** (ou pressione `Ctrl+Enter`)
7. Aguarde a execu��o (deve levar alguns segundos)
8. Voc� ver� a mensagem "Success. No rows returned"

### Op��o B: Usando Supabase CLI (para usu�rios avan�ados)

```bash
# Certifique-se de estar na pasta do projeto
supabase db push
```

###  Verificar se as tabelas foram criadas

No Dashboard do Supabase:

1. V� em **Table Editor**
2. Voc� deve ver as seguintes tabelas:
   - `users`
   - `meditations`
   - `user_progress`
   - `user_streaks`
   - `subscriptions`
   - `user_sessions`

---

## >� Passo 4: Testar a Aplica��o

### 4.1 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O projeto ser� aberto em: `http://localhost:5173/`

### 4.2 Criar sua primeira conta

1. Na p�gina inicial, clique em **"Criar conta"** ou acesse `/cadastro`
2. Preencha:
   - Nome completo
   - E-mail
   - Senha (m�nimo 6 caracteres)
3. Clique em **"Criar conta"**
4. Voc� receber� um e-mail de confirma��o do Supabase
5. Clique no link de confirma��o no e-mail
6. Volte para o app e fa�a login em `/login`

### 4.3 Verificar integra��o

Ap�s fazer login, verifique se:

-  Voc� foi redirecionado para `/hoje`
-  Seu nome aparece no cabe�alho
-  O perfil (`/perfil`) mostra suas estat�sticas
-  A se��o "Assinatura" mostra **"Plano Premium - R$ 19,90"**
-  Sequ�ncia (streak) est� zerada inicialmente

---

## =� Passo 5: Verificar Dados no Supabase

### Verificar se o usu�rio foi criado

1. No Dashboard do Supabase, v� em **Authentication** � **Users**
2. Voc� deve ver seu usu�rio listado

### Verificar tabelas populadas

1. V� em **Table Editor**
2. Clique em `users` - deve ter seu registro
3. Clique em `user_streaks` - deve ter um registro com streak = 0
4. Clique em `subscriptions` - deve ter um registro com:
   - `plan`: premium
   - `price`: 19.90
   - `status`: active

---

## <� Passo 6: Build para Produ��o

Quando estiver pronto para fazer o build final:

```bash
npm run build
```

Os arquivos otimizados ser�o gerados na pasta `dist/`.

Para testar o build localmente:

```bash
npm run preview
```

---

## = Seguran�a e Boas Pr�ticas

###  Configura��es importantes j� implementadas:

1. **Row Level Security (RLS)** habilitado em todas as tabelas
2. **Pol�ticas de seguran�a** configuradas (usu�rios s� veem seus pr�prios dados)
3. **Triggers autom�ticos** para criar registros iniciais ao cadastrar
4. **Views otimizadas** para consultas complexas

### � Pr�ximos passos recomendados:

1. **Configurar autentica��o por e-mail**:
   - No Supabase: **Authentication** � **Settings** � **Email Templates**
   - Customize os templates de confirma��o e recupera��o de senha

2. **Ativar Google OAuth** (opcional):
   - **Authentication** � **Providers** � **Google**
   - Configure Client ID e Client Secret

3. **Desabilitar confirma��o de e-mail** (apenas para desenvolvimento):
   - **Authentication** � **Settings** � Desative "Enable email confirmations"

---

## =� Estrutura do Banco de Dados

### Tabelas criadas:

| Tabela | Descri��o |
|--------|-----------|
| `users` | Dados do usu�rio (nome, email, plano, etc.) |
| `meditations` | Cat�logo de medita��es dispon�veis |
| `user_progress` | Progresso individual em cada medita��o |
| `user_streaks` | Sequ�ncias di�rias de medita��o |
| `subscriptions` | Planos e assinaturas |
| `user_sessions` | Hist�rico completo de sess�es |

### Views (consultas otimizadas):

- `user_stats` - Estat�sticas agregadas do usu�rio
- `user_complete_profile` - Perfil completo (perfil + stats)
- `popular_meditations` - Medita��es mais tocadas

---

## = Solu��o de Problemas

### L Erro: "Variables de ambiente n�o configuradas"

**Causa**: Arquivo `.env` n�o foi criado ou est� vazio.

**Solu��o**:
```bash
copy .env.example .env
# Edite o .env com suas credenciais reais
```

### L Erro ao fazer login: "Invalid login credentials"

**Causa**: E-mail ainda n�o foi confirmado.

**Solu��o**:
1. Verifique sua caixa de entrada (e spam)
2. Clique no link de confirma��o
3. Ou desabilite confirma��o de e-mail no Supabase (apenas dev)

### L Erro: "relation 'users' does not exist"

**Causa**: Migration SQL n�o foi executada.

**Solu��o**: Execute novamente o script SQL no **SQL Editor** do Supabase.

### L Perfil n�o carrega ou mostra dados vazios

**Causa**: Trigger `handle_new_user` pode n�o ter executado.

**Solu��o**: Execute manualmente no SQL Editor:
```sql
-- Verificar se seu usu�rio existe na tabela users
SELECT * FROM auth.users LIMIT 1;

-- Se n�o existir registro em public.users, execute:
INSERT INTO public.users (id, email, name, created_at, last_login)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Usu�rio'), created_at, NOW()
FROM auth.users
WHERE id = 'SEU_USER_ID_AQUI';
```

---

## <� Pronto!

Agora seu **Detox Mental** est� completamente integrado com o Supabase!

### Pr�ximos passos sugeridos:

1.  Adicionar �udios reais de medita��o na tabela `meditations`
2.  Implementar player de �udio com progresso em tempo real
3.  Criar dashboard administrativo para gerenciar medita��es
4.  Integrar pagamento (Stripe, Mercado Pago, etc.)
5.  Implementar notifica��es push para lembrar de meditar

---

## =� Suporte

Se tiver problemas, verifique:

- [Documenta��o do Supabase](https://supabase.com/docs)
- [Documenta��o do Vite](https://vitejs.dev/)
- [Documenta��o do React Router](https://reactrouter.com/)

---

**Desenvolvido com d por Claude Code**

>�B _"Cada respira��o � um novo come�o"_

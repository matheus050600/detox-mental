# >ØB Detox Mental - Guia Completo de Instalação e Configuração

Este guia vai te ajudar a configurar completamente o projeto **Detox Mental** integrado com o **Supabase**.

---

## =Ë Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** ou **yarn**
- **Conta no Supabase** (gratuita) - [Criar conta](https://supabase.com/)
- **Supabase CLI** (opcional, mas recomendado) - [Instalar CLI](https://supabase.com/docs/guides/cli)

---

## =€ Passo 1: Clonar e Instalar Dependências

```bash
# Navegue até a pasta do projeto
cd "C:\Users\mathe\Downloads\detox mental backup - Copia\breath-essence-app-main"

# Instale as dependências
npm install
```

---

## =' Passo 2: Configurar Variáveis de Ambiente

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
3. No menu lateral, vá em **Project Settings** ’ **API**
4. Copie as seguintes informações:
   - **Project URL** (exemplo: `https://xxxxxxxxxxx.supabase.co`)
   - **anon public key** (chave longa começando com `eyJhbGc...`)

### 2.3 Editar o arquivo `.env`

Abra o arquivo `.env` e substitua os valores:

```env
# URL do seu projeto Supabase
VITE_SUPABASE_URL=https://uetgenymwhiadqczpicc.supabase.co

# Chave pública (anon key) do Supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui_muito_longa
```

>   **IMPORTANTE**: Nunca commite o arquivo `.env` no Git! Ele já está no `.gitignore`.

---

## =Ä Passo 3: Configurar Banco de Dados no Supabase

### Opção A: Usando o Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://app.supabase.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie **TODO** o conteúdo do arquivo:
   ```
   supabase/migrations/20250121_init_detox_mental.sql
   ```
6. Cole no editor e clique em **Run** (ou pressione `Ctrl+Enter`)
7. Aguarde a execução (deve levar alguns segundos)
8. Você verá a mensagem "Success. No rows returned"

### Opção B: Usando Supabase CLI (para usuários avançados)

```bash
# Certifique-se de estar na pasta do projeto
supabase db push
```

###  Verificar se as tabelas foram criadas

No Dashboard do Supabase:

1. Vá em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - `users`
   - `meditations`
   - `user_progress`
   - `user_streaks`
   - `subscriptions`
   - `user_sessions`

---

## >ê Passo 4: Testar a Aplicação

### 4.1 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O projeto será aberto em: `http://localhost:5173/`

### 4.2 Criar sua primeira conta

1. Na página inicial, clique em **"Criar conta"** ou acesse `/cadastro`
2. Preencha:
   - Nome completo
   - E-mail
   - Senha (mínimo 6 caracteres)
3. Clique em **"Criar conta"**
4. Você receberá um e-mail de confirmação do Supabase
5. Clique no link de confirmação no e-mail
6. Volte para o app e faça login em `/login`

### 4.3 Verificar integração

Após fazer login, verifique se:

-  Você foi redirecionado para `/hoje`
-  Seu nome aparece no cabeçalho
-  O perfil (`/perfil`) mostra suas estatísticas
-  A seção "Assinatura" mostra **"Plano Premium - R$ 19,90"**
-  Sequência (streak) está zerada inicialmente

---

## =Ê Passo 5: Verificar Dados no Supabase

### Verificar se o usuário foi criado

1. No Dashboard do Supabase, vá em **Authentication** ’ **Users**
2. Você deve ver seu usuário listado

### Verificar tabelas populadas

1. Vá em **Table Editor**
2. Clique em `users` - deve ter seu registro
3. Clique em `user_streaks` - deve ter um registro com streak = 0
4. Clique em `subscriptions` - deve ter um registro com:
   - `plan`: premium
   - `price`: 19.90
   - `status`: active

---

## <× Passo 6: Build para Produção

Quando estiver pronto para fazer o build final:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para testar o build localmente:

```bash
npm run preview
```

---

## = Segurança e Boas Práticas

###  Configurações importantes já implementadas:

1. **Row Level Security (RLS)** habilitado em todas as tabelas
2. **Políticas de segurança** configuradas (usuários só veem seus próprios dados)
3. **Triggers automáticos** para criar registros iniciais ao cadastrar
4. **Views otimizadas** para consultas complexas

###   Próximos passos recomendados:

1. **Configurar autenticação por e-mail**:
   - No Supabase: **Authentication** ’ **Settings** ’ **Email Templates**
   - Customize os templates de confirmação e recuperação de senha

2. **Ativar Google OAuth** (opcional):
   - **Authentication** ’ **Providers** ’ **Google**
   - Configure Client ID e Client Secret

3. **Desabilitar confirmação de e-mail** (apenas para desenvolvimento):
   - **Authentication** ’ **Settings** ’ Desative "Enable email confirmations"

---

## =Ý Estrutura do Banco de Dados

### Tabelas criadas:

| Tabela | Descrição |
|--------|-----------|
| `users` | Dados do usuário (nome, email, plano, etc.) |
| `meditations` | Catálogo de meditações disponíveis |
| `user_progress` | Progresso individual em cada meditação |
| `user_streaks` | Sequências diárias de meditação |
| `subscriptions` | Planos e assinaturas |
| `user_sessions` | Histórico completo de sessões |

### Views (consultas otimizadas):

- `user_stats` - Estatísticas agregadas do usuário
- `user_complete_profile` - Perfil completo (perfil + stats)
- `popular_meditations` - Meditações mais tocadas

---

## = Solução de Problemas

### L Erro: "Variables de ambiente não configuradas"

**Causa**: Arquivo `.env` não foi criado ou está vazio.

**Solução**:
```bash
copy .env.example .env
# Edite o .env com suas credenciais reais
```

### L Erro ao fazer login: "Invalid login credentials"

**Causa**: E-mail ainda não foi confirmado.

**Solução**:
1. Verifique sua caixa de entrada (e spam)
2. Clique no link de confirmação
3. Ou desabilite confirmação de e-mail no Supabase (apenas dev)

### L Erro: "relation 'users' does not exist"

**Causa**: Migration SQL não foi executada.

**Solução**: Execute novamente o script SQL no **SQL Editor** do Supabase.

### L Perfil não carrega ou mostra dados vazios

**Causa**: Trigger `handle_new_user` pode não ter executado.

**Solução**: Execute manualmente no SQL Editor:
```sql
-- Verificar se seu usuário existe na tabela users
SELECT * FROM auth.users LIMIT 1;

-- Se não existir registro em public.users, execute:
INSERT INTO public.users (id, email, name, created_at, last_login)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', 'Usuário'), created_at, NOW()
FROM auth.users
WHERE id = 'SEU_USER_ID_AQUI';
```

---

## <‰ Pronto!

Agora seu **Detox Mental** está completamente integrado com o Supabase!

### Próximos passos sugeridos:

1.  Adicionar áudios reais de meditação na tabela `meditations`
2.  Implementar player de áudio com progresso em tempo real
3.  Criar dashboard administrativo para gerenciar meditações
4.  Integrar pagamento (Stripe, Mercado Pago, etc.)
5.  Implementar notificações push para lembrar de meditar

---

## =Þ Suporte

Se tiver problemas, verifique:

- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do React Router](https://reactrouter.com/)

---

**Desenvolvido com d por Claude Code**

>ØB _"Cada respiração é um novo começo"_

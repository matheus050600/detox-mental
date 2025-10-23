# Configuração do Sistema de Autenticação

Este documento explica como configurar e usar o sistema de autenticação do Detox Mental.

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase
3. Node.js instalado (v14 ou superior)

## 🚀 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 2. Criar Tabela de Usuários no Supabase

Execute o seguinte SQL no Editor SQL do Supabase:

```sql
-- Criar tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver e editar apenas seus próprios dados
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Política: Permitir inserção durante o cadastro
CREATE POLICY "Enable insert for authentication" ON users
  FOR INSERT WITH CHECK (true);
```

### 3. Configurar Autenticação com Google

Para habilitar o login com Google:

1. Acesse o painel do Supabase
2. Vá em **Authentication > Providers**
3. Encontre **Google** na lista de provedores
4. Ative o toggle "Enable Sign in with Google"
5. Configure as credenciais OAuth do Google:
   - Acesse o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Vá em "APIs & Services > Credentials"
   - Clique em "Create Credentials > OAuth 2.0 Client ID"
   - Configure as URLs de redirecionamento autorizadas:
     - `https://seu-projeto.supabase.co/auth/v1/callback`
   - Copie o **Client ID** e **Client Secret**
   - Cole no painel do Supabase em Authentication > Providers > Google

### 4. Configurar Email Templates (Opcional)

No painel do Supabase, vá em **Authentication > Email Templates** e personalize:
- Mensagem de confirmação de email
- Email de recuperação de senha
- Outros templates conforme necessário

## 🔐 Funcionalidades Implementadas

### Login (`/login`)
- Autenticação com email e senha
- **Login com Google** (OAuth 2.0)
- Validação de credenciais
- Mensagens de erro personalizadas
- Redirecionamento automático para `/hoje` após login
- Link para criar conta e recuperar senha

### Cadastro (`/cadastro`)
- Registro de novos usuários
- Validação de senha (mínimo 6 caracteres)
- Confirmação de senha
- Mensagens de sucesso/erro
- Armazenamento de dados no banco (user_id, email, created_at)
- Redirecionamento automático para `/login` após cadastro

### Recuperação de Senha (`/esqueci-senha`)
- Envio de email com link de recuperação
- Validação de email
- Feedback visual de sucesso/erro

### Rotas Protegidas
- Componente `ProtectedRoute` disponível para proteger páginas
- Verifica autenticação antes de renderizar conteúdo
- Redireciona para `/login` se não autenticado
- Loading spinner durante verificação

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   └── supabase.ts              # Cliente Supabase e funções de autenticação
├── pages/
│   ├── Login.tsx                # Página de login
│   ├── Cadastro.tsx             # Página de cadastro
│   └── EsqueciSenha.tsx         # Página de recuperação de senha
└── components/
    └── ProtectedRoute.tsx       # Wrapper para rotas protegidas
```

## 🛠️ Uso do ProtectedRoute

Para proteger uma rota, envolva o componente com `ProtectedRoute`:

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

<Route
  path="/perfil"
  element={
    <ProtectedRoute>
      <Perfil />
    </ProtectedRoute>
  }
/>
```

## 📊 Funções Disponíveis

### `signInWithEmail(email, password)`
Faz login do usuário e atualiza `last_login` no banco.

### `signUpWithEmail(email, password)`
Registra um novo usuário e cria registro na tabela `users`.

### `signOut()`
Faz logout do usuário atual.

### `resetPassword(email)`
Envia email de recuperação de senha.

### `getCurrentUser()`
Retorna os dados do usuário autenticado.

### `isAuthenticated()`
Verifica se existe uma sessão ativa (retorna boolean).

### `signInWithGoogle()`
Inicia o fluxo de autenticação OAuth com Google e redireciona automaticamente para `/hoje` após sucesso.

## 🎨 Design

Todas as páginas de autenticação seguem o design moderno do app:
- **Glassmorphism**: Efeito de vidro fosco com `backdrop-blur`
- **Gradientes**: Cores suaves (purple → blue → indigo)
- **Responsivo**: Adaptável para mobile, tablet e desktop
- **Dark Mode**: Suporte completo a tema escuro
- **Animações**: Transições suaves e feedback visual

## 🔧 Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas no `.env`
- Confirme que o arquivo `.env` está na raiz do projeto
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro ao criar conta
- Verifique se a tabela `users` foi criada no Supabase
- Confirme que as políticas de RLS estão configuradas
- Verifique se o email já está cadastrado

### Email de recuperação não chega
- Verifique a pasta de spam
- Confirme que o SMTP está configurado no Supabase (Settings > Auth > SMTP)
- Para desenvolvimento, o Supabase usa um servidor de email padrão

## 📝 Próximos Passos (Opcional)

- [x] Adicionar autenticação social (Google) ✅
- [ ] Adicionar outros provedores (Facebook, Apple, etc.)
- [ ] Implementar autenticação de dois fatores (2FA)
- [ ] Adicionar perfil de usuário com foto e bio
- [ ] Implementar sistema de níveis e conquistas
- [ ] Criar dashboard de estatísticas de meditação

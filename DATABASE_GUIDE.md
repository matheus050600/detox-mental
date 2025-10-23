# 🗄️ Guia do Banco de Dados - Detox Mental

Este guia explica como usar o script SQL e a estrutura do banco de dados do projeto.

## 📋 Índice

1. [Como Executar o Script](#como-executar-o-script)
2. [Estrutura das Tabelas](#estrutura-das-tabelas)
3. [Fluxo de Dados](#fluxo-de-dados)
4. [Funções Disponíveis](#funções-disponíveis)
5. [Queries Úteis](#queries-úteis)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Como Executar o Script

### Passo 1: Acessar o Supabase SQL Editor

1. Entre no [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**

### Passo 2: Executar o Script

1. Abra o arquivo `database_setup.sql`
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)

### Passo 3: Verificar Instalação

Execute esta query para verificar se todas as tabelas foram criadas:

```sql
select tablename
from pg_tables
where schemaname = 'public'
order by tablename;
```

Você deve ver:
- `meditations`
- `quiz_results`
- `user_access_logs`
- `user_profiles`
- `user_sessions`
- `user_stats`

---

## 📊 Estrutura das Tabelas

### 1. **user_profiles** - Perfil do Usuário

```sql
id              uuid (PK)
name            text
email           text
avatar_url      text
plan_type       text ('free', 'premium', 'enterprise')
created_at      timestamp
last_login      timestamp
updated_at      timestamp
```

**Uso:**
- Armazena informações básicas do usuário
- `plan_type` permite futuras funcionalidades premium
- Automaticamente criada quando usuário faz signup

**Exemplo de Insert (via app):**
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .update({ name: 'João Silva', avatar_url: 'https://...' })
  .eq('id', userId);
```

---

### 2. **user_stats** - Estatísticas de Meditação

```sql
id                  uuid (PK)
sessions_completed  integer
total_minutes       integer
streak_days         integer
last_session_date   date
longest_streak      integer
created_at          timestamp
updated_at          timestamp
```

**Uso:**
- Atualizada **automaticamente** quando usuário completa sessão
- `streak_days`: dias consecutivos meditando
- `longest_streak`: maior sequência já alcançada

**Lógica de Streak:**
- Mesma data → mantém streak
- Dia seguinte → incrementa +1
- Pulou dias → reseta para 1

---

### 3. **meditations** - Catálogo de Meditações

```sql
id              uuid (PK)
title           text
description     text
duration        integer (segundos)
audio_url       text
image_url       text
category        text
difficulty      text ('iniciante', 'intermediario', 'avancado')
is_premium      boolean
play_count      integer
created_at      timestamp
updated_at      timestamp
```

**Uso:**
- Apenas **admins** podem inserir/editar (via service_role)
- Usuários podem apenas visualizar
- `play_count` incrementa automaticamente

**Exemplo de Insert (admin):**
```sql
insert into meditations (title, description, duration, audio_url, category, difficulty)
values (
  'Meditação Matinal',
  'Comece o dia com clareza mental',
  600,
  'https://storage.supabase.co/...',
  'mindfulness',
  'iniciante'
);
```

---

### 4. **user_sessions** - Histórico de Sessões

```sql
id              uuid (PK)
user_id         uuid (FK -> auth.users)
meditation_id   uuid (FK -> meditations)
duration        integer (segundos)
completed_at    timestamp
rating          integer (1-5)
notes           text
```

**Uso:**
- Registra cada meditação concluída
- Trigger atualiza `user_stats` automaticamente
- Usuário pode avaliar (rating) a sessão

**Exemplo de Insert:**
```typescript
const { data, error } = await supabase
  .from('user_sessions')
  .insert({
    user_id: userId,
    meditation_id: meditationId,
    duration: 600,
    rating: 5,
    notes: 'Sessão muito relaxante!'
  });
```

**Trigger Automático:**
Ao inserir, automaticamente:
1. ✅ Incrementa `sessions_completed`
2. ✅ Adiciona minutos em `total_minutes`
3. ✅ Atualiza `streak_days`
4. ✅ Incrementa `play_count` da meditação

---

### 5. **quiz_results** - Resultados de Quiz

```sql
id              uuid (PK)
user_id         uuid (FK)
answers         jsonb
result_type     text
score           integer (0-100)
insights        text
created_at      timestamp
```

**Uso:**
- Armazena resultados de questionários de autoconhecimento
- `answers` em JSON permite flexibilidade

**Exemplo de Insert:**
```typescript
const { data, error } = await supabase
  .from('quiz_results')
  .insert({
    user_id: userId,
    answers: {
      q1: 'A',
      q2: 'B',
      q3: 'C'
    },
    result_type: 'perfil_meditador',
    score: 85,
    insights: 'Você tem perfil reflexivo...'
  });
```

---

### 6. **user_access_logs** - Logs de Acesso

```sql
id              uuid (PK)
user_id         uuid (FK)
action          text ('login', 'logout', 'signup')
ip_address      text
user_agent      text
created_at      timestamp
```

**Uso:**
- Rastreamento de acessos
- Útil para análise de segurança
- Pode ser usado para estatísticas

---

## 🔄 Fluxo de Dados

### Quando Usuário Faz Signup

```
1. Usuário se cadastra via Supabase Auth
2. TRIGGER: handle_new_user() é executado
3. Cria registro em user_profiles
4. Cria registro em user_stats (zerado)
5. Cria log em user_access_logs (action: 'signup')
```

### Quando Usuário Completa Meditação

```
1. App insere registro em user_sessions
2. TRIGGER: update_user_stats_on_session() é executado
3. Atualiza user_stats:
   - sessions_completed += 1
   - total_minutes += duração
   - Recalcula streak_days
4. Atualiza meditations:
   - play_count += 1
```

---

## 🔧 Funções Disponíveis

### 1. `get_user_sessions_by_period(days)`

Retorna sessões agrupadas por data.

```typescript
const { data } = await supabase.rpc('get_user_sessions_by_period', {
  period_days: 30
});

// Retorna:
// [
//   { session_date: '2025-01-15', sessions_count: 3, total_minutes: 45 },
//   { session_date: '2025-01-14', sessions_count: 1, total_minutes: 15 }
// ]
```

### 2. `get_user_favorite_meditations(limit)`

Retorna meditações mais feitas pelo usuário.

```typescript
const { data } = await supabase.rpc('get_user_favorite_meditations', {
  limit_count: 5
});

// Retorna:
// [
//   { meditation_id: '...', title: 'Respiração', times_completed: 10, total_minutes: 150 }
// ]
```

---

## 📈 Views Disponíveis

### 1. `user_complete_profile`

Perfil + estatísticas em uma consulta.

```typescript
const { data } = await supabase
  .from('user_complete_profile')
  .select('*')
  .eq('id', userId)
  .single();

// Retorna todos os dados do perfil + stats juntos
```

### 2. `popular_meditations`

Top 20 meditações mais populares.

```typescript
const { data } = await supabase
  .from('popular_meditations')
  .select('*');
```

---

## 💡 Queries Úteis

### Ver estatísticas do usuário atual

```sql
select * from user_stats where id = auth.uid();
```

### Ver histórico de sessões

```sql
select
  s.completed_at,
  m.title,
  s.duration / 60 as minutes,
  s.rating
from user_sessions s
join meditations m on s.meditation_id = m.id
where s.user_id = auth.uid()
order by s.completed_at desc
limit 10;
```

### Ver meditações por categoria

```sql
select category, count(*) as total
from meditations
group by category
order by total desc;
```

### Top usuários (leaderboard)

```sql
select
  p.name,
  s.sessions_completed,
  s.total_minutes,
  s.streak_days
from user_stats s
join user_profiles p on s.id = p.id
order by s.sessions_completed desc
limit 10;
```

---

## 🛡️ Segurança (RLS)

### Políticas Ativas

**user_profiles:**
- ✅ Usuário vê apenas seu perfil
- ✅ Usuário edita apenas seu perfil

**user_stats:**
- ✅ Usuário vê apenas suas stats
- ✅ Atualização automática via trigger

**meditations:**
- ✅ Todos podem ver
- ❌ Apenas service_role pode editar

**user_sessions:**
- ✅ Usuário vê/edita apenas suas sessões

**quiz_results:**
- ✅ Usuário vê/insere apenas seus resultados

**user_access_logs:**
- ✅ Usuário vê apenas seus logs

---

## 🐛 Troubleshooting

### Erro: "permission denied for table"

**Causa:** RLS está bloqueando
**Solução:** Verifique se está usando `auth.uid()` correto

```typescript
// ❌ Errado
const { data } = await supabase.from('user_stats').select('*');

// ✅ Correto
const { data } = await supabase
  .from('user_stats')
  .select('*')
  .eq('id', userId);
```

### Trigger não está executando

**Verificar se trigger existe:**
```sql
select * from pg_trigger where tgname like '%user%';
```

**Recriar trigger:**
```sql
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Stats não atualizando

**Verificar última sessão:**
```sql
select * from user_sessions
where user_id = auth.uid()
order by completed_at desc
limit 1;
```

**Atualizar manualmente (emergência):**
```sql
update user_stats
set sessions_completed = (
  select count(*) from user_sessions where user_id = auth.uid()
)
where id = auth.uid();
```

---

## 📝 Próximos Passos

Após executar o script:

1. ✅ Configure autenticação do Google no Supabase
2. ✅ Insira meditações iniciais (descomente seção 20 do script)
3. ✅ Teste criação de usuário
4. ✅ Teste conclusão de sessão
5. ✅ Verifique se stats atualizam automaticamente

---

## 📞 Suporte

Se precisar de ajuda:
- Verifique os logs no Supabase Dashboard > Logs
- Use o SQL Editor para executar queries de diagnóstico
- Consulte a documentação do Supabase: https://supabase.com/docs

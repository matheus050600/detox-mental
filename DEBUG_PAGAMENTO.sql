-- ============================================================================
-- 🔍 DEBUG: Por que pagamento não libera acesso?
-- ============================================================================
-- Execute cada query abaixo no Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. VERIFICAR SE WEBHOOK ESTÁ CHEGANDO
-- ============================================================================
-- Ver últimos webhooks recebidos
SELECT
    id,
    order_id,
    customer_email,
    customer_name,
    order_status,
    subscription_status,
    processed,
    processed_at,
    created_at
FROM public.kiwify_webhooks
ORDER BY created_at DESC
LIMIT 10;

-- Resultado esperado: Deve aparecer webhooks recentes
-- Se NÃO aparecer NENHUM webhook: Problema está na configuração do webhook da Kiwify


-- ============================================================================
-- 2. VERIFICAR SE WEBHOOK FOI PROCESSADO
-- ============================================================================
-- Ver webhooks não processados
SELECT
    id,
    order_id,
    customer_email,
    order_status,
    subscription_status,
    processed,
    raw_payload
FROM public.kiwify_webhooks
WHERE processed = FALSE
ORDER BY created_at DESC;

-- Se aparecer webhooks com processed = FALSE: Webhook chegou mas não foi processado
-- Veja o raw_payload para entender o que veio


-- ============================================================================
-- 3. VERIFICAR SE USUÁRIO EXISTE
-- ============================================================================
-- Substituir pelo email que pagou:
SELECT
    id,
    email,
    name,
    plan_type,
    has_active_token,
    token_granted_at,
    created_at
FROM public.users
WHERE email = 'SEU_EMAIL_AQUI@example.com';  -- ⚠️ TROCAR PELO EMAIL REAL

-- Resultado esperado:
-- plan_type = 'premium'
-- has_active_token = true
-- Se ainda estiver 'blocked' ou 'free': Webhook não processou corretamente


-- ============================================================================
-- 4. VERIFICAR SE TOKEN FOI CRIADO
-- ============================================================================
SELECT
    id,
    user_id,
    email,
    token,
    is_active,
    kiwify_order_id,
    kiwify_subscription_id,
    granted_at,
    created_at
FROM public.access_tokens
WHERE email = 'SEU_EMAIL_AQUI@example.com';  -- ⚠️ TROCAR PELO EMAIL REAL

-- Resultado esperado:
-- token = 'rsmplzhq7p9'
-- is_active = true
-- Se NÃO aparecer: Token não foi criado


-- ============================================================================
-- 5. VERIFICAR SE ASSINATURA FOI CRIADA
-- ============================================================================
SELECT
    s.id,
    s.user_id,
    s.plan,
    s.price,
    s.status,
    s.start_date,
    s.expiration_date,
    u.email,
    u.plan_type,
    u.has_active_token
FROM public.subscriptions s
JOIN public.users u ON s.user_id = u.id
WHERE u.email = 'SEU_EMAIL_AQUI@example.com';  -- ⚠️ TROCAR PELO EMAIL REAL

-- Resultado esperado:
-- plan = 'premium'
-- price = 19.90
-- status = 'active'


-- ============================================================================
-- 6. TESTAR FUNÇÃO MANUALMENTE
-- ============================================================================
-- Simular liberação de acesso manualmente
SELECT public.grant_access_after_purchase(
    'SEU_EMAIL_AQUI@example.com',  -- ⚠️ TROCAR PELO EMAIL REAL
    'Nome do Cliente',
    'ORDER-MANUAL-TEST',
    'SUB-MANUAL-TEST'
);

-- Resultado esperado: JSON com success = true
-- Se der erro: Veja qual erro aparece


-- ============================================================================
-- 7. VERIFICAR LOGS DA EDGE FUNCTION
-- ============================================================================
-- Não dá pra ver via SQL, mas vá em:
-- Dashboard Supabase → Edge Functions → kiwify-webhook → Logs
-- Procure por erros ou mensagens


-- ============================================================================
-- 8. VERIFICAR SE FUNÇÃO RPC EXISTE
-- ============================================================================
SELECT
    proname as function_name,
    prosrc as function_code
FROM pg_proc
WHERE proname IN ('grant_access_after_purchase', 'create_user_on_signup')
AND pronamespace = 'public'::regnamespace;

-- Resultado esperado: Deve retornar 2 funções


-- ============================================================================
-- 9. VER TODOS OS USUÁRIOS E STATUS
-- ============================================================================
SELECT
    u.email,
    u.name,
    u.plan_type,
    u.has_active_token,
    u.created_at,
    s.plan as subscription_plan,
    s.status as subscription_status,
    s.price,
    at.is_active as token_active
FROM public.users u
LEFT JOIN public.subscriptions s ON u.id = s.user_id
LEFT JOIN public.access_tokens at ON u.id = at.user_id AND at.token = 'rsmplzhq7p9'
ORDER BY u.created_at DESC
LIMIT 20;

-- Isso mostra todos os usuários e seu status


-- ============================================================================
-- 10. SOLUÇÃO RÁPIDA: LIBERAR ACESSO MANUALMENTE
-- ============================================================================
-- Se quiser liberar manualmente enquanto debugamos:
/*
SELECT public.grant_access_after_purchase(
    'email.do.cliente@example.com',
    'Nome do Cliente',
    'ORDER-MANUAL-' || NOW()::TEXT,
    'SUB-MANUAL-' || NOW()::TEXT
);
*/

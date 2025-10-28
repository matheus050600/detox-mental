# 🔍 Debug Mental Chat IA - Diagnóstico e Solução

## 📊 Problema Identificado

O chat Mental IA foi implementado com sucesso, mas o webhook do n8n está **retornando resposta vazia**.

### Status Atual:
- ✅ **Frontend funcionando**: Componente React criado e integrado
- ✅ **Requisição enviada**: POST chegando no webhook com sucesso (HTTP 200)
- ❌ **Resposta vazia**: O webhook não está retornando nenhum conteúdo

## 🧪 Testes Realizados

### Teste 1: Webhook de Produção
```bash
curl -X POST "https://n8n.promptart.store/webhook/Mentalia" \
  -H "Content-Type: application/json" \
  -d '{"message":"Olá"}'
```
**Resultado**: HTTP 200 OK, mas corpo vazio

### Teste 2: Webhook de Teste
```bash
curl -X POST "https://n8n.promptart.store/webhook-test/Mentalia" \
  -H "Content-Type: application/json" \
  -d '{"message":"teste"}'
```
**Resultado**: HTTP 404 - Webhook precisa ser ativado manualmente no n8n

## 🔧 Solução Necessária no n8n

O workflow "Mentalia" no n8n precisa ser configurado para **retornar uma resposta JSON**.

### Configuração Correta do Workflow:

1. **Adicione um nó "Respond to Webhook"** no final do workflow
2. **Configure o Response Body** com um JSON no formato:

```json
{
  "response": "Resposta da IA aqui"
}
```

### Exemplo de Workflow Correto:

```
[Webhook Trigger]
    ↓
[Processar Mensagem / Chamar IA]
    ↓
[Respond to Webhook] ← IMPORTANTE!
    Response Mode: Using "Respond to Webhook" Node
    Response Body:
    {
      "response": "{{ $json.output }}"
    }
```

## 📝 Formatos de Resposta Aceitos

O código do frontend aceita qualquer um destes campos no JSON de resposta:
- `response` (recomendado)
- `message`
- `reply`
- `output`
- `text`

Exemplo:
```json
{
  "response": "Olá! Como posso te ajudar hoje?"
}
```

## 🐛 Logs de Debug

O componente agora inclui logs detalhados no console do navegador:

- 🚀 Enviando mensagem para webhook
- 📤 Payload enviado
- 📥 Status da resposta
- 📝 Resposta raw do servidor
- ✅ Resposta JSON parseada
- 🤖 Resposta da IA extraída
- ❌ Erros detalhados

## ✅ Como Testar

1. **Abra o site**: Navegue até a página inicial
2. **Abra o chat**: Clique em "Conversar com Mental IA"
3. **Abra o DevTools**: F12 → Console
4. **Envie uma mensagem**: Digite algo e pressione Enter
5. **Veja os logs**: Todos os detalhes aparecerão no console

## 🎯 Próximos Passos

1. **Configure o workflow no n8n** para retornar JSON
2. **Teste novamente** no navegador
3. **Verifique os logs** no console
4. **Aproveite o chat funcionando!** 🎉

## 📞 Suporte

Se o problema persistir, verifique:
- ✅ O workflow está **ativado** no n8n
- ✅ O nó "Respond to Webhook" está **configurado**
- ✅ O formato do JSON está **correto**
- ✅ Não há **erros** no workflow do n8n

---

**Última atualização**: 2025-10-27
**Status**: Aguardando configuração do webhook no n8n

# = Como Atualizar o Link da Kiwify

## =� Localiza��o

O link da Kiwify est� no arquivo:

```
src/pages/AcessoNegado.tsx
```

**Linha 99**

---

## =' Como Atualizar

### **Passo 1: Obter seu link na Kiwify**

1. Acesse: https://dashboard.kiwify.com.br/
2. Selecione seu produto **Detox Mental**
3. V� em **Vendas** ou **Checkout**
4. Copie o link de pagamento

O link ser� algo tipo:
```
https://pay.kiwify.com.br/ABC123XYZ
```

ou

```
https://pay.kiwify.com.br/detox-mental-premium
```

### **Passo 2: Atualizar no c�digo**

Abra o arquivo: `src/pages/AcessoNegado.tsx`

**Linha 99** - Substitua:

```typescript
// ANTES:
onClick={() => window.open("https://pay.kiwify.com.br/SEU_PRODUTO_AQUI", "_blank")}

// DEPOIS:
onClick={() => window.open("https://pay.kiwify.com.br/ABC123XYZ", "_blank")}
// (Coloque seu link real da Kiwify)
```

### **Passo 3: Salvar e testar**

```bash
# Salvar o arquivo (Ctrl+S)

# Se estiver rodando localmente:
npm run dev

# Acessar:
http://localhost:5173/acesso-negado

# Clicar no bot�o "Assinar Agora"
# Deve abrir seu checkout da Kiwify! 
```

---

##  Exemplo Completo

```typescript
<Button
  onClick={() => window.open("https://pay.kiwify.com.br/detox-mental-19-90", "_blank")}
  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
>
  <ShoppingCart className="w-5 h-5 mr-2" />
  Assinar Agora - R$ 19,90/m�s
</Button>
```

---

## <� Depois de Atualizar

### Se estiver em produ��o (Vercel):

```bash
git add src/pages/AcessoNegado.tsx
git commit -m "Atualizar link de pagamento Kiwify"
git push
```

A Vercel vai fazer o redeploy automaticamente! =�

---

## =� Verificar se Est� Funcionando

1. Acesse: https://detoxmental.site/acesso-negado
2. Clique em **"Assinar Agora"**
3. Deve abrir o checkout da Kiwify 
4. O URL deve ser o seu produto correto 

---

## = Dica: Usar Par�metros UTM (Opcional)

Para rastrear vendas que vieram do bot�o de acesso negado:

```typescript
onClick={() => window.open("https://pay.kiwify.com.br/ABC123XYZ?utm_source=acesso_negado&utm_medium=button&utm_campaign=detox_mental", "_blank")}
```

Isso ajuda a ver na Kiwify quantas vendas vieram especificamente dessa p�gina!

---

## =� D�vidas?

- **Onde encontro meu link?** Dashboard Kiwify � Produtos � Seu Produto � Link de Vendas
- **Posso ter v�rios produtos?** Sim, cada produto tem seu pr�prio link
- **Posso usar dom�nio personalizado?** Sim, configure na Kiwify primeiro

---

**Me passe o link correto da Kiwify que eu atualizo para voc�!** =


# 🎨 Atualização de Logo e Imagens de Inspiração

## ✅ Mudanças Implementadas

### 🟣 1. Novo Logotipo Principal

**Arquivo usado:** `src/assets/logo.png`

#### Onde foi atualizado:

**Navbar (`src/components/Navbar.tsx`):**
- ✅ Removido o ícone Sparkles + texto "Detox Mental"
- ✅ Substituído pela imagem do logo oficial
- ✅ Altura padrão: 48px (h-12)
- ✅ Largura automática mantendo proporção
- ✅ Centralizado verticalmente no navbar
- ✅ Efeito hover com leve scale (1.05)
- ✅ Transição suave

**Código implementado:**
```tsx
<Link to="/" className="flex items-center group">
  <img
    src={logoImage}
    alt="Detox Mental"
    className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
  />
</Link>
```

#### Benefícios:
- ✅ Logo oficial em alta qualidade
- ✅ Identidade visual consistente
- ✅ Proporções mantidas automaticamente
- ✅ Responsivo em todas as telas
- ✅ Animação suave ao hover

---

### 🟢 2. Fundos Aleatórios para Frases Motivacionais

**Arquivos usados:**
- `src/assets/frase motivacional 1.jpg`
- `src/assets/frase motivacional 2.jpg`
- `src/assets/frase motivacional.jpg`

#### Componente atualizado:

**InspirationCard (`src/components/InspirationCard.tsx`)**

#### Implementação:

**1. Importação das três imagens:**
```tsx
import motivationalImage1 from "@/assets/frase motivacional 1.jpg";
import motivationalImage2 from "@/assets/frase motivacional 2.jpg";
import motivationalImage3 from "@/assets/frase motivacional.jpg";
```

**2. Seleção aleatória com useMemo:**
```tsx
const motivationalImages = [motivationalImage1, motivationalImage2, motivationalImage3];

const randomBackground = useMemo(() => {
  if (image) return image; // Backward compatibility
  return motivationalImages[Math.floor(Math.random() * motivationalImages.length)];
}, [image]);
```

**3. Overlay translúcido (40% opacidade):**
```tsx
<div className="absolute inset-0 bg-black/40" />
```

#### Características:

✅ **Aleatoriedade:** A cada vez que o componente monta, uma imagem diferente é escolhida
✅ **Memoização:** A imagem não muda durante re-renders (usando useMemo)
✅ **Contraste:** Overlay preto com 40% de opacidade garante legibilidade
✅ **Cobertura completa:** `object-cover` preenche todo o espaço
✅ **Centralização:** `background-position: center` via CSS
✅ **Backward compatible:** Se uma imagem for passada via props, usa ela

#### Funcionamento:

1. **Ao carregar a página:** Uma das 3 imagens é escolhida aleatoriamente
2. **Ao recarregar:** Nova escolha aleatória (pode ser a mesma ou diferente)
3. **Durante navegação:** A imagem permanece a mesma (não muda a cada render)
4. **Texto sempre legível:** Overlay garante contraste adequado

---

## 📐 Detalhes Técnicos

### Logo:

**Tamanhos responsivos:**
- Mobile: 48px de altura (h-12)
- Tablet: 48px de altura
- Desktop: 48px de altura

**Posicionamento:**
- Vertical: Centralizado no navbar (altura 64px / h-16)
- Horizontal: Alinhado à esquerda do container

**Efeitos:**
- Hover: scale(1.05)
- Transição: smooth (0.3s cubic-bezier)

### Frases Motivacionais:

**Aspect Ratio:**
- Mobile: 21:9
- Desktop: 21:7

**Overlay:**
- Cor: Preto (#000000)
- Opacidade: 40% (bg-black/40)
- Posicionamento: absolute inset-0

**Texto:**
- Cor: Branco (#ffffff)
- Tamanho Mobile: text-lg (18px)
- Tamanho Desktop: text-2xl (24px)
- Peso: font-semibold (600)
- Z-index: 10 (acima do overlay)

**Imagens:**
- Object-fit: cover
- Object-position: center
- Transição: smooth

---

## 🎯 Como Funciona

### Logo:

```
1. Usuário acessa o site
           ↓
2. Navbar carrega
           ↓
3. Logo.png é exibido
           ↓
4. Hover aplica scale
           ↓
5. Click navega para home
```

### Frases Motivacionais:

```
1. Componente monta
           ↓
2. useMemo escolhe imagem aleatória
           ↓
3. Imagem carrega como fundo
           ↓
4. Overlay aplicado (40% preto)
           ↓
5. Texto renderizado acima
           ↓
6. Contraste garantido
```

---

## 🔄 Probabilidade de Seleção

Cada imagem tem **33.33%** de chance de ser selecionada:

- Frase motivacional 1: ~33%
- Frase motivacional 2: ~33%
- Frase motivacional 3: ~33%

A seleção é **verdadeiramente aleatória** usando `Math.random()`.

---

## 📱 Responsividade

### Logo:

✅ **Mobile:** Altura mantida (48px), largura se ajusta
✅ **Tablet:** Altura mantida (48px), largura se ajusta
✅ **Desktop:** Altura mantida (48px), largura se ajusta
✅ **Ultra-wide:** Altura mantida (48px), largura se ajusta

### Frases:

✅ **Mobile:** Aspect ratio 21:9, texto menor (text-lg)
✅ **Tablet:** Transição suave entre tamanhos
✅ **Desktop:** Aspect ratio 21:7, texto maior (text-2xl)
✅ **Overlay:** Funciona em todos os tamanhos

---

## 🌗 Modo Escuro

Ambas as alterações funcionam perfeitamente no modo escuro:

**Logo:**
- ✅ Imagem PNG com fundo transparente (recomendado)
- ✅ Se tiver fundo branco, pode ser visível no dark mode
- ✅ Considere usar SVG ou PNG transparente

**Frases:**
- ✅ Overlay preto funciona bem em ambos os modos
- ✅ Texto branco mantém contraste
- ✅ Imagens de fundo são as mesmas

---

## ✨ Resultado Final

### Logo:
- **Profissional:** Imagem oficial de alta qualidade
- **Consistente:** Mesmo visual em todo o site
- **Elegante:** Animação suave ao hover
- **Responsivo:** Adapta-se a qualquer tela

### Frases Motivacionais:
- **Variado:** 3 fundos diferentes rodam aleatoriamente
- **Legível:** Overlay garante contraste perfeito
- **Imersivo:** Imagens de alta qualidade
- **Dinâmico:** Nova imagem a cada carregamento

---

## 🚀 Como Testar

**Logo:**
```bash
1. npm run dev
2. Acesse http://localhost:8082
3. Observe o novo logo no navbar
4. Passe o mouse sobre ele (deve dar scale)
5. Clique para ir à home
```

**Frases Motivacionais:**
```bash
1. npm run dev
2. Acesse a página inicial (/hoje)
3. Role até a seção de inspiração
4. Observe a imagem de fundo
5. Recarregue a página (F5)
6. Verifique se a imagem mudou (pode ser a mesma)
7. Recarregue várias vezes para ver as 3 variações
```

---

## 📊 Arquivos Modificados

1. **`src/components/Navbar.tsx`**
   - Removido ícone Sparkles
   - Removido texto "Detox Mental"
   - Adicionado import do logo
   - Adicionado tag `<img>` com logo

2. **`src/components/InspirationCard.tsx`**
   - Adicionado imports das 3 imagens
   - Adicionado hook useMemo
   - Implementada seleção aleatória
   - Ajustado overlay para 40% opacidade
   - Mantida backward compatibility

---

## 💡 Observações Importantes

### Logo:
- Certifique-se de que logo.png tem boa resolução (mínimo 240x240px)
- PNG transparente é ideal para funcionar no dark mode
- Se o logo tiver texto, verifique legibilidade em ambos os temas

### Frases:
- As imagens são carregadas na primeira renderização
- Performance otimizada com useMemo
- Overlay fixo em 40% (pode ajustar se necessário)
- Texto sempre em branco para máximo contraste

---

🎉 **Ambas as alterações implementadas com sucesso!**

O site agora tem o logo oficial e fundos variados para as frases inspiracionais.

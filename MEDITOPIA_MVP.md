# 🧘‍♀️ Detox Mental MVP - Clone Completo

MVP funcional e fiel ao design do Detox Mental, incluindo as páginas **"Hoje"** e **"Explorar"**.

## ✨ Funcionalidades Implementadas

### 🏠 Página "Hoje" (`/` ou `/hoje`)

1. **Navbar Superior**
   - Logo com gradiente animado
   - Links de navegação (Hoje / Explorar) com estados ativos
   - Avatar do usuário com hover effect

2. **Card de Saudação**
   - Saudação dinâmica baseada no horário (Bom dia / Boa tarde / Boa noite)
   - Gradiente lilás-azul característico do Detox Mental
   - Call-to-action para registro de humor

3. **Card de Inspiração**
   - Frase inspiracional com imagem de fundo
   - Overlay com gradiente
   - Botão "Ver detalhes"

4. **Recomendações Diárias**
   - Cards horizontais com imagem, tipo e duração
   - Hover effects suaves

5. **Recomendações para Você**
   - Tabs para categorias (Iniciantes, Sono, Estresse, Foco)
   - Scroll horizontal com snap
   - Cards com progresso (0%)
   - Badges de tipo (Programa, Jornada, Blog)

6. **Soul AI (Orientação Individual)**
   - Card com gradiente roxo-azulado
   - Efeitos de blur decorativos
   - Mensagem personalizada
   - Botão de call-to-action

7. **Aprenda e Explore**
   - Grid responsivo de conteúdos
   - Tags de tipo (ÁUDIO, BLOG)
   - Duração de cada conteúdo

8. **Rodapé**
   - Banner de download (App Store / Google Play)
   - Contador ao vivo de pessoas meditando
   - Animação de avatares flutuantes
   - Links úteis

### 🔍 Página "Explorar" (`/explorar`)

1. **Filtros de Categoria**
   - Tabs horizontais com scroll
   - 8 categorias principais
   - Estado ativo com shadow

2. **Seções Organizadas**
   - Começar a meditar
   - Programas de meditação
   - Populares
   - Práticas rápidas
   - Palestras
   - Para o trabalho
   - Newsletters
   - Jornadas

3. **Carrosséis Horizontais**
   - Scroll suave com snap
   - Botões de navegação (aparecem no hover)
   - Custom scrollbar estilizada

4. **Cards de Meditação**
   - Imagem com overlay no hover
   - Play button animado
   - Badges de tipo
   - Ícone e duração

## 🎨 Design System

### Paleta de Cores
- **Primary**: `#8C62FF` (Lilás principal)
- **Secondary**: `#B39DFF` (Lilás secundário)
- **Background**: `#F9FAFB`
- **Text Primary**: `#1A1A1A`
- **Text Secondary**: `#6B7280`

### Gradientes
- **Header**: `linear-gradient(135deg, #B39DFF 0%, #A0D8FF 100%)`
- **Soul AI**: `linear-gradient(135deg, #9D7FFF, #6B9EFF)`
- **Soft**: `linear-gradient(180deg, #F9FAFB 0%, #F5F7FA 100%)`

### Animações
- Fade in suave
- Slide in lateral
- Float para elementos decorativos
- Hover scales e shadows
- Transições com cubic-bezier

### Tipografia
- **Font**: Inter (system-ui fallback)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)
- **Tracking**: Tight para headings

## 🛠️ Stack Tecnológica

- ⚛️ **React 18** - UI Library
- 📘 **TypeScript** - Type Safety
- 🎨 **Tailwind CSS** - Styling
- 🧩 **shadcn/ui** - Component Library (Radix UI)
- 🚀 **Vite** - Build Tool
- 🔀 **React Router** - Navigation
- 🔄 **React Query** - State Management

## 📂 Estrutura de Componentes

```
src/
├── components/
│   ├── Navbar.tsx              # Barra de navegação superior
│   ├── Footer.tsx              # Rodapé com download e contador
│   ├── GreetingCard.tsx        # Card de saudação
│   ├── InspirationCard.tsx     # Card de frase inspiracional
│   ├── MeditationCard.tsx      # Card de meditação (reutilizável)
│   ├── SoulAI.tsx              # Card da Soul AI
│   ├── SectionTitle.tsx        # Título de seção com "Ver todos"
│   ├── HorizontalScroll.tsx    # Container de scroll horizontal
│   └── ui/                     # Componentes shadcn/ui
├── pages/
│   ├── Hoje.tsx                # Página principal
│   ├── Explorar.tsx            # Página de exploração
│   └── NotFound.tsx            # Página 404
├── App.tsx                     # Router principal
└── index.css                   # Design tokens e utilities
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 16+ instalado
- npm ou bun

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### URLs
- **Local**: http://localhost:8082
- **Página Hoje**: http://localhost:8082/ ou http://localhost:8082/hoje
- **Página Explorar**: http://localhost:8082/explorar

## 📱 Responsividade

O layout é totalmente responsivo com breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Wide**: > 1400px

### Adaptações Mobile
- Grid de 1 coluna em dispositivos pequenos
- Cards empilhados verticalmente
- Scroll horizontal mantido para carrosséis
- Navbar compacta
- Footer com botões empilhados

## 🎯 Próximos Passos (Sugestões)

1. **Integração com API**
   - Conectar com backend real
   - Autenticação de usuários
   - Persistência de progresso

2. **Funcionalidades Adicionais**
   - Player de áudio para meditações
   - Sistema de favoritos
   - Histórico de meditações
   - Notificações e lembretes

3. **Melhorias de UX**
   - Skeleton loaders
   - Error boundaries
   - Toasts de feedback
   - Animações de transição de página

4. **Performance**
   - Lazy loading de imagens
   - Code splitting
   - Service Worker (PWA)
   - Otimização de bundle

## 📝 Notas Técnicas

### Customizações Tailwind
O arquivo `src/index.css` contém:
- Variáveis CSS customizadas para cores
- Gradientes pré-definidos
- Sombras customizadas
- Utilitários de scroll snap
- Custom scrollbar styling

### Componentes Reutilizáveis
- `MeditationCard` aceita variante "default" ou "horizontal"
- `HorizontalScroll` adiciona navegação com setas automaticamente
- `SectionTitle` suporta botão "Ver todos" opcional

### Imagens
- URLs do Unsplash como placeholder
- Facilmente substituíveis por assets reais
- Otimizadas com parâmetros de crop e tamanho

## 🎉 Resultado

MVP completo e funcional que replica fielmente o design do Detox Mental, com:
- ✅ Todas as seções solicitadas
- ✅ Paleta de cores idêntica
- ✅ Animações suaves
- ✅ Layout responsivo
- ✅ Componentização modular
- ✅ TypeScript para type safety
- ✅ Código limpo e organizado

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**

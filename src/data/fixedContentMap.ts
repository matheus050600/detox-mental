// Mapeamento fixo e direto de conteúdos para suas respectivas imagens e áudios
// Este arquivo garante que cada seção carregue exatamente os arquivos corretos

export interface FixedContentItem {
  image: string;
  audio: string;
}

export const fixedContentMap: Record<string, FixedContentItem> = {
  // Seção "Hoje"
  "Primeiros passos": {
    image: "/src/assets/primeiros passos na meidtação.jpg",
    audio: "/src/assets/primeiros passos meditação.wav"
  },
  "Primeiros Passos": {
    image: "/src/assets/primeiros passos na meidtação.jpg",
    audio: "/src/assets/primeiros passos meditação.wav"
  },
  "Primeiros passos na meditação": {
    image: "/src/assets/primeiros passos na meidtação.jpg",
    audio: "/src/assets/primeiros passos meditação.wav"
  },
  "Meditação guiada para iniciantes": {
    image: "/src/assets/meditação guiada para iniciantes 1.jpg",
    audio: "/src/assets/meidtação guiada para iniciantes.m4a"
  },
  "Despertar da consciência": {
    image: "/src/assets/despertar da cosciência.jpg",
    audio: "/src/assets/Despertar da consciencia.m4a"
  },
  "Como a meditação transforma sua vida": {
    image: "/src/assets/meditação.jpg", // Fallback genérico
    audio: "/src/assets/como a meditação transforma a sua vida.m4a"
  },
  "O poder da respiração consciente": {
    image: "/src/assets/reapiração consciente.jpg",
    audio: "/src/assets/respiração consciente.mp3"
  },
  "Encontrando paz interior": {
    image: "/src/assets/paz interior.jpg",
    audio: "/src/assets/encontrando a paz interior.mp3"
  },
  "Paz interior": {
    image: "/src/assets/paz interior.jpg",
    audio: "/src/assets/paz interior.mp3"
  },
  "Mindfulness na rotina diária": {
    image: "/src/assets/meditação.jpg", // Fallback genérico
    audio: "/src/assets/Mindfulness na rotina diária.mp3"
  },
  "Gratidão e bem-estar": {
    image: "/src/assets/gratidão diaria.jpg",
    audio: "/src/assets/gratidão.m4a"
  },
  "Gratidão diária": {
    image: "/src/assets/gratidão diaria.jpg",
    audio: "/src/assets/gratidão diaria.mp3"
  },

  // Seção Começar a Meditar
  "Começar a meditar": {
    image: "/src/assets/comece a meditar 1.jpg",
    audio: "/src/assets/comece a meditar.m4a"
  },
  "Respiração consciente": {
    image: "/src/assets/reapiração consciente.jpg",
    audio: "/src/assets/respiração consciente.mp3"
  },
  "Iniciação ao mindfulness": {
    image: "/src/assets/iniciação ao mindfulness.jpg",
    audio: "/src/assets/meditation-yoga-409201.mp3" // Fallback
  },
  "Atenção plena para iniciantes": {
    image: "/src/assets/atenção plena para iniciantes.jpg",
    audio: "/src/assets/meditation-yoga-409201.mp3" // Fallback
  },

  // Programas
  "Ansiedade e estresse": {
    image: "/src/assets/ansiedade e estresse.jpg",
    audio: "/src/assets/ansiedade e estresse.m4a"
  },
  "Autoconhecimento profundo": {
    image: "/src/assets/meditação 2.jpg", // Fallback
    audio: "/src/assets/Autoconhecimento profundo.m4a"
  },
  "Cultivando a compaixão": {
    image: "/src/assets/meditação 3.jpg", // Fallback
    audio: "/src/assets/meditation-yoga-409201.mp3" // Fallback
  },
  "Equilíbrio emocional": {
    image: "/src/assets/meditação 4.jpg", // Fallback
    audio: "/src/assets/euqilibrio emocional.m4a"
  },

  // Populares
  "Sons da natureza": {
    image: "/src/assets/sons da natureza.jpg",
    audio: "/src/assets/natureza.mp3"
  },
  "Sono profundo": {
    image: "/src/assets/sono profundo.jpg",
    audio: "/src/assets/sono profundo.mp3"
  },

  // Práticas Rápidas
  "Pausa mindful": {
    image: "/src/assets/pausa mindful.jpg",
    audio: "/src/assets/pausa mindful.mp3"
  },
  "Respiração 4-7-8": {
    image: "/src/assets/respiração 4-7-8.jpg",
    audio: "/src/assets/respiração 4 7 8.m4a"
  },
  "Reset mental": {
    image: "/src/assets/reset mental.jpg",
    audio: "/src/assets/reset mental.mp3"
  },

  // Palestras
  "A ciência da meditação": {
    image: "/src/assets/meditação 5.jpg", // Fallback
    audio: "/src/assets/a ciência da meditação.m4a"
  },
  "Neuroplasticidade e mindfulness": {
    image: "/src/assets/meditation-program.jpg", // Fallback
    audio: "/src/assets/Neuroplasticidade e mindfulness.m4a"
  },
  "Budismo e meditação moderna": {
    image: "/src/assets/meditation-program.jpg", // Fallback
    audio: "/src/assets/Budismo e meditação moderna ‐ Feito com o Clipchamp.m4a"
  },
  "Seus limites e seu espaço de aceitação": {
    image: "/src/assets/meditation-program.jpg", // Fallback
    audio: "/src/assets/Seus limites e seu espaço de aceitação.m4a"
  },

  // Trabalho
  "Produtividade consciente": {
    image: "/src/assets/meditação 2.jpg", // Fallback
    audio: "/src/assets/produtividade consciente.mp3"
  },
  "Foco e concentração": {
    image: "/src/assets/foco e concentraçãõ.jpg",
    audio: "/src/assets/foco e concentração.mp3"
  },
  "Criatividade no trabalho": {
    image: "/src/assets/criatividade no trabalho.jpg",
    audio: "/src/assets/criatividade no trabalho.mp3"
  },

  // Jornadas
  "21 dias de gratidão": {
    image: "/src/assets/21 dis de gratidão.jpg",
    audio: "/src/assets/gratidão.m4a"
  },
  "Transformação pessoal": {
    image: "/src/assets/teansformação pessoal.jpg",
    audio: "/src/assets/transformação pessoal.m4a"
  }
};

// Função para buscar conteúdo com fallbacks
export function getFixedContent(title: string): FixedContentItem | null {
  // Tenta busca exata primeiro
  if (fixedContentMap[title]) {
    return fixedContentMap[title];
  }

  // Tenta variações comuns
  const variations = [
    title,
    title.toLowerCase(),
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
    title.replace(/\s+/g, ' ').trim()
  ];

  for (const variation of variations) {
    if (fixedContentMap[variation]) {
      return fixedContentMap[variation];
    }
  }

  return null;
}

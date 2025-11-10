// Mapeamento fixo e direto de conteúdos para suas respectivas imagens e áudios
// Este arquivo garante que cada seção carregue exatamente os arquivos corretos

export interface FixedContentItem {
  image: string;
  audio: string;
}

export const fixedContentMap: Record<string, FixedContentItem> = {
  // Seção "Hoje"
  "Primeiros passos": {
    image: "/assets/primeiros passos.jpg",
    audio: "/assets/primeiros passos.mp3"
  },
  "Primeiros Passos": {
    image: "/assets/primeiros passos.jpg",
    audio: "/assets/primeiros passos.mp3"
  },
  "Primeiros passos na meditação": {
    image: "/assets/primeiros passos na meditacao.jpg",
    audio: "/assets/primeiros passos na meditação.mp3"
  },
  "Meditação guiada para iniciantes": {
    image: "/assets/meditação guiada para iniciantes 1.jpg",
    audio: "/assets/meidtação guiada para iniciantes.m4a"
  },
  "Despertar da consciência": {
    image: "/assets/despertar da cosciência.jpg",
    audio: "/assets/Despertar da consciencia.m4a"
  },
  "Como a meditação transforma sua vida": {
    image: "/assets/meditação.jpg", // Fallback genérico
    audio: "/assets/como a meditação transforma a sua vida.m4a"
  },
  "O poder da respiração consciente": {
    image: "/assets/reapiração consciente.jpg",
    audio: "/assets/respiração consciente.mp3"
  },
  "Encontrando paz interior": {
    image: "/assets/paz interior.jpg",
    audio: "/assets/encontrando a paz interior.mp3"
  },
  "Paz interior": {
    image: "/assets/paz interior.jpg",
    audio: "/assets/paz interior.mp3"
  },
  "Mindfulness na rotina diária": {
    image: "/assets/meditação.jpg", // Fallback genérico
    audio: "/assets/Mindfulness na rotina diária.mp3"
  },
  "Gratidão e bem-estar": {
    image: "/assets/gratidão diaria.jpg",
    audio: "/assets/gratidão.m4a"
  },
  "Gratidão diária": {
    image: "/assets/gratidão diaria.jpg",
    audio: "/assets/gratidão diaria.mp3"
  },

  // Seção Começar a Meditar
  "Começar a meditar": {
    image: "/assets/comece a meditar 1.jpg",
    audio: "/assets/comece a meditar.m4a"
  },
  "Respiração consciente": {
    image: "/assets/reapiração consciente.jpg",
    audio: "/assets/respiração consciente.mp3"
  },
  "Iniciação ao mindfulness": {
    image: "/assets/iniciação ao mindfulness.jpg",
    audio: "/assets/meditation-yoga-409201.mp3" // Fallback
  },
  "Atenção plena para iniciantes": {
    image: "/assets/atenção plena para iniciantes.jpg",
    audio: "/assets/meditation-yoga-409201.mp3" // Fallback
  },

  // Programas
  "Ansiedade e estresse": {
    image: "/assets/ansiedade e estresse.jpg",
    audio: "/assets/ansiedade e estresse.m4a"
  },
  "Autoconhecimento profundo": {
    image: "/assets/meditação 2.jpg", // Fallback
    audio: "/assets/Autoconhecimento profundo.m4a"
  },
  "Cultivando a compaixão": {
    image: "/assets/meditação 3.jpg", // Fallback
    audio: "/assets/meditation-yoga-409201.mp3" // Fallback
  },
  "Equilíbrio emocional": {
    image: "/assets/meditação 4.jpg", // Fallback
    audio: "/assets/euqilibrio emocional.m4a"
  },

  // Populares
  "Sons da natureza": {
    image: "/assets/sons da natureza.jpg",
    audio: "/assets/natureza.mp3"
  },
  "Sono profundo": {
    image: "/assets/sono profundo.jpg",
    audio: "/assets/sono profundo.mp3"
  },

  // Práticas Rápidas
  "Pausa mindful": {
    image: "/assets/pausa mindful.jpg",
    audio: "/assets/pausa mindful.mp3"
  },
  "Respiração 4-7-8": {
    image: "/assets/respiração 4-7-8.jpg",
    audio: "/assets/respiração 4 7 8.m4a"
  },
  "Reset mental": {
    image: "/assets/reset mental.jpg",
    audio: "/assets/reset mental.mp3"
  },

  // Palestras
  "A ciência da meditação": {
    image: "/assets/meditação 5.jpg", // Fallback
    audio: "/assets/a ciência da meditação.m4a"
  },
  "Neuroplasticidade e mindfulness": {
    image: "/assets/meditation-program.jpg", // Fallback
    audio: "/assets/Neuroplasticidade e mindfulness.m4a"
  },
  "Budismo e meditação moderna": {
    image: "/assets/meditation-program.jpg", // Fallback
    audio: "/assets/Budismo e meditação moderna ‐ Feito com o Clipchamp.m4a"
  },
  "Seus limites e seu espaço de aceitação": {
    image: "/assets/meditation-program.jpg", // Fallback
    audio: "/assets/Seus limites e seu espaço de aceitação.m4a"
  },

  // Trabalho
  "Produtividade consciente": {
    image: "/assets/meditação 2.jpg", // Fallback
    audio: "/assets/produtividade consciente.mp3"
  },
  "Foco e concentração": {
    image: "/assets/foco e concentraçãõ.jpg",
    audio: "/assets/foco e concentração.mp3"
  },
  "Criatividade no trabalho": {
    image: "/assets/criatividade no trabalho.jpg",
    audio: "/assets/criatividade no trabalho.mp3"
  },

  // Jornadas
  "21 dias de gratidão": {
    image: "/assets/21 dis de gratidão.jpg",
    audio: "/assets/gratidão.m4a"
  },
  "Transformação pessoal": {
    image: "/assets/teansformação pessoal.jpg",
    audio: "/assets/transformação pessoal.m4a"
  },
  "Jornada de Sono": {
    image: "/assets/jornada de sono.jpg",
    audio: "/assets/jornada de sono.mp3"
  },
  "Jornada de Estresse e Ansiedade": {
    image: "/assets/jornada de estresse e ansiedade.jpg",
    audio: "/assets/Jornada de Estresse e Ansiedade.mp3"
  },
  "Jornada de Foco": {
    image: "/assets/jornada de foco.jpg",
    audio: "/assets/Jornada de Foco.mp3"
  },

  // Sessões de Sono
  "Sono - Sessão 1": {
    image: "/assets/sono-sessao1.jpg",
    audio: "/assets/sono-sessao1.mp3"
  },
  "Sono - Programa completo": {
    image: "/assets/sono - programa completo.jpg",
    audio: "/assets/Sono — Programa Completo.mp3"
  },
  "Sons para sono": {
    image: "/assets/sons para sono.jpg",
    audio: "/assets/sons para sono.mp3"
  },

  // Sessões de Ansiedade e Estresse
  "Estresse e Ansiedade - Sessão 1": {
    image: "/assets/estresse e ansiedade sessao 1.jpg",
    audio: "/assets/Estresse e Ansiedade — Sessao 1.mp3"
  },
  "Estresse e Ansiedade - Programa completo": {
    image: "/assets/estresse e ansiedade- programa completo.jpg",
    audio: "/assets/Estresse e Ansiedade — Programa Completo.mp3"
  },
  "Sons para estresse e ansiedade": {
    image: "/assets/sons para estresse e ansiedade.jpg",
    audio: "/assets/sons para estresse e ansiedade.mp3"
  },

  // Sessões de Foco
  "Foco - Sessão 1": {
    image: "/assets/foco e concentração.jpg",
    audio: "/assets/foco-sessao1.mp3"
  },
  "Foco - Programa completo": {
    image: "/assets/foco e concentração.jpg",
    audio: "/assets/Foco — Programa Completo.mp3"
  },
  "Sons para foco": {
    image: "/assets/sons para foco.jpg",
    audio: "/assets/sons para foco.mp3"
  },

  // Conteúdos adicionais do Explorar (newsletters e outros)
  "Como vai a sua saúde mental?": {
    image: "/assets/meditation-program.jpg",
    audio: "/assets/meditation-yoga-409201.mp3"
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

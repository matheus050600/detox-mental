// Mapeamento completo de todos os assets do projeto Detox Mental
// Este arquivo garante que cada conteúdo tenha sua imagem e áudio corretos

export interface AssetItem {
  title: string;
  image?: string;
  audio?: string;
  category: string;
  description?: string;
}

// Mapeamento de assets organizados por categoria
export const assetMapping: Record<string, AssetItem> = {
  // === PRIMEIROS PASSOS / COMEÇAR A MEDITAR ===
  'primeiros-passos': {
    title: 'Primeiros Passos',
    image: '/assets/primeiros passos.jpg',
    audio: '/assets/comece a meditar.m4a',
    category: 'comecar-meditar',
    description: 'Introdução à prática de meditação'
  },
  'comece-a-meditar': {
    title: 'Comece a Meditar',
    image: '/assets/comece a meditar 1.jpg',
    audio: '/assets/comece a meditar.m4a',
    category: 'comecar-meditar',
    description: 'Dê seus primeiros passos na meditação'
  },
  'meditacao-guiada-iniciantes': {
    title: 'Meditação Guiada para Iniciantes',
    image: '/assets/meditação guiada para iniciantes 1.jpg',
    audio: '/assets/meidtação guiada para iniciantes.m4a',
    category: 'comecar-meditar',
    description: 'Meditação especial para quem está começando'
  },

  // === ANSIEDADE E ESTRESSE ===
  'ansiedade-estresse': {
    title: 'Ansiedade e Estresse',
    image: '/assets/ansiedade e estresse.jpg',
    audio: '/assets/ansiedade e estresse.m4a',
    category: 'ansiedade',
    description: 'Acalme sua mente e reduza o estresse'
  },
  'reset-mental': {
    title: 'Reset Mental',
    image: '/assets/reset mental.jpg',
    audio: '/assets/reset mental.mp3',
    category: 'ansiedade',
    description: 'Reinicie sua mente e encontre paz'
  },
  'pausa-mindful': {
    title: 'Pausa Mindful',
    image: '/assets/pausa mindful.jpg',
    audio: '/assets/pausa mindful.mp3',
    category: 'ansiedade',
    description: 'Uma pausa consciente no seu dia'
  },

  // === AUTOCONHECIMENTO ===
  'autoconhecimento-profundo': {
    title: 'Autoconhecimento Profundo',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/autocinhecimento profundo.m4a',
    category: 'autoconhecimento',
    description: 'Conecte-se consigo mesmo profundamente'
  },
  'despertar-consciencia': {
    title: 'Despertar da Consciência',
    image: '/assets/despertar da cosciência.jpg',
    audio: '/assets/despertar da conciência.mp3',
    category: 'autoconhecimento',
    description: 'Desperte para uma nova consciência'
  },
  'transformacao-pessoal': {
    title: 'Transformação Pessoal',
    image: '/assets/teansformação pessoal.jpg',
    audio: '/assets/transformação pessoal.m4a',
    category: 'autoconhecimento',
    description: 'Transforme-se de dentro para fora'
  },

  // === MEDITAÇÕES PARA O SONO ===
  'sono-profundo': {
    title: 'Sono Profundo',
    image: '/assets/sono profundo.jpg',
    audio: '/assets/sono profundo.mp3',
    category: 'sono',
    description: 'Adormeça profundamente e descanse'
  },
  'sons-sono': {
    title: 'Sons para Sono',
    image: '/assets/sleep-journey.jpg',
    audio: '/assets/sons para sono.m4a',
    category: 'sono',
    description: 'Sons relaxantes para dormir melhor'
  },
  'sleep-music': {
    title: 'Música para Dormir',
    image: '/assets/sleep-journey.jpg',
    audio: '/assets/sleep-music-vol15-195425.mp3',
    category: 'sono',
    description: 'Melodias suaves para um sono tranquilo'
  },
  'soothing-dreams': {
    title: 'Sonhos Tranquilos',
    image: '/assets/sleep-journey.jpg',
    audio: '/assets/soothing-dreams-165498.mp3',
    category: 'sono',
    description: 'Música serena para sonhos pacíficos'
  },

  // === FOCO E CONCENTRAÇÃO ===
  'foco-concentracao': {
    title: 'Foco e Concentração',
    image: '/assets/foco e concentraçãõ.jpg',
    audio: '/assets/foco e concentração.mp3',
    category: 'foco',
    description: 'Aumente seu foco e produtividade'
  },
  'foco': {
    title: 'Foco',
    image: '/assets/foco e concentraçãõ.jpg',
    audio: '/assets/foco.m4a',
    category: 'foco',
    description: 'Treine sua atenção plena'
  },
  'sons-foco': {
    title: 'Sons para Foco',
    image: '/assets/sons da natureza.jpg',
    audio: '/assets/sons para foco.mp3',
    category: 'foco',
    description: 'Ambiente sonoro para concentração'
  },

  // === MINDFULNESS / ATENÇÃO PLENA ===
  'atencao-plena-iniciantes': {
    title: 'Atenção Plena para Iniciantes',
    image: '/assets/atenção plena para iniciantes.jpg',
    audio: '/assets/meditation-yoga-409201.mp3',
    category: 'mindfulness',
    description: 'Aprenda a estar presente no momento'
  },
  'iniciacao-mindfulness': {
    title: 'Iniciação ao Mindfulness',
    image: '/assets/iniciação ao mindfulness.jpg',
    audio: '/assets/Mindfulness na rotina diária.mp3',
    category: 'mindfulness',
    description: 'Comece sua jornada de atenção plena'
  },
  'mindfulness-rotina': {
    title: 'Mindfulness na Rotina Diária',
    image: '/assets/iniciação ao mindfulness.jpg',
    audio: '/assets/Mindfulness na rotina diária.mp3',
    category: 'mindfulness',
    description: 'Integre mindfulness no seu dia a dia'
  },

  // === RESPIRAÇÃO ===
  'respiracao-consciente': {
    title: 'Respiração Consciente',
    image: '/assets/reapiração consciente.jpg',
    audio: '/assets/respiração consciente.mp3',
    category: 'respiracao',
    description: 'Técnicas de respiração para acalmar'
  },
  'respiracao-4-7-8': {
    title: 'Respiração 4-7-8',
    image: '/assets/respiração 4-7-8.jpg',
    audio: '/assets/respiração 4 7 8.m4a',
    category: 'respiracao',
    description: 'Técnica poderosa para relaxamento'
  },

  // === PAZ INTERIOR ===
  'paz-interior': {
    title: 'Paz Interior',
    image: '/assets/paz interior.jpg',
    audio: '/assets/paz interior.mp3',
    category: 'paz',
    description: 'Encontre a paz que reside em você'
  },
  'encontrando-paz': {
    title: 'Encontrando a Paz Interior',
    image: '/assets/paz interior.jpg',
    audio: '/assets/encontrando a paz interior.mp3',
    category: 'paz',
    description: 'Jornada para o seu centro de paz'
  },

  // === GRATIDÃO ===
  'gratidao-diaria': {
    title: 'Gratidão Diária',
    image: '/assets/gratidão diaria.jpg',
    audio: '/assets/gratidão diaria.mp3',
    category: 'gratidao',
    description: 'Cultive a gratidão em sua vida'
  },
  'gratidao-21-dias': {
    title: '21 Dias de Gratidão',
    image: '/assets/21 dis de gratidão.jpg',
    audio: '/assets/gratidão.m4a',
    category: 'gratidao',
    description: 'Transforme sua vida em 21 dias'
  },

  // === TRABALHO ===
  'criatividade-trabalho': {
    title: 'Criatividade no Trabalho',
    image: '/assets/criatividade no trabalho.jpg',
    audio: '/assets/criatividade no trabalho.mp3',
    category: 'trabalho',
    description: 'Desperte sua criatividade profissional'
  },
  'produtividade-consciente': {
    title: 'Produtividade Consciente',
    image: '/assets/criatividade no trabalho.jpg',
    audio: '/assets/produtividade consciente.mp3',
    category: 'trabalho',
    description: 'Seja produtivo com consciência'
  },

  // === JORNADAS / PROGRAMAS ===
  'ciencia-meditacao': {
    title: 'A Ciência da Meditação',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/a ciência da meditação.m4a',
    category: 'jornadas',
    description: 'Entenda a base científica da meditação'
  },
  'como-meditacao-transforma': {
    title: 'Como a Meditação Transforma Sua Vida',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/como a meditação transforma a sua vida.m4a',
    category: 'jornadas',
    description: 'Descubra o poder transformador'
  },
  'budismo-meditacao': {
    title: 'Budismo e Meditação Moderna',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/Budismo e meditação moderna ‐ Feito com o Clipchamp.m4a',
    category: 'jornadas',
    description: 'Sabedoria ancestral aplicada ao presente'
  },
  'neuroplasticidade-mindfulness': {
    title: 'Neuroplasticidade e Mindfulness',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/Neuroplasticidade e mindfulness.m4a',
    category: 'jornadas',
    description: 'Como a meditação transforma o cérebro'
  },
  'seus-limites': {
    title: 'Seus Limites e Seu Espaço de Aceitação',
    image: '/assets/meditation-program.jpg',
    audio: '/assets/Seus limites e seu espaço de aceitação.m4a',
    category: 'jornadas',
    description: 'Conheça e respeite seus limites'
  },

  // === EQUILÍBRIO EMOCIONAL ===
  'equilibrio-emocional': {
    title: 'Equilíbrio Emocional',
    image: '/assets/stress-relief.jpg',
    audio: '/assets/euqilibrio emocional.m4a',
    category: 'emocional',
    description: 'Encontre seu centro emocional'
  },

  // === SONS DA NATUREZA ===
  'sons-natureza': {
    title: 'Sons da Natureza',
    image: '/assets/sons da natureza.jpg',
    audio: '/assets/natureza.mp3',
    category: 'natureza',
    description: 'Conecte-se com a natureza'
  },
  'lareira': {
    title: 'Lareira',
    image: '/assets/sons da natureza.jpg',
    audio: '/assets/lareira.mp4',
    category: 'natureza',
    description: 'Som relaxante de lareira'
  },
  'noite-estrelada': {
    title: 'Noite Estrelada',
    image: '/assets/sons da natureza.jpg',
    audio: '/assets/mixkit-staring-at-the-night-sky-168.mp3',
    category: 'natureza',
    description: 'Contemple o céu noturno'
  },

  // === MEDITAÇÃO SERENA ===
  'meditacao-serena': {
    title: 'Meditação Serena',
    image: '/assets/meditação.jpg',
    audio: '/assets/serene-meditation-252456.mp3',
    category: 'geral',
    description: 'Paz e serenidade profunda'
  },
};

// Frases motivacionais (alternadas aleatoriamente)
export const fradesMotivacionais = [
  '/assets/frase motivacional.jpg',
  '/assets/frase motivacional 1.jpg',
  '/assets/frase motivacional 2.jpg',
];

// Função para pegar uma frase motivacional aleatória
export const getFraseMotivacionalAleatoria = () => {
  const index = Math.floor(Math.random() * fradesMotivacionais.length);
  return fradesMotivacionais[index];
};

// Logo principal
export const logoPath = '/assets/logo.png';

// Imagens genéricas/hero
export const heroImages = {
  meditation: '/assets/hero-meditation.jpg',
  program: '/assets/meditation-program.jpg',
  stressRelief: '/assets/stress-relief.jpg',
  sleepJourney: '/assets/sleep-journey.jpg',
};

// Função auxiliar para buscar asset por título/slug
export const getAssetBySlug = (slug: string): AssetItem | undefined => {
  return assetMapping[slug];
};

// Função auxiliar para buscar assets por categoria
export const getAssetsByCategory = (category: string): AssetItem[] => {
  return Object.values(assetMapping).filter(asset => asset.category === category);
};

// Exportar lista de todas as imagens para pré-carregamento
export const allImages = Object.values(assetMapping)
  .map(asset => asset.image)
  .filter((img): img is string => img !== undefined);

// Exportar lista de todos os áudios
export const allAudios = Object.values(assetMapping)
  .map(asset => asset.audio)
  .filter((audio): audio is string => audio !== undefined);

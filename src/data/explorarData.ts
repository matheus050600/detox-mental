// Dados centralizados para as páginas do Explorar

export interface ConteudoAudio {
  title: string;
  type: string;
  duration: string;
  description: string;
  benefits: string[];
}

// Começar a meditar
export const comecarMeditar: Record<string, ConteudoAudio> = {
  "primeiros-passos": {
    title: "Primeiros passos na meditação",
    type: "PROGRAMA",
    duration: "7 min",
    description: "Dê seus primeiros passos no mundo da meditação com esta prática guiada especialmente desenvolvida para iniciantes. Aprenda as técnicas fundamentais de forma simples e acessível.",
    benefits: ["Introdução suave à meditação", "Técnicas básicas de respiração", "Desenvolvimento de foco", "Redução do estresse inicial"]
  },
  "respiracao-consciente": {
    title: "Respiração consciente",
    type: "MEDITAÇÃO",
    duration: "5 min",
    description: "Explore o poder transformador da respiração consciente. Uma prática simples mas poderosa que você pode usar em qualquer momento do dia para encontrar calma e clareza.",
    benefits: ["Acalma a mente rapidamente", "Reduz ansiedade", "Melhora oxigenação", "Fácil de praticar em qualquer lugar"]
  },
  "mindfulness": {
    title: "Iniciação ao mindfulness",
    type: "JORNADA",
    duration: "14 dias",
    description: "Uma jornada completa de 14 dias para desenvolver a prática de mindfulness em sua vida. Cada dia traz novos insights e técnicas para cultivar a presença plena.",
    benefits: ["Desenvolve consciência plena", "Reduz reatividade emocional", "Melhora qualidade de vida", "Prática estruturada e progressiva"]
  },
  "atencao-plena": {
    title: "Atenção plena para iniciantes",
    type: "MEDITAÇÃO",
    duration: "10 min",
    description: "Aprenda a cultivar atenção plena através desta meditação guiada especialmente projetada para iniciantes. Desenvolva a habilidade de estar presente no momento atual.",
    benefits: ["Cultiva presença", "Reduz dispersão mental", "Aumenta consciência", "Base sólida para prática"]
  }
};

// Programas de meditação
export const programasMeditacao: Record<string, ConteudoAudio> = {
  "ansiedade": {
    title: "Ansiedade e estresse",
    type: "PROGRAMA",
    duration: "21 dias",
    description: "Programa completo de 21 dias focado em técnicas comprovadas para reduzir ansiedade e estresse. Aprenda a gerenciar suas emoções de forma saudável.",
    benefits: ["Reduz ansiedade significativamente", "Técnicas de gerenciamento de estresse", "Melhora saúde mental", "Resultados duradouros"]
  },
  "autoconhecimento": {
    title: "Autoconhecimento profundo",
    type: "PROGRAMA",
    duration: "30 dias",
    description: "Jornada de 30 dias de exploração interior e autoconhecimento. Descubra camadas mais profundas de si mesmo e desenvolva maior consciência sobre seus padrões e potenciais.",
    benefits: ["Maior clareza sobre si mesmo", "Identifica padrões limitantes", "Desenvolve autoaceitação", "Transformação pessoal profunda"]
  },
  "compaixao": {
    title: "Cultivando a compaixão",
    type: "PROGRAMA",
    duration: "14 dias",
    description: "Desenvolva compaixão por si mesmo e pelos outros através de práticas guiadas de loving-kindness e meditação compassiva.",
    benefits: ["Desenvolve autocompaixão", "Melhora relacionamentos", "Reduz autocrítica", "Aumenta bem-estar emocional"]
  },
  "equilibrio": {
    title: "Equilíbrio emocional",
    type: "PROGRAMA",
    duration: "21 dias",
    description: "Aprenda a manter equilíbrio emocional mesmo em situações desafiadoras. Técnicas práticas para regular emoções e cultivar estabilidade interior.",
    benefits: ["Regula emoções efetivamente", "Maior estabilidade emocional", "Resiliência aumentada", "Paz interior duradoura"]
  }
};

// Populares
export const populares: Record<string, ConteudoAudio> = {
  "paz-interior": {
    title: "Paz interior",
    type: "MEDITAÇÃO",
    duration: "15 min",
    description: "Uma das meditações mais populares do aplicativo. Encontre um refúgio de paz e tranquilidade interior através desta prática profundamente relaxante.",
    benefits: ["Paz profunda", "Relaxamento completo", "Reduz agitação mental", "Restaura energia"]
  },
  "sons-natureza": {
    title: "Sons da natureza",
    type: "LISTA DE REPRODUÇÃO",
    duration: "60 min",
    description: "Coleção cuidadosamente selecionada de sons da natureza para meditação, relaxamento ou trabalho focado. Deixe-se envolver pela serenidade natural.",
    benefits: ["Promove relaxamento profundo", "Melhora concentração", "Reduz estresse", "Conecta com a natureza"]
  },
  "sono-profundo": {
    title: "Sono profundo",
    type: "JORNADA",
    duration: "21 dias",
    description: "Programa de 21 dias para melhorar significativamente a qualidade do seu sono. Técnicas comprovadas para adormecer mais rápido e dormir mais profundamente.",
    benefits: ["Melhora qualidade do sono", "Reduz insônia", "Sono mais restaurador", "Mais energia no dia"]
  },
  "gratidao-diaria": {
    title: "Gratidão diária",
    type: "MEDITAÇÃO",
    duration: "8 min",
    description: "Prática diária de gratidão que transforma sua perspectiva e eleva seu estado emocional. Descubra o poder transformador da gratidão.",
    benefits: ["Aumenta felicidade", "Melhora perspectiva de vida", "Reduz negatividade", "Cultiva apreciação"]
  }
};

// Demais categorias com estrutura similar...
export const praticasRapidas: Record<string, ConteudoAudio> = {
  "pausa-mindful": {
    title: "Pausa mindful",
    type: "MEDITAÇÃO",
    duration: "1 min",
    description: "Uma pausa rápida de 1 minuto para trazer você de volta ao presente. Perfeito para momentos de estresse ou quando precisa de um reset mental rápido.",
    benefits: ["Reset mental instantâneo", "Reduz estresse rapidamente", "Praticável em qualquer lugar", "Melhora foco imediato"]
  },
  "respiracao-478": {
    title: "Respiração 4-7-8",
    type: "MEDITAÇÃO",
    duration: "3 min",
    description: "Técnica poderosa de respiração 4-7-8 que acalma o sistema nervoso rapidamente. Inspire por 4, segure por 7, expire por 8.",
    benefits: ["Acalma sistema nervoso", "Reduz ansiedade rapidamente", "Melhora sono", "Fácil de aprender"]
  },
  "reset-mental": {
    title: "Reset mental",
    type: "MEDITAÇÃO",
    duration: "5 min",
    description: "Reset mental de 5 minutos para limpar a mente e renovar sua energia. Ideal para pausas durante o trabalho ou estudo.",
    benefits: ["Renova energia mental", "Melhora clareza", "Reduz fadiga", "Aumenta produtividade"]
  }
};

// Continua com as outras categorias...
export const palestras: Record<string, ConteudoAudio> = {
  "ciencia-meditacao": {
    title: "A ciência da meditação",
    type: "PALESTRA",
    duration: "45 min",
    description: "Explore as descobertas científicas sobre os efeitos da meditação no cérebro e no corpo. Baseado em pesquisas recentes de neurociência.",
    benefits: ["Compreensão científica", "Motivação para praticar", "Evidências comprovadas", "Conhecimento aprofundado"]
  },
  "neuroplasticidade": {
    title: "Neuroplasticidade e mindfulness",
    type: "PALESTRA",
    duration: "38 min",
    description: "Descubra como a meditação pode literalmente mudar a estrutura do seu cérebro através da neuroplasticidade.",
    benefits: ["Entende mudanças cerebrais", "Insights sobre aprendizado", "Potencial de transformação", "Base científica sólida"]
  },
  "budismo": {
    title: "Budismo e meditação moderna",
    type: "PALESTRA",
    duration: "52 min",
    description: "Explore as raízes budistas da meditação e como elas se aplicam à vida moderna. Uma ponte entre sabedoria antiga e ciência contemporânea.",
    benefits: ["Contexto histórico", "Sabedoria atemporal", "Aplicação prática", "Compreensão profunda"]
  },
  "limites": {
    title: "Seus limites e seu espaço de aceitação",
    type: "PALESTRA",
    duration: "40 min",
    description: "Palestra sobre como reconhecer e respeitar seus limites enquanto cultiva um espaço interior de aceitação e compaixão.",
    benefits: ["Reconhece limites pessoais", "Desenvolve autoaceitação", "Reduz autocrítica", "Promove autocompaixão"]
  }
};

export const trabalho: Record<string, ConteudoAudio> = {
  "produtividade": {
    title: "Produtividade consciente",
    type: "PROGRAMA",
    duration: "14 dias",
    description: "Programa de 14 dias para aumentar sua produtividade através de mindfulness e foco consciente. Trabalhe de forma mais inteligente, não mais difícil.",
    benefits: ["Aumenta produtividade", "Reduz procrastinação", "Melhora foco", "Trabalho mais eficiente"]
  },
  "foco": {
    title: "Foco e concentração",
    type: "MEDITAÇÃO",
    duration: "12 min",
    description: "Meditação especialmente projetada para desenvolver foco profundo e concentração sustentada. Ideal antes de tarefas que exigem atenção.",
    benefits: ["Melhora concentração", "Aumenta atenção", "Reduz distrações", "Performance aprimorada"]
  },
  "criatividade": {
    title: "Criatividade no trabalho",
    type: "MEDITAÇÃO",
    duration: "10 min",
    description: "Desbloqueie sua criatividade através desta meditação que abre espaço mental para novas ideias e soluções inovadoras.",
    benefits: ["Estimula criatividade", "Desbloq ueia ideias", "Pensamento inovador", "Solução de problemas"]
  }
};

export const newsletters: Record<string, ConteudoAudio> = {
  "news-saude": {
    title: "Como vai a sua saúde mental?",
    type: "BLOG",
    duration: "5 min",
    description: "Reflexão guiada sobre sua saúde mental atual e dicas práticas para cuidar melhor do seu bem-estar emocional.",
    benefits: ["Autoavaliação mental", "Dicas práticas", "Consciência sobre saúde", "Cuidado preventivo"]
  },
  "news-vida": {
    title: "Sua vida, sua cena",
    type: "BLOG",
    duration: "6 min",
    description: "Inspiração para viver sua vida de forma mais autêntica e alinhada com seus valores verdadeiros.",
    benefits: ["Inspiração autêntica", "Clareza de valores", "Motivação pessoal", "Direção de vida"]
  },
  "news-duvida": {
    title: "Duvidar faz parte do processo",
    type: "BLOG",
    duration: "5 min",
    description: "Abordagem compassiva sobre dúvidas e incertezas no caminho da meditação e crescimento pessoal.",
    benefits: ["Normaliza dúvidas", "Reduz autocrítica", "Motivação renovada", "Perspectiva realista"]
  }
};

export const jornadas: Record<string, ConteudoAudio> = {
  "jornada-gratidao": {
    title: "21 dias de gratidão",
    type: "JORNADA",
    duration: "21 dias",
    description: "Jornada transformadora de 21 dias focada em cultivar gratidão profunda. Cada dia traz uma nova prática para desenvolver apreciação pela vida.",
    benefits: ["Transforma perspectiva", "Aumenta felicidade", "Reduz negatividade", "Cultiva abundância"]
  },
  "jornada-consciencia": {
    title: "Despertar da consciência",
    type: "JORNADA",
    duration: "30 dias",
    description: "Jornada profunda de 30 dias para expandir sua consciência e desenvolver maior clareza sobre si mesmo e o mundo ao redor.",
    benefits: ["Expande consciência", "Maior clareza", "Transformação profunda", "Sabedoria interior"]
  },
  "jornada-transformacao": {
    title: "Transformação pessoal",
    type: "JORNADA",
    duration: "60 dias",
    description: "Jornada intensiva de 60 dias de transformação pessoal completa. Um compromisso profundo com seu crescimento e evolução.",
    benefits: ["Transformação completa", "Mudanças duradouras", "Crescimento acelerado", "Novo nível de ser"]
  }
};

export interface SeriesMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const SERIES: Record<string, SeriesMeta> = {
  'network-essentials': {
    title: 'Network Essentials',
    description: 'Fundamentos de redes: protocolos, tráfico y análisis de paquetes.',
    icon: '🌐',
    color: '#00e5ff',
  },
  'linux-fundamentals': {
    title: 'Fundamentos de Linux',
    description: 'Shells, comandos y conceptos esenciales para trabajar en Linux.',
    icon: '🐧',
    color: '#ffd32a',
  },
};

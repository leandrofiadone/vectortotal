export interface SeriesMeta {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const SERIES: Record<string, SeriesMeta> = {
  'network': {
    title: 'Network',
    description: 'Fundamentos de redes y protocolos core: desde cómo se asignan IPs hasta cómo funciona la web.',
    icon: '🌐',
    color: '#00e5ff',
  },
  'linux-fundamentals': {
    title: 'Fundamentos de Linux',
    description: 'Shells, comandos y conceptos esenciales para trabajar en Linux.',
    icon: '🐧',
    color: '#ffd32a',
  },
  'crypto': {
    title: 'Criptografía',
    description: 'Cifrado asimétrico, firmas digitales, SSH, GPG y los mecanismos que protegen la comunicación digital.',
    icon: '🔐',
    color: '#a29bfe',
  },
};

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
  'cve': {
    title: 'CVE Analysis',
    description: 'Análisis técnico de vulnerabilidades reales: cómo funcionan, cómo se explotan y cómo se detectan.',
    icon: '🐛',
    color: '#ff6b6b',
  },
  'metasploit': {
    title: 'Metasploit',
    description: 'El framework de explotación estándar: módulos, payloads, Meterpreter y práctica en máquinas reales.',
    icon: '⚔️',
    color: '#00b894',
  },
  'ia': {
    title: 'IA & Seguridad',
    description: 'Cómo la inteligencia artificial cambia el panorama de la ciberseguridad: amenazas nuevas, ataques amplificados y defensas.',
    icon: '🧠',
    color: '#fd79a8',
  },
};

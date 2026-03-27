export interface MapNode {
  id: string;
  label: string;
  desc: string;
  excerpt: string;
  group: 'network' | 'protocols' | 'linux';
  tags: string[];
  slug: string;
  series: string;
  subsection?: string;
  x: number;
  y: number;
  z: number;
}

export interface MapEdge {
  from: string;
  to: string;
  label: string;
}

// Layout: wide spacing, minimal overlap
// Network: far left    (x: -12 to -6)
// Protocols: center    (x: -2 to 5)
// Linux: far right     (x: 9 to 12)

export const MAP_NODES: MapNode[] = [
  // ── Network Essentials ──
  {
    id: 'dhcp', label: 'DHCP', desc: 'Asignación de IP', group: 'network',
    excerpt: 'Cómo tu dispositivo obtiene IP automáticamente. El proceso DORA y análisis con tshark.',
    tags: ['net', 'fundamentos'],
    slug: 'dhcp-como-funciona', series: 'network', subsection: 'network-essentials',
    x: -11, y: 4, z: 0,
  },
  {
    id: 'arp', label: 'ARP', desc: 'IP → MAC', group: 'network',
    excerpt: 'El puente entre IPs y direcciones MAC. Cómo funciona, cómo se ve en Wireshark y por qué importa.',
    tags: ['net', 'fundamentos'],
    slug: 'arp-resolucion-de-mac', series: 'network', subsection: 'network-essentials',
    x: -7, y: 4.5, z: 0.3,
  },
  {
    id: 'icmp', label: 'ICMP', desc: 'Diagnóstico de red', group: 'network',
    excerpt: 'Ping, traceroute y diagnóstico de red. Cómo ICMP reporta errores y diagnostica conectividad.',
    tags: ['net', 'fundamentos'],
    slug: 'icmp-ping-traceroute', series: 'network', subsection: 'network-essentials',
    x: -11, y: -1, z: -0.2,
  },
  {
    id: 'nat', label: 'NAT', desc: 'Traducción de direcciones', group: 'network',
    excerpt: 'Cómo una sola IP pública sirve a toda una red. Traducción de direcciones y puertos.',
    tags: ['net', 'fundamentos'],
    slug: 'nat-traduccion-de-direcciones', series: 'network', subsection: 'network-essentials',
    x: -7, y: 0, z: 0.1,
  },
  {
    id: 'routing', label: 'Routing', desc: 'Camino entre redes', group: 'network',
    excerpt: 'Cómo los paquetes cruzan Internet. Tablas de rutas, OSPF, BGP y el camino entre redes.',
    tags: ['net', 'fundamentos'],
    slug: 'routing-como-viajan-los-paquetes', series: 'network', subsection: 'network-essentials',
    x: -9, y: -5, z: -0.1,
  },

  // ── Protocols ──
  {
    id: 'dns', label: 'DNS', desc: 'Nombre → IP', group: 'protocols',
    excerpt: 'DNS convierte nombres en IPs. WHOIS te dice quién está detrás. La base del reconocimiento.',
    tags: ['net', 'fundamentos'],
    slug: 'dns-y-whois', series: 'network', subsection: 'network-core-protocols',
    x: -1, y: 5, z: 0.2,
  },
  {
    id: 'http', label: 'HTTP', desc: 'Protocolo web', group: 'protocols',
    excerpt: 'Cómo tu browser habla con los servidores. Métodos, códigos de estado, headers y HTTPS.',
    tags: ['net', 'web', 'fundamentos'],
    slug: 'http-como-funciona', series: 'network', subsection: 'network-core-protocols',
    x: 4, y: 4, z: -0.3,
  },
  {
    id: 'ftp', label: 'FTP', desc: 'Transferencia de archivos', group: 'protocols',
    excerpt: 'Dos conexiones TCP: una para comandos, otra para datos. Todo en texto plano.',
    tags: ['net', 'fundamentos'],
    slug: 'ftp-transferencia-de-archivos', series: 'network', subsection: 'network-core-protocols',
    x: 5, y: -1, z: 0.4,
  },
  {
    id: 'smtp', label: 'Email', desc: 'SMTP / POP3 / IMAP', group: 'protocols',
    excerpt: 'SMTP envía, POP3 descarga, IMAP sincroniza. Tres protocolos que mueven el email.',
    tags: ['net', 'fundamentos'],
    slug: 'smtp-pop3-imap-email', series: 'network', subsection: 'network-core-protocols',
    x: 1, y: -4, z: -0.2,
  },
  {
    id: 'ports', label: 'Puertos', desc: 'Referencia de servicios', group: 'protocols',
    excerpt: 'Referencia rápida de protocolos de aplicación: puerto, transporte, cifrado y función.',
    tags: ['net', 'fundamentos'],
    slug: 'protocolos-referencia-puertos', series: 'network', subsection: 'network-core-protocols',
    x: -1, y: 0, z: 0,
  },

  // ── Linux ──
  {
    id: 'shells', label: 'Shells', desc: 'Bash, Fish, Zsh', group: 'linux',
    excerpt: 'Bash, Fish y Zsh. Cómo funcionan las shells, cuáles existen y cuándo usar cada una.',
    tags: ['linux', 'fundamentos'],
    slug: 'shells-de-linux', series: 'linux-fundamentals',
    x: 10, y: 1, z: 0,
  },
];

// Fewer edges — only the most meaningful connections
export const MAP_EDGES: MapEdge[] = [
  // Network chain
  { from: 'dhcp',    to: 'arp',     label: 'DHCP necesita ARP para verificar IPs' },
  { from: 'dhcp',    to: 'nat',     label: 'IP privada asignada pasa por NAT' },
  { from: 'nat',     to: 'routing', label: 'NAT traduce antes de rutear' },
  { from: 'routing', to: 'icmp',    label: 'ICMP diagnostica rutas' },

  // Network → Protocols (key transitions)
  { from: 'arp',     to: 'dns',     label: 'ARP resuelve L2, DNS resuelve L7' },
  { from: 'dns',     to: 'http',    label: 'DNS resuelve el dominio para HTTP' },
  { from: 'dns',     to: 'ftp',     label: 'DNS resuelve el host del servidor FTP' },
  { from: 'dns',     to: 'smtp',    label: 'DNS + registros MX para email' },
  { from: 'routing', to: 'ports',   label: 'Rutas llevan tráfico a puertos destino' },
  { from: 'ports',   to: 'dns',     label: 'Puerto 53 → DNS' },

  // Cross-group
  { from: 'http',    to: 'shells',  label: 'Servidores web administrados desde shell' },
];

export const GROUP_COLORS: Record<MapNode['group'], string> = {
  network:   '#00e5ff',
  protocols: '#a78bfa',
  linux:     '#ffd32a',
};

export const GROUP_LABELS: Record<MapNode['group'], string> = {
  network:   'Fundamentos de Red',
  protocols: 'Protocolos',
  linux:     'Linux',
};

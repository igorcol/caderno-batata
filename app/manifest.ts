import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Caderno Batata',
    short_name: 'Batata',
    description: 'Só batatada sincera.',
    start_url: '/',
    display: 'standalone', 
    background_color: '#FFD700', // Amarelo do fundo
    theme_color: '#FFD700',      // Cor da barra de status
    orientation: 'portrait',     // Trava em pé 
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
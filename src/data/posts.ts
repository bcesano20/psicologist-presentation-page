// Mock data standing in for the Supabase `posts` table until the real
// integration is wired up. Shape mirrors the columns described in README.md.
export interface PostInterface {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown, rendered to HTML only at display time
  coverImageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const posts: PostInterface[] = [
  {
    id: '1',
    title: 'Cómo manejar la ansiedad en el día a día',
    slug: 'como-manejar-la-ansiedad',
    content: `## Reconocer la ansiedad

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet molestie urna. Etiam volutpat, arcu quis efficitur vehicula, sapien augue faucibus turpis, vitae congue elit nulla aliquet risus.

## Algunas estrategias

- Lorem ipsum dolor sit amet
- Consectetur adipiscing elit
- Vivamus sit amet molestie urna
- Etiam volutpat arcu quis efficitur

Quisque interdum, urna ac rhoncus commodo, lectus nunc molestie turpis, sed porta ligula sapien sit amet arcu. Nulla auctor mattis elit in cursus.

## Cuándo pedir ayuda profesional

Mauris suscipit ac libero ut maximus. Morbi sed vulputate lorem. Fusce eleifend, quam eget pretium suscipit, lorem eros posuere nisl, at convallis magna nunc sed odio.`,
    coverImageUrl: null,
    published: true,
    createdAt: '2026-06-10',
    updatedAt: '2026-06-12',
  },
  {
    id: '2',
    title: 'La importancia del autocuidado',
    slug: 'importancia-del-autocuidado',
    content: `## Por qué importa

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet molestie urna.

## Hábitos simples

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Vivamus sit amet molestie urna

Etiam volutpat, arcu quis efficitur vehicula, sapien augue faucibus turpis, vitae congue elit nulla aliquet risus.`,
    coverImageUrl: null,
    published: false,
    createdAt: '2026-06-28',
    updatedAt: '2026-07-02',
  },
  {
    id: '3',
    title: 'Primeros pasos en terapia: qué esperar',
    slug: 'primeros-pasos-en-terapia',
    content: `## La primera sesión

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet molestie urna. Etiam volutpat, arcu quis efficitur vehicula.

## Preguntas frecuentes

**¿Cuánto dura el proceso?**

Sapien augue faucibus turpis, vitae congue elit nulla aliquet risus.

**¿Es confidencial?**

Quisque interdum, urna ac rhoncus commodo, lectus nunc molestie turpis, sed porta ligula sapien sit amet arcu.`,
    coverImageUrl: null,
    published: true,
    createdAt: '2026-07-18',
    updatedAt: '2026-07-20',
  },
];

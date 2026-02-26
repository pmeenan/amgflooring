import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        image: z.string().optional(),
        order: z.number().optional(),
    }),
});

const galleryCollection = defineCollection({
    type: 'data',
    schema: z.object({
        group: z.string(),
        order: z.number(),
        coverImage: z.string(),
        images: z.array(z.object({
            src: z.string(),
            alt: z.string()
        }))
    })
});

export const collections = {
    'services': servicesCollection,
    'gallery': galleryCollection,
};

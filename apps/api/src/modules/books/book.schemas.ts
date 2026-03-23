import { z } from 'zod';

const frameSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const imageSlotSchema = frameSchema.extend({
  type: z.literal('image').optional(),
  imageId: z.string().uuid(),
  zoom: z.number().positive().default(1),
  cropX: z.number().default(0),
  cropY: z.number().default(0),
  rotation: z.number().default(0),
});

const textSlotSchema = frameSchema.extend({
  type: z.literal('text'),
  text: z.string().trim().min(1).max(4000),
  fontSize: z.number().positive().default(22),
  fontFamily: z.string().default('Assistant'),
  color: z.string().default('#2b1e18'),
  fontWeight: z.enum(['normal', 'bold']).default('normal'),
  align: z.enum(['right', 'center', 'left']).default('right'),
});

export const layoutSlotSchema = z.union([imageSlotSchema, textSlotSchema]);

export const pageLayoutSchema = z.object({
  pageNumber: z.number().int().min(1),
  layoutType: z.string().trim().min(1).max(80),
  slots: z.array(layoutSlotSchema),
});

export const pagesLayoutSchema = z.array(pageLayoutSchema);

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});

export const updateBookSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    pagesLayout: pagesLayoutSchema.optional(),
  })
  .refine((value) => value.title !== undefined || value.pagesLayout !== undefined, {
    message: 'Send at least one field to update.',
  });

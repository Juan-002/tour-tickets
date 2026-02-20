//Schemas de Zod
import { z } from "zod";

export const createTourSchema = z.object({
  title:        z.string().min(3).max(100),
  description:  z.string().min(10).max(1000),
  price:        z.number().positive(),
  imageUrl:     z.string().url().or(z.literal("")),
  totalSlots:   z.number().int().positive().max(500),
  location:     z.string().min(3).max(100),
  duration:     z.string().min(2).max(50),
  nights:       z.number().int().min(0).default(0),
  petsAllowed:  z.boolean().default(false),
  kidsAllowed:  z.boolean().default(true),
  hasTransport: z.boolean().default(false),
  hasLodging:   z.boolean().default(false),
  lodgingType:  z.string().optional(),
});
export const createTicketSchema = z.object({
  tourId: z.string().cuid("Tour inválido"),
  userId: z.string().cuid("Usuario inválido"),
  quantity: z.number().int().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas"),
});

export type CreateTourInput = z.infer<typeof createTourSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
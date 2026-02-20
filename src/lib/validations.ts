//Schemas de Zod
import { z } from "zod";

export const createTourSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  totalSlots: z.number().int().positive("Los cupos deben ser mayor a 0"),
  location: z.string().min(3, "La ubicación es requerida"),
  duration: z.string().min(2, "La duración es requerida"),
});

export const createTicketSchema = z.object({
  tourId: z.string().cuid("Tour inválido"),
  userId: z.string().cuid("Usuario inválido"),
  quantity: z.number().int().min(1, "Mínimo 1 persona").max(20, "Máximo 20 personas"),
});

export type CreateTourInput = z.infer<typeof createTourSchema>;
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
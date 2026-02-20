import { prisma } from "@/lib/prisma";
import { CreateTicketDTO, ITicket } from "@/types";
import { TicketStatus } from "@prisma/client";

export const ticketService = {
  // ── Crear tiquete ───────────────────────────────────────────
  // Usa transacción para garantizar atomicidad:
  // crea el tiquete y resta cupos en una sola operación
  async create(data: CreateTicketDTO): Promise<ITicket> {
    const tour = await prisma.tour.findUnique({ where: { id: data.tourId } });

    if (!tour) throw new Error("Tour no encontrado");
    if (tour.availableSlots < data.quantity)
      throw new Error(`Solo quedan ${tour.availableSlots} cupos disponibles`);

    const totalPrice = tour.price * data.quantity;

    const [ticket] = await prisma.$transaction([
      prisma.ticket.create({
        data: {
          userId:     data.userId,
          tourId:     data.tourId,
          quantity:   data.quantity,
          totalPrice,
          status:     TicketStatus.CONFIRMED,
        },
        include: { tour: true, user: true },
      }),
      prisma.tour.update({
        where: { id: data.tourId },
        data:  { availableSlots: { decrement: data.quantity } },
      }),
    ]);

    return ticket as ITicket;
  },

  // ── Obtener todos ───────────────────────────────────────────
  async getAll(): Promise<ITicket[]> {
    return prisma.ticket.findMany({
      include:  { tour: true, user: true },
      orderBy:  { createdAt: "desc" },
    }) as Promise<ITicket[]>;
  },

  // ── Obtener por usuario ─────────────────────────────────────
  async getByUser(userId: string): Promise<ITicket[]> {
    return prisma.ticket.findMany({
      where:   { userId },
      include: { tour: true },
      orderBy: { createdAt: "desc" },
    }) as Promise<ITicket[]>;
  },

  // ── Obtener por ID ──────────────────────────────────────────
  async getById(id: string): Promise<ITicket | null> {
    return prisma.ticket.findUnique({
      where:   { id },
      include: { tour: true, user: true },
    }) as Promise<ITicket | null>;
  },

  // ── Cancelar tiquete ────────────────────────────────────────
  // Restaura los cupos del tour al cancelar
  async cancel(id: string): Promise<void> {
    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) throw new Error("Tiquete no encontrado");
    if (ticket.status === TicketStatus.CANCELLED)
      throw new Error("El tiquete ya está cancelado");

    await prisma.$transaction([
      prisma.ticket.update({
        where: { id },
        data:  { status: TicketStatus.CANCELLED },
      }),
      prisma.tour.update({
        where: { id: ticket.tourId },
        data:  { availableSlots: { increment: ticket.quantity } },
      }),
    ]);
  },
};
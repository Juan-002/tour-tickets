//Lógica de negocio tours
import { prisma } from "@/lib/prisma";
import { CreateTourDTO, ITour } from "@/types";
import { TourStatus } from "@prisma/client";

export const tourService = {
  async getAll(): Promise<ITour[]> {
    return prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getAvailable(): Promise<ITour[]> {
    return prisma.tour.findMany({
      where: { status: TourStatus.ACTIVE, availableSlots: { gt: 0 } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string): Promise<ITour | null> {
    return prisma.tour.findUnique({ where: { id } });
  },

  async create(data: CreateTourDTO): Promise<ITour> {
    return prisma.tour.create({
      data: {
        ...data,
        availableSlots: data.totalSlots,
        status: TourStatus.ACTIVE,
      },
    });
  },

  async update(id: string, data: Partial<CreateTourDTO>): Promise<ITour> {
    return prisma.tour.update({ where: { id }, data });
  },

  async delete(id: string): Promise<void> {
    await prisma.tour.delete({ where: { id } });
  },

  async decrementSlots(id: string, quantity: number): Promise<ITour> {
    const tour = await prisma.tour.update({
      where: { id },
      data: { availableSlots: { decrement: quantity } },
    });

    // Si se agotan los cupos, marcar como SOLDOUT
    if (tour.availableSlots <= 0) {
      return prisma.tour.update({
        where: { id },
        data: { status: TourStatus.SOLDOUT },
      });
    }

    return tour;
  },
};
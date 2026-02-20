import { prisma } from "@/lib/prisma";
import { CreateTourDTO, ITour } from "@/types";
import { TourStatus } from "@prisma/client";

export const tourService = {
  async getAll(): Promise<ITour[]> {
    return prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
    }) as unknown as Promise<ITour[]>;
  },

  async getAvailable(): Promise<ITour[]> {
    return prisma.tour.findMany({
      where: { status: TourStatus.ACTIVE, availableSlots: { gt: 0 } },
      orderBy: { createdAt: "desc" },
    }) as unknown as Promise<ITour[]>;
  },

  async getById(id: string): Promise<ITour | null> {
    return prisma.tour.findUnique({
      where: { id },
    }) as unknown as Promise<ITour | null>;
  },

  async create(data: CreateTourDTO): Promise<ITour> {
    return prisma.tour.create({
      data: {
        ...data,
        availableSlots: data.totalSlots,
        status: TourStatus.ACTIVE,
      },
    }) as unknown as Promise<ITour>;
  },

  async update(id: string, data: Partial<CreateTourDTO>): Promise<ITour> {
    return prisma.tour.update({
      where: { id }, data,
    }) as unknown as Promise<ITour>;
  },

  async delete(id: string): Promise<void> {
    await prisma.tour.delete({ where: { id } });
  },

  async decrementSlots(id: string, quantity: number): Promise<ITour> {
    const tour = await prisma.tour.update({
      where: { id },
      data: { availableSlots: { decrement: quantity } },
    });

    if (tour.availableSlots <= 0) {
      return prisma.tour.update({
        where: { id },
        data: { status: TourStatus.SOLDOUT },
      }) as unknown as Promise<ITour>;
    }

    return tour as unknown as ITour;
  },
};
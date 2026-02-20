//Interfaces y Enums
import { Role, TourStatus, TicketStatus } from "@prisma/client";

// Re-exportamos enums de Prisma para uso global
export { Role, TourStatus, TicketStatus };

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface ITour {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  availableSlots: number;
  totalSlots: number;
  location: string;
  duration: string;
  status: TourStatus;
  createdAt: Date;
}

export interface ITicket {
  id: string;
  userId: string;
  tourId: string;
  quantity: number;
  totalPrice: number;
  status: TicketStatus;
  tour?: ITour;
  user?: IUser;
  createdAt: Date;
}

// DTOs para formularios
export interface CreateTourDTO {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  totalSlots: number;
  location: string;
  duration: string;
}

export interface CreateTicketDTO {
  tourId: string;
  userId: string;
  quantity: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
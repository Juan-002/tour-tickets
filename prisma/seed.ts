import { PrismaClient, TourStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Iniciando seed...");

  // Limpiar datos existentes
  await prisma.ticket.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();

  // ── Usuarios ──────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name:     "Admin TourTix",
      email:    "admin@tourtix.co",
      password: "admin123", // En producción usar bcrypt
      role:     "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name:     "Juan García",
      email:    "juan@example.com",
      password: "password123",
      role:     "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name:     "María López",
      email:    "maria@example.com",
      password: "password123",
      role:     "USER",
    },
  });

  console.log(" Usuarios creados");

  // ── Tours ─────────────────────────────────────────────────
  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        title:          "Ciudad Perdida — Teyuna",
        description:    "Adéntrate en el corazón de la Sierra Nevada de Santa Marta para descubrir la Ciudad Perdida, un sitio arqueológico construido hace más de 1.300 años. Caminarás por senderos de selva tropical, cruzarás ríos y conocerás las comunidades indígenas kogui que habitan esta región sagrada.",
        price:          1200000,
        imageUrl:       "https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?w=800",
        totalSlots:     16,
        availableSlots: 16,
        location:       "Santa Marta, Colombia",
        duration:       "4 días / 3 noches",
        status:         TourStatus.ACTIVE,
      },
    }),

    prisma.tour.create({
      data: {
        title:          "Caño Cristales — El Río de los Cinco Colores",
        description:    "Conoce el río más hermoso del mundo, declarado patrimonio natural de Colombia. Durante los meses de julio a noviembre, sus aguas se tiñen de rojo, amarillo, verde, azul y negro gracias a la planta acuática Macarenia clavigera. Una experiencia única e irrepetible en la Serranía de la Macarena.",
        price:          950000,
        imageUrl:       "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
        totalSlots:     12,
        availableSlots: 12,
        location:       "La Macarena, Meta",
        duration:       "3 días / 2 noches",
        status:         TourStatus.ACTIVE,
      },
    }),

    prisma.tour.create({
      data: {
        title:          "Desierto de la Tatacoa",
        description:    "Explora el segundo desierto más grande de Colombia, un paisaje de otro mundo con tonos ocres y grises que cambian con la luz del día. Observa estrellas desde uno de los mejores puntos de astronomía de América Latina, visita los pozos naturales y camina entre cactus y formaciones rocosas milenarias.",
        price:          420000,
        imageUrl:       "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
        totalSlots:     20,
        availableSlots: 20,
        location:       "Villavieja, Huila",
        duration:       "2 días / 1 noche",
        status:         TourStatus.ACTIVE,
      },
    }),

    prisma.tour.create({
      data: {
        title:          "Cartagena Colonial y Playas",
        description:    "Recorre el centro histórico de Cartagena de Indias, declarado Patrimonio de la Humanidad por la UNESCO. Visita sus coloridas calles, imponentes murallas y casonas coloniales. Completa la experiencia con un día en las Islas del Rosario, con snorkel en aguas cristalinas del Caribe.",
        price:          680000,
        imageUrl:       "https://images.unsplash.com/photo-1583682139868-1da0181cf052?w=800",
        totalSlots:     25,
        availableSlots: 3,
        location:       "Cartagena, Bolívar",
        duration:       "3 días / 2 noches",
        status:         TourStatus.ACTIVE,
      },
    }),

    prisma.tour.create({
      data: {
        title:          "Eje Cafetero — Corazón del Café",
        description:    "Sumérgete en la cultura cafetera colombiana, declarada Patrimonio Cultural Inmaterial de la Humanidad. Visita haciendas cafeteras tradicionales, aprende el proceso completo del café desde la mata hasta la taza, recorre los pueblos pintorescos del Quindío y sube al Valle del Cocora entre palmas de cera.",
        price:          780000,
        imageUrl:       "https://images.unsplash.com/photo-1504194921103-f8b80cadd5e4?w=800",
        totalSlots:     18,
        availableSlots: 0,
        location:       "Armenia, Quindío",
        duration:       "3 días / 2 noches",
        status:         TourStatus.SOLDOUT,
      },
    }),

    prisma.tour.create({
      data: {
        title:          "Amazonas — Selva Profunda",
        description:    "Una expedición al corazón de la Amazonia colombiana desde Leticia. Navega el río Amazonas, visita comunidades indígenas tikuna, avista delfines rosados, peces payara y la inigualable biodiversidad de la selva. Una aventura que cambiará tu perspectiva del mundo natural.",
        price:          1850000,
        imageUrl:       "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
        totalSlots:     10,
        availableSlots: 10,
        location:       "Leticia, Amazonas",
        duration:       "5 días / 4 noches",
        status:         TourStatus.ACTIVE,
      },
    }),
  ]);

  console.log(` ${tours.length} tours creados`);

  // ── Tickets de prueba ─────────────────────────────────────
  await prisma.ticket.create({
    data: {
      userId:     user1.id,
      tourId:     tours[0].id, // Ciudad Perdida
      quantity:   2,
      totalPrice: tours[0].price * 2,
      status:     "CONFIRMED",
    },
  });

  await prisma.ticket.create({
    data: {
      userId:     user1.id,
      tourId:     tours[2].id, // Tatacoa
      quantity:   1,
      totalPrice: tours[2].price * 1,
      status:     "CONFIRMED",
    },
  });

  await prisma.ticket.create({
    data: {
      userId:     user2.id,
      tourId:     tours[1].id, // Caño Cristales
      quantity:   3,
      totalPrice: tours[1].price * 3,
      status:     "CONFIRMED",
    },
  });

  await prisma.ticket.create({
    data: {
      userId:     user2.id,
      tourId:     tours[3].id, // Cartagena
      quantity:   2,
      totalPrice: tours[3].price * 2,
      status:     "PENDING",
    },
  });

  // Actualizar cupos del tour de Cartagena (ya vendimos 2)
  await prisma.tour.update({
    where: { id: tours[3].id },
    data:  { availableSlots: 3 },
  });

  console.log(" Tickets de prueba creados");
  console.log("\n Seed completado exitosamente");
  console.log("\n Resumen:");
  console.log(` Usuarios: 3 (1 admin, 2 usuarios)`);
  console.log(`Tours:    ${tours.length} (5 activos, 1 agotado)`);
  console.log(`Tickets:  4 de prueba`);
  console.log("\n Credenciales admin:");
  console.log(`   Email:    admin@tourtix.co`);
  console.log(`   Password: admin123`);
}

main()
  .catch((e) => {
    console.error(" Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from "@prisma/client";

declare global {
  // This prevents TypeScript from complaining about `global.prisma`
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

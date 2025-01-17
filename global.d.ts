import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient; // Declare a global variable for PrismaClient
}

export {};

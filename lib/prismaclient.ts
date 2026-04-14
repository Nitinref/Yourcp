import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaClientSingleton: PrismaClient | undefined;
}

export const prismaClient =
  global.prismaClientSingleton ??
  new PrismaClient({
    log: ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaClientSingleton = prismaClient;
}

export default prismaClient;

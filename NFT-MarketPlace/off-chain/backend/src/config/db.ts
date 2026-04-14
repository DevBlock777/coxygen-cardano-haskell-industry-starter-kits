import { PrismaClient, TransactionType } from "../generated/prisma/client.js"
import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
 port: Number(process.env.DATABASE_PORT),
  // connectionLimit: 5,
});
// console.log({adapter,host:process.env.DATABASE_HOST});

const prisma = new PrismaClient({ adapter });

export default prisma
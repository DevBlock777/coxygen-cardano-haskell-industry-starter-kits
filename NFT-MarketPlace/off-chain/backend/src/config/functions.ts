
// const prisma = new PrismaClient();


import { TransactionType } from "../generated/prisma/enums.js";
import prisma from "./db.js";

export async function addTx(address: string, txHash: string, txType: TransactionType ){
// Create a user with a post
const tx = await prisma.transaction.create({
  data: {
    address,
    txHash,
    txType
  },
});

if(tx) return true 
return false
}
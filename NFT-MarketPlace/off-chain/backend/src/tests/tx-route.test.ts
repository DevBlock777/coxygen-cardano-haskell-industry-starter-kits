import request from "supertest";
import app from "../app.js";
import { expect } from "chai";
import crypto from "crypto"
import prisma from "../config/db.js";
import { TransactionType } from "../generated/prisma/enums.js";

after(async () => {
await prisma.$disconnect()
})

describe("Post /tx", () => {
  it ("throw an error if address, txHash or txType is missing", async () => {
    await request(app)
    .post("/tx")
    .send({})
    .expect(400,{
        error : "address, txHash and txType are required"
    })
})

it ("throw an error if txType is invalid", async () => {
    await request(app)
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash : "txHash",
        txType : "someValue" // Invalid transaction type
    })
    .expect(400,{
        error : "Invalid transaction type"
    })
    })

it("successfully adds a MINT transaction to the database", async () => {
    const txData = "txHash"
    const txHash = crypto.createHash("sha256").update(txData).digest("hex")
    console.log({txHash});
    const txType: TransactionType = "MINT"
    
    const response = await request(app)
    
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash,
        txType
    })
    .expect(200)
    expect(response.body).to.have.property("result")
})

it("successfully adds a SELL transaction to the database", async () => {
    const txData = "txHash"
    const txHash = crypto.createHash("sha256").update(txData).digest("hex")
    console.log({txHash});
    const txType: TransactionType = "SELL"
    
    const response = await request(app)
    
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash,
        txType
    })
    .expect(200)
    expect(response.body).to.have.property("result")
})

it("successfully adds a BUY transaction to the database", async () => {
    const txData = "txHash"
    const txHash = crypto.createHash("sha256").update(txData).digest("hex")
    console.log({txHash});
    const txType: TransactionType = "BUY"
    
    const response = await request(app)
    
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash,
        txType
    })
    .expect(200)
    expect(response.body).to.have.property("result")
})

it("successfully adds a UPDATE transaction to the database", async () => {
    const txData = "txHash"
    const txHash = crypto.createHash("sha256").update(txData).digest("hex")
    console.log({txHash});
    const txType: TransactionType = "UPDATE"
    
    const response = await request(app)
    
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash,
        txType
    })
    .expect(200)
    expect(response.body).to.have.property("result")
})

it("successfully adds a CANCEL transaction to the database", async () => {
    const txData = "txHash"
    const txHash = crypto.createHash("sha256").update(txData).digest("hex")
    console.log({txHash});
    const txType: TransactionType = "CANCEL"
    
    const response = await request(app)
    
    .post("/tx")
    .send({
        address : "addr_test1qqqg5l6k8m9s5v5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z5u5z",
        txHash,
        txType
    })
    .expect(200)
    expect(response.body).to.have.property("result")
})
})

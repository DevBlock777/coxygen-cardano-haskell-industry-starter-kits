import request from "supertest";
import app from "../app.js";
import { expect } from "chai";
import path from "node:path";

describe("Post /upload", () => {
  it("throws an error if there is no file", async () => {
     await request(app)
    .post("/upload")
    .send({})
    .expect(400,{
      error : "File is required"
    })
  });

  it(`successfully uploads a file to ipfs thanks to 
    lighthouse and returns the cid`, async () => {

    const response = await request(app)
    .post("/upload")
    .attach( "file", path.join(__dirname,"file.txt") )
    .expect(200)
    expect (response.body).to.have.property("cid")
       
  })
});

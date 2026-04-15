import { Router,Request,Response } from "express";
import "dotenv/config"
import lighthouse from '@lighthouse-web3/sdk'
import multer from "multer"
import { addTx } from "../config/functions.js";
const router = Router()

const upload = multer({ dest: "uploads/" })
const VITE_LIGHTHOUSE_API_KEY = process.env.VITE_LIGHTHOUSE_API_KEY!

router.post("/upload", upload.single('file'), async (req: Request, res: Response) => {

    const filePath = req?.file?.path
    
    if(!filePath) return res.status(400).json({
      error : "File is required"
    })

    // Push file to lighthouse node
    // Both file and folder are supported by upload function
    // Third parameter is for multiple files, if multiple files are to be uploaded at once make it true
    // Fourth parameter is the deal parameters, default null
    const cidVersion = 0
    const output = await lighthouse.upload(filePath, VITE_LIGHTHOUSE_API_KEY, cidVersion)
    console.log('File Status:', output)
    /*
      output:
        data: {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    console.log('Visit at https://gateway.lighthouse.storage/ipfs/' + output.data.Hash)
    res.status(200).json({
        cid: output.data.Hash
    })
})

router.post("/tx",async (req: Request,res: Response)=>{
      const {address ,txHash,txType} = req.body
      console.log({address,txHash,txType});

      if(!address || !txHash || !txType)
        return res.status(400).json({
      error : "address, txHash and txType are required"})
      
      const result = await addTx(address,txHash,txType)
      res.status(200).json({
        result
      })
})

export default router
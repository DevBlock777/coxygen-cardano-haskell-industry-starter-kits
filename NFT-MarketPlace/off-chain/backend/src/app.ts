import express,{json} from "express"
import "dotenv/config"
import router from "./router/index.js";
import cors from "cors"

const app = express()
const FRONTEND_URL = process.env.FRONTEND_URL!

app.use(json())
app.use(cors({
    origin: `${FRONTEND_URL}`
}))


app.use(router)
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
export default app

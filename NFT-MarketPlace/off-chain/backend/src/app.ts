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

export default app

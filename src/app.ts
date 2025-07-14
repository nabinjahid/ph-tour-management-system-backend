import express, { Request, Response } from "express"
import cors from "cors"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/midlewares/globalErrorHandler"
import notFound from "./app/midlewares/notFound"

const app = express()
app.use(express.json())
app.use(cors())


// User routes
app.use("/api/v1", router)

app.get("/", (req:Request, res:Response)=>{
    res.status(200).json({
        message: "Welcome to Tour Management Server"
    })
})


// Global error handler
app.use(globalErrorHandler)

// Not found route
app.use(notFound)

export default app
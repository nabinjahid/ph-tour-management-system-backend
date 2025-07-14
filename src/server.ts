/* eslint-disable no-console */
import {Server} from "http"
import mongoose from "mongoose"
import app from "./app"
import { envVars } from "./app/config/env"
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin"

let server:Server

const startServer = async()=>{
    try {
       
        await mongoose.connect(envVars.DB_URL)

        console.log("connected to DB");
        
        server = app.listen(5000, ()=>{
            console.log('Server is listening to port 5000');
            
        })

    } catch (error) {
        console.log(error);
        
    }
}

// Server starts here
(async()=>{
    await startServer()
    await seedSuperAdmin()
})()

// Sigterm --> signal terminate
process.on("SIGTERM", ()=>{
    console.log("Sigterm signal recived --- Server shutting down");
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGINT", ()=>{
    console.log("Sigint signal recived --- Server shutting down");
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})


// Unhandlerd rejection error handle
process.on("unhandledRejection", (error)=>{
    console.log("unhandledRejection detected --- Server shutting down", error);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
    
})
// Uncaught exception error handle
process.on("uncaughtException", (error)=>{
    console.log("Uncaught excepton error deceted --- Server shutting down", error);
    if (server) {
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})


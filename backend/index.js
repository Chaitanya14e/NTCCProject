import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})
import { connectDB } from "./db/db.js"
import { app } from "./app.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running at ${process.env.PORT}`);        
    })
})
.catch(()=>{
    console.log("Error connecting MONGODB");
})
import dotenv from "dotenv";
import app from './app.js'
import connectDB from "./db/databaseConnect.js"

dotenv.config({
    path:"./.env",
});

let port = process.env.PORT || 3000;




connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`App running on port http://localhost${port}/`);
    });
})
.catch((err) => {
    console.error("MongoDB connection error",err);
    process.exit(1);
})
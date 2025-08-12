import dotenv from "dotenv";
import app from './app.js'

dotenv.config({
    path:"./.env",
});

let port = process.env.PORT || 3000;



app.listen(port, () =>{
    console.log("Server listening at port",port);
    
})
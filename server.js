import app from "./app.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); //gaining access to the .env file

const { DB_HOST } = process.env 
console.log(DB_HOST)

mongoose //connects mongodb to vscode
  .connect(DB_HOST)
  .then(() => {

    app.listen(3000, () => {
      console.log("Server is running. Use our API on port: 3000");
    });

    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1); //this terminates the mongoose connection
  });



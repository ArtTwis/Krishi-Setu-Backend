import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import server from "./server.js";

dotenv.config();

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`\nServer is listening on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`\nMongoDB connection failed !!`, error);
  });

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

import { cleanupExpired } from './utils/cleanup.js';

const PORT = process.env.PORT || 3000;

connectDB();

const cleanupInventory=async()=>{
    setInterval(async () => {
    try {
      await cleanupExpired();
      console.log("Expired reservations cleaned up");
    } catch (error) {
      console.error("Cleanup failed:", error.message);
    }
  }, 60 * 1000);
}

cleanupInventory();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
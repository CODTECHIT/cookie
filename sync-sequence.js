import "dotenv/config";
import mongoose from "mongoose";
import Order from "./backend/models/Order.js";
import SiteSetting from "./backend/models/SiteSetting.js";

async function sync() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'daksha_food_db' });
  console.log("Connected to DB: daksha_food_db");

  const lastOrder = await Order.findOne({}, { orderNumber: 1 }).sort({ createdAt: -1 });
  console.log("Last Order found in DB:", lastOrder);

  let maxSeq = 0;
  if (lastOrder && lastOrder.orderNumber) {
    const parts = lastOrder.orderNumber.split("-");
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) maxSeq = lastSeq;
  }

  console.log("Setting sequence to:", maxSeq);

  await SiteSetting.findOneAndUpdate(
    {},
    { orderSequence: maxSeq },
    { upsert: true }
  );

  console.log("Sync complete!");
  process.exit(0);
}

sync();

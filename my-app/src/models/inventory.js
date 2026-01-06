import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    sku:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;

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

inventorySchema.pre('save',function(next){
    if(this.reservedStock > this.totalStock){
        return next(new Error("Reserved stock cannot exceed total stock"));
    }
    next();
})


const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;

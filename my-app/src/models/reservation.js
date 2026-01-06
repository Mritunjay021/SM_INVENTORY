import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    userId: {
      type: String
    },

    sku: {
      type: String,
      required: true,
      index: true
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CONFIRMED", "CANCELLED", "EXPIRED"],
      default: "ACTIVE"
    },

    expiresAt: {
      type: Date,
      required: true
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;

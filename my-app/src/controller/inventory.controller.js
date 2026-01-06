import {v4 as uuidv4} from 'uuid';
import Reservation from '../models/reservation.js';
import Inventory from '../models/inventory.js';
import { cleanupExpired } from '../utils/cleanup.js';

export const reserveInventory = async (req, res) => {
  try {
    let { sku, quantity = 1, userId, idempotencyKey } = req.body;

    quantity = Number(quantity);
    if (!sku || Number.isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid sku or quantity"
      });
    }

    await cleanupExpired();

    if (idempotencyKey) {
      const existingReservation = await Reservation.findOne({ idempotencyKey });
      if (existingReservation) {
        return res.status(200).json({
          success: true,
          reservationId: existingReservation.reservationId,
          expiresAt: existingReservation.expiresAt,
          message: "Idempotent request – existing reservation returned"
        });
      }
    }

    const inventory = await Inventory.findOneAndUpdate(
      {
        sku,
        $expr: {
          $lte: [
            { $add: ["$reservedStock", quantity] },
            "$totalStock"
          ]
        }
      },
      {
        $inc: { reservedStock: quantity }
      },
      {
        new: true
      }
    );

    if (!inventory) {
      return res.status(409).json({
        success: false,
        message: "Out of stock"
      });
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const reservation = await Reservation.create({
      reservationId: uuidv4(),
      userId,
      sku,
      quantity,
      status: "ACTIVE",
      expiresAt,
      idempotencyKey
    });

    return res.json({
      success: true,
      reservationId: reservation.reservationId,
      expiresAt,
      remainingStock: inventory.totalStock - inventory.reservedStock
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getinventoryBysku = async(re,res)=>{
    const {sku} = req.params;

    try{
        const inventory = await Inventory.findOne({sku});

        if(!inventory){
            return res.status(404).json({
                success:false,
                message:"Inventory item not found"
            })
        }

        return res.json({
        success: true,
        sku: inventory.sku,
        totalStock: inventory.totalStock,
        reservedStock: inventory.reservedStock,
        availableStock: inventory.totalStock - inventory.reservedStock
        });
    }
    catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


export const seedInventory = async (req, res) => {
    console.log(req.body);
  const { sku, totalStock } = req.body;

  try {
    const existing = await Inventory.findOne({ sku });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists"
      });
    }

    const inventory = await Inventory.create({
      sku,
      totalStock,
      reservedStock: 0
    });

    res.json({
      success: true,
      inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
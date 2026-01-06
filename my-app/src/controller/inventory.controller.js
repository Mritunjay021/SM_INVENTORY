import {v4 as uuidv4} from 'uuid';
import Reservation from '../models/reservation.js';
import Inventory from '../models/inventory.js';
import { cleanupExpired } from '../utils/cleanup.js';

export const reserveInventory = async (req, res) => {
    const { sku, quantity=1,userId,idempotencyKey } = req.body;

    try{
        await cleanupExpired();

        if(idempotencyKey){
            const existingReservation = await Reservation.findOne({idempotencyKey});
            if(existingReservation){
                return res.status(200).json({
                    success: true,
                    reservationId: existingReservation.reservationId,
                    expiresAt: existingReservation.expiresAt,
                    message: "Idempotent request – existing reservation returned"});
            }
        }

        const inventory =  await Inventory.findOneandUpdate(
                {sku,reservedStock:{$lte:"totalStock"-quantity} },
                {$inc  :{reservedStock:quantity}},
                {new:true}
            )

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
    }
    catch(error){
            return res.status(500).json({
        success: false,
        message: error.message
        });
    }
}
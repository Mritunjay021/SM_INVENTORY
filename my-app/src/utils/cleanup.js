import Reservation from "../models/reservation";
import Inventory from "../models/inventory";

export const cleanupExpired = async ()=>{
    const now = new Date();

    const expiredReserves = await Reservation.find({
        status:"ACTIVE",
        expiresAt: { $lt: now }
    })

    for(const reserve of expiredReserves){
        await Inventory.updateOne(
            {sku:reserve.sku},
            {$inc:{reservedStock:-reserve.quantity}}
        );

        reserve.status="EXPIRED";
        await reserve.save();
    }
}
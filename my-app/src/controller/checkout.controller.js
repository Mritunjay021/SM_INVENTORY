import Inventory from "../models/inventory";
import Reservation from "../models/reservation";

export const confirmcheckout = async(req,res)=>{
    const {reservationid} = req.body;

    try{
        const reservation = await Reservation.findOne({ reservationId });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    if (reservation.status === "CONFIRMED") {
      return res.json({
        success: true,
        message: "Checkout already confirmed"
      });
    }

    if (reservation.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm reservation in ${reservation.status} state`
      });
    }

    reservation.status = "CONFIRMED";
    await reservation.save();

    return res.json({
      success: true,
      message: "Checkout confirmed successfully"
    
    });
}    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cancelcheckout = async(req,res)=>{
    const  {reservationid} = req.body;

    try{
        const reservation = await Reservation.findOne({reservationId});

        if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    if (reservation.status === "CANCELLED") {
      return res.json({
        success: true,
        message: "Reservation already cancelled"
      });
    }

    if (reservation.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel reservation in ${reservation.status} state`
      });
    }

    await Inventory.updateOne(
      { sku: reservation.sku },
      { $inc: { reservedStock: -reservation.quantity } }
    );

    reservation.status = "CANCELLED";
    await reservation.save();

    return res.json({
      success: true,
      message: "Checkout cancelled and inventory released"
    });
    }catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
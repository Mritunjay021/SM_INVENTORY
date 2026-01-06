import express from "express";

import { reserveInventory,getinventoryBysku,seedInventory } from "../controller/inventory.controller.js";

const router = express.Router();

router.post('/reserve',reserveInventory);
router.get('/:sku',getinventoryBysku);
router.post('/seed',seedInventory);

export default router;
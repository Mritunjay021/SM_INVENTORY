import express from 'express';
import { confirmcheckout,cancelcheckout,getActiveCart } from '../controller/checkout.controller.js';

const router = express.Router();

router.post('/confirm',confirmcheckout);
router.post('/cancel',cancelcheckout);
router.post('/cart',getActiveCart);

export default router;
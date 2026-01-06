import express from 'express';
import inventoryRouter from './routes/inventory.routes.js';
import checkoutRouter from './routes/checkout.routes.js';

const app = express();

app.use(express.json());

app.use('/inventory',inventoryRouter);
app.use('/checkout',checkoutRouter);

export default app;
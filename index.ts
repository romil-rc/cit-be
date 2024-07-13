import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./db";
import MainRoutes from "./routes/main.routes";
import { json, raw } from 'body-parser';
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectToDB().then().catch();
app.use(cors());

const endpointSecret = 'whsec_1dde297d2c60fb082f9c4da0fddb59e3888a6470296bc2347960ebb6d4439791';

// Middleware for JSON bodies for all other routes
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);

app.post(
  '/webhook',
  // Stripe requires the raw body to construct the event
  express.raw({type: 'application/json'}),
  (req: express.Request, res: express.Response): void => {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);

    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent: ${JSON.stringify(stripeObject)}`);
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  }
);

app.use(express.json());

app.use(MainRoutes.routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
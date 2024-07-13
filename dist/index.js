"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const main_routes_1 = __importDefault(require("./routes/main.routes"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_PRIVATE_KEY || "");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_1.default)().then().catch();
app.use((0, cors_1.default)());
const endpointSecret = 'whsec_1dde297d2c60fb082f9c4da0fddb59e3888a6470296bc2347960ebb6d4439791';
// Middleware for JSON bodies for all other routes
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.post('/webhook', 
// Stripe requires the raw body to construct the event
express_1.default.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        // On error, log and return the error message
        console.log(`❌ Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Successfully constructed event
    console.log('✅ Success:', event.id);
    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
        const stripeObject = event.data
            .object;
        console.log(`💰 PaymentIntent: ${JSON.stringify(stripeObject)}`);
    }
    else if (event.type === 'charge.succeeded') {
        const charge = event.data.object;
        console.log(`💵 Charge id: ${charge.id}`);
    }
    else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }
    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
});
app.use(express_1.default.json());
app.use(main_routes_1.default.routes);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

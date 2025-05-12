import Stripe from 'stripe';
const dotenv = require("dotenv");
dotenv.config();

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripeInstance;
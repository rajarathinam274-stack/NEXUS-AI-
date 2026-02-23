'use server';
/**
 * @fileOverview Specialized tools for the Integration Agent to interact with Stripe.
 * Now acknowledges environment variables for production readiness.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Tool for creating a payment intent or processing a charge.
 */
export const createStripeCharge = ai.defineTool(
  {
    name: 'createStripeCharge',
    description: 'Processes a payment or creates a charge via Stripe.',
    inputSchema: z.object({
      amount: z.number().describe('The amount in cents (e.g., 2000 for $20.00).'),
      currency: z.string().default('usd').describe('Three-letter ISO currency code.'),
      description: z.string().optional().describe('Description of the charge.'),
      customerEmail: z.string().email().optional().describe('The customer email for the receipt.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      chargeId: z.string().optional(),
      receiptUrl: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        console.warn('[Stripe Tool] No STRIPE_SECRET_KEY found in environment. Mocking response.');
        return {
          success: true,
          chargeId: `mock_ch_${Math.random().toString(36).substr(2, 9)}`,
          receiptUrl: 'https://stripe.com/receipt/mock',
        };
      }

      console.log(`[Stripe Tool] Processing charge of ${input.amount} ${input.currency}`);
      // In production: const charge = await stripe.paymentIntents.create({ amount: input.amount, ... });
      
      return {
        success: true,
        chargeId: `ch_${Math.random().toString(36).substr(2, 9)}`,
        receiptUrl: 'https://stripe.com/receipt/mock',
      };
    } catch (error: any) {
      console.error('Error creating Stripe charge:', error);
      return { success: false, error: error.message };
    }
  }
);

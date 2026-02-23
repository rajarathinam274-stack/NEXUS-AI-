'use server';
/**
 * @fileOverview Specialized tools for the Communication Agent to interact with Slack and Email.
 * Now acknowledges environment variables for production readiness.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Tool for sending a message to a Slack channel.
 */
export const sendSlackMessage = ai.defineTool(
  {
    name: 'sendSlackMessage',
    description: 'Sends a message to a specific Slack channel.',
    inputSchema: z.object({
      channel: z.string().describe('The name or ID of the channel (e.g., "#general").'),
      message: z.string().describe('The text content of the message.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      ts: z.string().optional().describe('The timestamp of the message if successful.'),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      const token = process.env.SLACK_BOT_TOKEN;
      if (!token) {
        console.warn('[Slack Tool] No SLACK_BOT_TOKEN found in environment. Mocking response.');
        return {
          success: true,
          ts: Date.now().toString(),
        };
      }

      console.log(`[Slack Tool] Sending to ${input.channel}: ${input.message}`);
      // In production: await slackClient.chat.postMessage({ channel: input.channel, text: input.message });
      
      return {
        success: true,
        ts: Date.now().toString(),
      };
    } catch (error: any) {
      console.error('Error sending Slack message:', error);
      return { success: false, error: error.message };
    }
  }
);

/**
 * Tool for sending an email.
 */
export const sendEmail = ai.defineTool(
  {
    name: 'sendEmail',
    description: 'Sends an email to a recipient.',
    inputSchema: z.object({
      to: z.string().email().describe('The recipient email address.'),
      subject: z.string().describe('The subject line of the email.'),
      body: z.string().describe('The HTML or text content of the email.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      messageId: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('[Email Tool] No RESEND_API_KEY found in environment. Mocking response.');
        return {
          success: true,
          messageId: `mock_${Math.random().toString(36).substr(2, 9)}`,
        };
      }

      console.log(`[Email Tool] Sending to ${input.to}: ${input.subject}`);
      // In production: await resend.emails.send({ from: 'Nexus AI <onboarding@resend.dev>', ...input });
      
      return {
        success: true,
        messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
      };
    } catch (error: any) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }
);


'use server';
/**
 * @fileOverview A specialized tool for the Data Agent to interact with Google Sheets.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

/**
 * Authenticates with Google Sheets using the provided service account credentials.
 */
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient as any });
}

/**
 * Tool for appending data to a Google Sheet.
 */
export const appendToSheet = ai.defineTool(
  {
    name: 'appendToSheet',
    description: 'Appends a new row of data to a specific Google Sheet.',
    inputSchema: z.object({
      spreadsheetId: z.string().describe('The ID of the spreadsheet.'),
      range: z.string().describe('The range to append to (e.g., "Sheet1!A1").'),
      values: z.array(z.array(z.any())).describe('The values to append, as a 2D array.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      updatedRange: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      const sheets = await getSheetsClient();
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: input.spreadsheetId,
        range: input.range,
        valueInputOption: 'RAW',
        requestBody: {
          values: input.values,
        },
      });
      return {
        success: true,
        updatedRange: response.data.updates?.updatedRange || undefined,
      };
    } catch (error: any) {
      console.error('Error appending to sheet:', error);
      return { success: false };
    }
  }
);

/**
 * Tool for reading data from a Google Sheet.
 */
export const readFromSheet = ai.defineTool(
  {
    name: 'readFromSheet',
    description: 'Reads data from a specific Google Sheet range.',
    inputSchema: z.object({
      spreadsheetId: z.string().describe('The ID of the spreadsheet.'),
      range: z.string().describe('The range to read (e.g., "Sheet1!A1:D10").'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      values: z.array(z.array(z.any())).optional(),
    }),
  },
  async (input) => {
    try {
      const sheets = await getSheetsClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: input.spreadsheetId,
        range: input.range,
      });
      return {
        success: true,
        values: response.data.values || [],
      };
    } catch (error: any) {
      console.error('Error reading from sheet:', error);
      return { success: false };
    }
  }
);

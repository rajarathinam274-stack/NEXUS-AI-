
'use server';
/**
 * @fileOverview A specialized tool for the Data Agent to interact with Google Drive.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

async function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.file'],
  });
  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient as any });
}

export const listDriveFiles = ai.defineTool(
  {
    name: 'listDriveFiles',
    description: 'Lists files in a specific Google Drive folder or the root directory.',
    inputSchema: z.object({
      folderId: z.string().optional().describe('Optional ID of the folder to list files from.'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      files: z.array(z.object({
        id: z.string(),
        name: z.string(),
        mimeType: z.string(),
      })).optional(),
    }),
  },
  async (input) => {
    try {
      const drive = await getDriveClient();
      const response = await drive.files.list({
        q: input.folderId ? `'${input.folderId}' in parents` : undefined,
        fields: 'files(id, name, mimeType)',
      });
      return {
        success: true,
        files: response.data.files as any || [],
      };
    } catch (error) {
      console.error('Error listing Drive files:', error);
      return { success: false };
    }
  }
);

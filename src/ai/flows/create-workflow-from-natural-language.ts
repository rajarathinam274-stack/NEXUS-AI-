
'use server';
/**
 * @fileOverview This file implements a Genkit flow for creating a step-by-step workflow plan
 * from a natural language description, utilizing specialized agents.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {appendToSheet, readFromSheet} from '@/ai/tools/google-sheets-tool';
import {listDriveFiles} from '@/ai/tools/google-drive-tool';
import {sendSlackMessage, sendEmail} from '@/ai/tools/communication-tool';
import {createStripeCharge} from '@/ai/tools/stripe-tool';

// Input schema
const CreateWorkflowFromNaturalLanguageInputSchema = z.object({
  workflowDescription: z
    .string()
    .describe('A natural language description of the business workflow.'),
});
export type CreateWorkflowFromNaturalLanguageInput = z.infer<
  typeof CreateWorkflowFromNaturalLanguageInputSchema
>;

// Output schema
const CreateWorkflowFromNaturalLanguageOutputSchema = z.object({
  workflowName: z.string().describe('A concise, descriptive name for the workflow.'),
  workflowSteps:
    z.array(z.string()).describe('An ordered list of executable steps for the workflow.'),
});
export type CreateWorkflowFromNaturalLanguageOutput = z.infer<
  typeof CreateWorkflowFromNaturalLanguageOutputSchema
>;

/**
 * Defines a prompt to generate a structured workflow plan.
 * The orchestrator now has access to a wide range of specialized tools.
 */
const createWorkflowFromNaturalLanguagePrompt = ai.definePrompt({
  name: 'createWorkflowFromNaturalLanguagePrompt',
  input: {schema: CreateWorkflowFromNaturalLanguageInputSchema},
  output: {schema: CreateWorkflowFromNaturalLanguageOutputSchema},
  tools: [
    appendToSheet, 
    readFromSheet, 
    listDriveFiles, 
    sendSlackMessage, 
    sendEmail, 
    createStripeCharge
  ],
  prompt: `You are the Nexus AI Orchestrator. Your goal is to parse a natural language workflow request and break it down into specialized agent tasks.

Available Tools & Agents:
1. Data Agent: 
   - Tools: appendToSheet, readFromSheet, listDriveFiles.
   - Use for: Spreadsheets, database records, file management.
2. Communication Agent: 
   - Tools: sendSlackMessage, sendEmail.
   - Use for: Notifications, status updates, customer outreach.
3. Integration Agent: 
   - Tools: createStripeCharge.
   - Use for: Payments, financial transactions, external third-party APIs.
4. Analysis Agent: 
   - Use for: Summarization, data extraction, logic checks.

Guidelines:
1. Name the workflow clearly.
2. Provide a logical sequence of steps.
3. If the user mentions "pay", "charge", or "stripe", use the Integration Agent.
4. If the user mentions "slack", "email", or "notify", use the Communication Agent.
5. Each step should be one atomic action.

Workflow Description: {{{workflowDescription}}}
`,
});

const createWorkflowFromNaturalLanguageFlow = ai.defineFlow(
  {
    name: 'createWorkflowFromNaturalLanguageFlow',
    inputSchema: CreateWorkflowFromNaturalLanguageInputSchema,
    outputSchema: CreateWorkflowFromNaturalLanguageOutputSchema,
  },
  async input => {
    const {output} = await createWorkflowFromNaturalLanguagePrompt(input);
    if (!output) {
      throw new Error('Failed to generate workflow plan.');
    }
    return output;
  },
);

export async function createWorkflowFromNaturalLanguage(
  input: CreateWorkflowFromNaturalLanguageInput,
): Promise<CreateWorkflowFromNaturalLanguageOutput> {
  return createWorkflowFromNaturalLanguageFlow(input);
}


'use server';
/**
 * @fileOverview This file implements a Genkit flow for creating a step-by-step workflow plan
 * from a natural language description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {appendToSheet, readFromSheet} from '@/ai/tools/google-sheets-tool';
import {listDriveFiles} from '@/ai/tools/google-drive-tool';

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
 */
const createWorkflowFromNaturalLanguagePrompt = ai.definePrompt({
  name: 'createWorkflowFromNaturalLanguagePrompt',
  input: {schema: CreateWorkflowFromNaturalLanguageInputSchema},
  output: {schema: CreateWorkflowFromNaturalLanguageOutputSchema},
  tools: [appendToSheet, readFromSheet, listDriveFiles],
  prompt: `You are the Nexus AI Orchestrator. Your goal is to parse a natural language workflow request and break it down into specialized agent tasks.

Available Agents:
- Data Agent: Handles reading/writing to Google Sheets and Drive. (Tools: appendToSheet, readFromSheet, listDriveFiles)
- Communication Agent: Handles notifications (Slack, Email).
- Integration Agent: Handles external APIs (Stripe, CRM).
- Analysis Agent: Performs complex data extraction or reasoning.
- Validation Agent: Verifies inputs and results.
- Recovery Agent: Handles errors and retries.

Guidelines:
1. Name the workflow clearly.
2. Provide a logical sequence of steps.
3. If the user mentions "database", "spreadsheet", "sheets", or "drive", identify it as a Data Agent task.
4. Each step should be one atomic action.

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

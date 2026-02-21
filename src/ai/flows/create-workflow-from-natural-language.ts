'use server';
/**
 * @fileOverview This file implements a Genkit flow for creating a step-by-step workflow plan
 * from a natural language description, acting as an intelligent agent to parse user input.
 *
 * - createWorkflowFromNaturalLanguage - The main function to call for generating a workflow plan.
 * - CreateWorkflowFromNaturalLanguageInput - The input type for the workflow creation process.
 * - CreateWorkflowFromNaturalLanguageOutput - The output type representing the generated workflow plan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for creating a workflow from natural language
const CreateWorkflowFromNaturalLanguageInputSchema = z.object({
  workflowDescription: z
    .string()
    .describe('A natural language description of the business workflow.'),
});
export type CreateWorkflowFromNaturalLanguageInput = z.infer<
  typeof CreateWorkflowFromNaturalLanguageInputSchema
>;

// Output schema for the generated workflow plan
const CreateWorkflowFromNaturalLanguageOutputSchema = z.object({
  workflowName: z.string().describe('A concise, descriptive name for the workflow.'),
  workflowSteps:
    z.array(z.string()).describe('An ordered list of executable steps for the workflow.'),
});
export type CreateWorkflowFromNaturalLanguageOutput = z.infer<
  typeof CreateWorkflowFromNaturalLanguageOutputSchema
>;

/**
 * Defines a prompt to generate a structured workflow plan from a natural language description.
 * The prompt acts as an expert workflow automation engineer.
 */
const createWorkflowFromNaturalLanguagePrompt = ai.definePrompt({
  name: 'createWorkflowFromNaturalLanguagePrompt',
  input: {schema: CreateWorkflowFromNaturalLanguageInputSchema},
  output: {schema: CreateWorkflowFromNaturalLanguageOutputSchema},
  prompt: `You are an expert workflow automation engineer specializing in breaking down complex business processes into clear, actionable steps.

Your task is to take a natural language description of a business workflow and convert it into a structured, step-by-step plan.

Follow these rules:
1. Provide a concise, descriptive name for the workflow.
2. Break down the workflow into an ordered list of discrete, executable steps.
3. Each step should be clear, unambiguous, and describe a single action.
4. Ensure the output strictly conforms to the provided JSON schema.

Workflow Description: {{{workflowDescription}}}
`,
});

/**
 * Defines the Genkit flow for generating a workflow plan from a natural language description.
 * This flow uses the 'createWorkflowFromNaturalLanguagePrompt' to process the input.
 */
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

/**
 * Creates an executable, step-by-step workflow plan from a natural language description.
 * This function serves as the public interface for the Genkit flow.
 *
 * @param input - An object containing the natural language workflow description.
 * @returns A promise that resolves to an object containing the workflow name and its steps.
 */
export async function createWorkflowFromNaturalLanguage(
  input: CreateWorkflowFromNaturalLanguageInput,
): Promise<CreateWorkflowFromNaturalLanguageOutput> {
  return createWorkflowFromNaturalLanguageFlow(input);
}

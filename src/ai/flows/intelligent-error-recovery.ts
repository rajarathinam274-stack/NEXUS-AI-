'use server';
/**
 * @fileOverview A Genkit flow for intelligent error recovery in workflow execution.
 *
 * - intelligentErrorRecovery - A function that attempts to recover from workflow execution errors using AI.
 * - IntelligentErrorRecoveryInput - The input type for the intelligentErrorRecovery function.
 * - IntelligentErrorRecoveryOutput - The return type for the intelligentErrorRecovery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentErrorRecoveryInputSchema = z.object({
  workflowId: z.string().describe('The ID of the workflow where the error occurred.'),
  stepId: z.string().describe('The ID of the specific step that failed.'),
  errorMessage: z.string().describe('The detailed error message or description of the failure.'),
  workflowContext: z.string().describe('A JSON string representing relevant context from the workflow state, such as previous step outputs or input parameters.'),
  retryCount: z.number().int().min(0).describe('The number of times this specific error for this step has already been retried.'),
});
export type IntelligentErrorRecoveryInput = z.infer<typeof IntelligentErrorRecoveryInputSchema>;

const IntelligentErrorRecoveryOutputSchema = z.object({
  recoveryAttempted: z.boolean().describe('True if an attempt was made to recover from the error.'),
  recoverySuccessful: z.boolean().describe('True if the AI believes the recovery action will resolve the error. This does not guarantee actual success, only the AI’s prediction.'),
  actionTaken: z.enum(['retry_step', 'adjust_parameters_and_retry', 'escalate_to_human', 'no_action']).describe('The recovery action recommended by the AI. "no_action" implies the AI could not determine a recovery path or deemed it unnecessary.'),
  suggestedParameters: z.string().optional().describe('An optional JSON string of suggested parameters to use if retrying the step, or for an alternative action.'),
  escalationReason: z.string().optional().describe('An optional reason for escalating to a human, provided if "actionTaken" is "escalate_to_human".'),
});
export type IntelligentErrorRecoveryOutput = z.infer<typeof IntelligentErrorRecoveryOutputSchema>;

export async function intelligentErrorRecovery(input: IntelligentErrorRecoveryInput): Promise<IntelligentErrorRecoveryOutput> {
  return intelligentErrorRecoveryFlow(input);
}

const intelligentErrorRecoveryPrompt = ai.definePrompt({
  name: 'intelligentErrorRecoveryPrompt',
  input: { schema: IntelligentErrorRecoveryInputSchema },
  output: { schema: IntelligentErrorRecoveryOutputSchema },
  prompt: `You are an intelligent AI Recovery Agent for an autonomous workflow automation platform called Nexus AI.\nYour task is to analyze workflow execution errors and recommend the best course of action for recovery.\n\nYou will be provided with the workflow ID, the specific step that failed, a detailed error message, the current workflow context (as a JSON string), and the number of previous retry attempts for this error.\n\nBased on the provided information, determine if a recovery action is possible and what it should be.\nConsider the 'retryCount': if it's high, escalating might be more appropriate than further retries.\nIf an error suggests bad input, try to suggest adjusted parameters. If the error is persistent or critical, escalate to a human.\n\nPossible actions:\n- "retry_step": The error seems transient, and retrying the exact same step is likely to succeed.\n- "adjust_parameters_and_retry": The error indicates a problem with input parameters or configuration. Suggest new parameters in 'suggestedParameters' (as a JSON string) and retry.\n- "escalate_to_human": The error is critical, unrecoverable by automation, or requires human judgment. Provide a clear 'escalationReason'.\n- "no_action": No specific recovery action is deemed necessary or possible by the AI, or the error is minor and can be ignored (less common for critical errors).\n\nError Details:\nWorkflow ID: {{{workflowId}}}\nFailed Step ID: {{{stepId}}}\nError Message: {{{errorMessage}}}\nWorkflow Context: {{{workflowContext}}}\nRetry Count: {{{retryCount}}}\n\nYour response must be a JSON object conforming to the IntelligentErrorRecoveryOutputSchema.\nMake sure to set 'recoveryAttempted' to true if you are recommending any action other than 'no_action'.\nSet 'recoverySuccessful' to true if you expect your recommended action to fix the error.\n`
});

const intelligentErrorRecoveryFlow = ai.defineFlow(
  {
    name: 'intelligentErrorRecoveryFlow',
    inputSchema: IntelligentErrorRecoveryInputSchema,
    outputSchema: IntelligentErrorRecoveryOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentErrorRecoveryPrompt(input);
    return output!;
  }
);

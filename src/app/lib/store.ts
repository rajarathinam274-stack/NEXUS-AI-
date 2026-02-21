import { createWorkflowFromNaturalLanguage } from '@/ai/flows/create-workflow-from-natural-language';

export type AgentType = 'orchestrator' | 'data' | 'communication' | 'integration' | 'analysis' | 'validation' | 'recovery';

export interface WorkflowStep {
  id: string;
  name: string;
  agent: AgentType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentStepIndex: number;
  logs: string[];
  startTime?: string;
  endTime?: string;
}

// Initial mock data
const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Customer Onboarding',
    description: 'Onboard customer Sarah from Acme Corp, email sarah@acme.com',
    createdAt: '2024-03-20T10:00:00Z',
    steps: [
      { id: 's1', name: 'Create customer record in database', agent: 'data', status: 'pending' },
      { id: 's2', name: 'Send welcome email to sarah@acme.com', agent: 'communication', status: 'pending' },
      { id: 's3', name: 'Notify team on Slack #sales', agent: 'communication', status: 'pending' },
      { id: 's4', name: 'Schedule follow-up call', agent: 'integration', status: 'pending' },
    ]
  },
  {
    id: 'wf-2',
    name: 'Invoice Processing',
    description: 'Extract and pay invoices under $5000 automatically',
    createdAt: '2024-03-21T14:30:00Z',
    steps: [
      { id: 's1', name: 'Scan PDF and extract invoice metadata', agent: 'analysis', status: 'pending' },
      { id: 's2', name: 'Validate vendor against approved list', agent: 'validation', status: 'pending' },
      { id: 's3', name: 'Check budget threshold ($5000)', agent: 'analysis', status: 'pending' },
      { id: 's4', name: 'Execute payment via Stripe API', agent: 'integration', status: 'pending' },
    ]
  }
];

export const getWorkflows = () => MOCK_WORKFLOWS;

export const createWorkflowFromPrompt = async (prompt: string): Promise<Workflow> => {
  const result = await createWorkflowFromNaturalLanguage({ workflowDescription: prompt });
  
  const newWorkflow: Workflow = {
    id: `wf-${Math.random().toString(36).substr(2, 9)}`,
    name: result.workflowName,
    description: prompt,
    createdAt: new Date().toISOString(),
    steps: result.workflowSteps.map((step, idx) => ({
      id: `s-${idx}`,
      name: step,
      agent: getAgentForStep(step),
      status: 'pending'
    }))
  };

  return newWorkflow;
};

const getAgentForStep = (step: string): AgentType => {
  const lower = step.toLowerCase();
  if (lower.includes('email') || lower.includes('slack') || lower.includes('notify')) return 'communication';
  if (lower.includes('database') || lower.includes('record') || lower.includes('save')) return 'data';
  if (lower.includes('api') || lower.includes('connect') || lower.includes('stripe')) return 'integration';
  if (lower.includes('analyze') || lower.includes('calculate') || lower.includes('extract')) return 'analysis';
  if (lower.includes('validate') || lower.includes('check') || lower.includes('verify')) return 'validation';
  return 'orchestrator';
};

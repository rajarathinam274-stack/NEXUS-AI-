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

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  agents: AgentType[];
  complexity: 'Low' | 'Medium' | 'High';
  steps: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Customer Support Orchestrator",
    description: "Automatically categorize support tickets, check SLA status, and route to the correct agent via Slack.",
    category: "Customer Experience",
    agents: ["analysis", "validation", "communication"],
    complexity: "Medium",
    steps: [
      "Analyze incoming ticket sentiment and urgency",
      "Verify customer subscription level and SLA",
      "Assign priority based on account tier",
      "Send notification to #support-leads in Slack"
    ]
  },
  {
    id: "t2",
    name: "E-commerce Order Processing",
    description: "Verify inventory, process payment through Stripe, and generate shipping labels automatically.",
    category: "Operations",
    agents: ["data", "integration", "validation"],
    complexity: "High",
    steps: [
      "Check inventory levels in database",
      "Validate shipping address authenticity",
      "Authorize payment via Stripe integration",
      "Generate shipping label and update order status"
    ]
  },
  {
    id: "t3",
    name: "Lead Enrichment Pipeline",
    description: "Identify new signups, enrich data from social profiles, and create tasks in CRM.",
    category: "Sales & Marketing",
    agents: ["analysis", "data", "integration"],
    complexity: "Medium",
    steps: [
      "Detect new signup event from webhooks",
      "Search and extract public social profile data",
      "Enrich customer record with company details",
      "Sync updated lead to Salesforce CRM"
    ]
  },
  {
    id: "t4",
    name: "Automated Invoice Auditor",
    description: "Scan incoming PDF invoices, verify line items against POs, and flag discrepancies for review.",
    category: "Finance",
    agents: ["analysis", "validation", "recovery"],
    complexity: "High",
    steps: [
      "Extract text and metadata from PDF invoice",
      "Cross-check line items against internal POs",
      "Validate vendor banking details",
      "Flag discrepancies for human approval"
    ]
  },
  {
    id: "t5",
    name: "Smart Meeting Transcriber",
    description: "Record meetings, generate summaries using LLMs, and distribute action items to attendees.",
    category: "Productivity",
    agents: ["analysis", "communication"],
    complexity: "Low",
    steps: [
      "Capture audio stream from meeting",
      "Transcribe audio to text with diarization",
      "Summarize key takeaways and action items",
      "Email summary to all participants"
    ]
  },
  {
    id: "t6",
    name: "HR Onboarding Assistant",
    description: "Standardize employee setup: create email accounts, send welcome packs, and schedule training.",
    category: "Human Resources",
    agents: ["communication", "integration", "data"],
    complexity: "Medium",
    steps: [
      "Provision new Google Workspace account",
      "Send welcome email with onboarding documents",
      "Add employee to internal HR database",
      "Schedule initial training sessions on calendar"
    ]
  }
];

// In-memory store for session-based mock persistence
let workflows: Workflow[] = [
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

export const getWorkflows = () => workflows;

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

  workflows = [newWorkflow, ...workflows];
  return newWorkflow;
};

export const addWorkflowFromTemplate = (templateId: string): Workflow | null => {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return null;

  const newWorkflow: Workflow = {
    id: `wf-${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    description: template.description,
    createdAt: new Date().toISOString(),
    steps: template.steps.map((stepName, idx) => ({
      id: `ts-${idx}`,
      name: stepName,
      agent: getAgentForStep(stepName),
      status: 'pending'
    }))
  };

  workflows = [newWorkflow, ...workflows];
  return newWorkflow;
};

const getAgentForStep = (step: string): AgentType => {
  const lower = step.toLowerCase();
  if (lower.includes('email') || lower.includes('slack') || lower.includes('notify') || lower.includes('message')) return 'communication';
  if (lower.includes('database') || lower.includes('record') || lower.includes('save') || lower.includes('store')) return 'data';
  if (lower.includes('api') || lower.includes('connect') || lower.includes('stripe') || lower.includes('salesforce') || lower.includes('google')) return 'integration';
  if (lower.includes('analyze') || lower.includes('calculate') || lower.includes('extract') || lower.includes('summarize')) return 'analysis';
  if (lower.includes('validate') || lower.includes('check') || lower.includes('verify') || lower.includes('audit')) return 'validation';
  return 'orchestrator';
};

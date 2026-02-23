"use client"

import { 
  Library, 
  Search, 
  Zap, 
  Users, 
  ShoppingCart, 
  Mail, 
  ShieldCheck, 
  BarChart3,
  ArrowRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const TEMPLATES = [
  {
    id: "t1",
    name: "Customer Support Orchestrator",
    description: "Automatically categorize support tickets, check SLA status, and route to the correct agent via Slack.",
    category: "Customer Experience",
    agents: ["analysis", "validation", "communication"],
    complexity: "Medium"
  },
  {
    id: "t2",
    name: "E-commerce Order Processing",
    description: "Verify inventory, process payment through Stripe, and generate shipping labels automatically.",
    category: "Operations",
    agents: ["data", "integration", "validation"],
    complexity: "High"
  },
  {
    id: "t3",
    name: "Lead Enrichment Pipeline",
    description: "Identify new signups, enrich data from social profiles, and create tasks in CRM.",
    category: "Sales & Marketing",
    agents: ["analysis", "data", "integration"],
    complexity: "Medium"
  },
  {
    id: "t4",
    name: "Automated Invoice Auditor",
    description: "Scan incoming PDF invoices, verify line items against POs, and flag discrepancies for review.",
    category: "Finance",
    agents: ["analysis", "validation", "recovery"],
    complexity: "High"
  },
  {
    id: "t5",
    name: "Smart Meeting Transcriber",
    description: "Record meetings, generate summaries using LLMs, and distribute action items to attendees.",
    category: "Productivity",
    agents: ["analysis", "communication"],
    complexity: "Low"
  },
  {
    id: "t6",
    name: "HR Onboarding Assistant",
    description: "Standardize employee setup: create email accounts, send welcome packs, and schedule training.",
    category: "Human Resources",
    agents: ["communication", "integration", "data"],
    complexity: "Medium"
  }
]

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
          <p className="text-muted-foreground">Jumpstart your automation with pre-built agentic workflows.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/workflows" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Custom Workflow
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9 bg-white" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="cursor-pointer">All Categories</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Sales</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Finance</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Ops</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="group border-none shadow-sm hover:shadow-md transition-all flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                  {template.category}
                </Badge>
                <Badge className={
                  template.complexity === 'Low' ? 'bg-green-100 text-green-700' :
                  template.complexity === 'Medium' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }>
                  {template.complexity}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{template.name}</CardTitle>
              <CardDescription className="line-clamp-3 min-h-[60px]">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {template.agents.map(agent => (
                    <Badge key={agent} variant="secondary" className="bg-primary/5 text-primary text-[10px] capitalize">
                      {agent} Agent
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t bg-muted/20">
              <Button className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all" asChild>
                <Link href="/workflows">
                  Use Template <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

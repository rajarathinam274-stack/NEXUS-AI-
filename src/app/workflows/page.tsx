"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Wand2, 
  MoreHorizontal, 
  Clock, 
  ArrowRight,
  Trash2,
  Copy,
  ChevronRight,
  Bot
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { getWorkflows, createWorkflowFromPrompt, Workflow } from "@/app/lib/store"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(getWorkflows())
  const [isCreating, setIsCreating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleCreate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    try {
      const newWorkflow = await createWorkflowFromPrompt(prompt)
      setWorkflows([newWorkflow, ...workflows])
      setPrompt("")
      setIsCreating(false)
      toast({
        title: "Workflow Created",
        description: `Successfully generated "${newWorkflow.name}" from your description.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error parsing your workflow description.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Design and manage your autonomous automation pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
                <Wand2 className="h-4 w-4" /> Create with AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Natural Language Workflow</DialogTitle>
                <DialogDescription>
                  Describe your business process in plain English and our agents will build the execution plan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea 
                  placeholder="e.g., When a new customer signs up, add them to our database, send a welcome email, and notify the #onboarding channel in Slack."
                  className="min-h-[120px] resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)} disabled={isGenerating}>Cancel</Button>
                <Button onClick={handleCreate} disabled={isGenerating || !prompt.trim()}>
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Bot className="h-4 w-4 animate-bounce" /> Analyzing...
                    </span>
                  ) : "Generate Workflow"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workflows..." className="pl-9 bg-white" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">All</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Active</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Draft</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((wf) => (
          <Card key={wf.id} className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {wf.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{wf.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Created {new Date(wf.createdAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-wider">
                    {wf.steps.length} Steps
                  </Badge>
                  {Array.from(new Set(wf.steps.map(s => s.agent))).map(agent => (
                    <Badge key={agent} variant="outline" className="text-[10px] capitalize">
                      {agent} Agent
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-muted/20">
              <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all" asChild>
                <Link href={`/executions/${wf.id}`}>
                  Run Workflow <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
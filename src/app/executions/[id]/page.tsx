"use client"

import { useState, useEffect, use } from "react"
import { 
  Play, 
  RotateCcw, 
  Pause, 
  CheckCircle2, 
  Circle, 
  Loader2,
  AlertCircle,
  Terminal,
  ArrowLeft,
  Bot,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWorkflows, WorkflowStep, Workflow } from "@/app/lib/store"
import Link from "next/link"
import { intelligentErrorRecovery } from "@/ai/flows/intelligent-error-recovery"
import { useToast } from "@/hooks/use-toast"

export default function ExecutionMonitorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle')
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [logs, setLogs] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const wf = getWorkflows().find(w => w.id === resolvedParams.id)
    if (wf) {
      setWorkflow(wf)
      setSteps(wf.steps.map(s => ({ ...s, status: 'pending' })))
    }
  }, [resolvedParams.id])

  const runExecution = async () => {
    if (status === 'running') return
    
    setStatus('running')
    setLogs(["Initialization started...", "Orchestrator online.", "Assigning tasks to specialized agents..."])
    
    const updatedSteps = [...steps]
    
    for (let i = 0; i < updatedSteps.length; i++) {
      setCurrentStep(i)
      updatedSteps[i].status = 'running'
      setSteps([...updatedSteps])
      
      const agentName = updatedSteps[i].agent.charAt(0).toUpperCase() + updatedSteps[i].agent.slice(1)
      setLogs(prev => [...prev, `${agentName} Agent: Executing "${updatedSteps[i].name}"...`])
      
      // Simulate execution time
      await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

      // Simulate a potential error for demo (20% chance on step 2)
      if (i === 1 && Math.random() < 0.2) {
        updatedSteps[i].status = 'failed'
        setSteps([...updatedSteps])
        setLogs(prev => [...prev, `[ERROR] ${agentName} Agent failed to process step.`])
        
        // Attempt AI recovery
        setLogs(prev => [...prev, "Recovery Agent: Analyzing failure for intelligent recovery..."])
        const recovery = await intelligentErrorRecovery({
          workflowId: workflow?.id || "unknown",
          stepId: updatedSteps[i].id,
          errorMessage: "Transient connection timeout during email dispatch.",
          workflowContext: JSON.stringify(updatedSteps[i]),
          retryCount: 0
        })

        if (recovery.recoveryAttempted && recovery.actionTaken !== 'no_action') {
          setLogs(prev => [...prev, `Recovery Agent: Determined action: ${recovery.actionTaken}. Retrying...`])
          await new Promise(r => setTimeout(r, 2000))
          updatedSteps[i].status = 'completed'
          setSteps([...updatedSteps])
          setLogs(prev => [...prev, "Recovery Agent: Self-healing successful. Continuing workflow."])
        } else {
          setStatus('failed')
          return
        }
      } else {
        updatedSteps[i].status = 'completed'
        setSteps([...updatedSteps])
        setLogs(prev => [...prev, `${agentName} Agent: Step completed successfully.`])
      }
    }
    
    setStatus('completed')
    setLogs(prev => [...prev, "Workflow execution finished. All agents returned 200 OK."])
    toast({
      title: "Execution Complete",
      description: "Successfully processed all workflow steps.",
    })
  }

  const reset = () => {
    setStatus('idle')
    setCurrentStep(-1)
    setLogs([])
    setSteps(steps.map(s => ({ ...s, status: 'pending' })))
  }

  if (!workflow) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>

  const progress = status === 'completed' ? 100 : (currentStep / steps.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/workflows"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{workflow.name}</h1>
              <Badge variant={status === 'running' ? 'secondary' : status === 'completed' ? 'default' : 'outline'}>
                {status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{workflow.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {status === 'idle' ? (
            <Button onClick={runExecution} className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" /> Start Execution
            </Button>
          ) : status === 'running' ? (
            <Button variant="outline" disabled>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : (
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Step Timeline</CardTitle>
                <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-1">
              {steps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all border ${
                    currentStep === idx ? 'bg-primary/5 border-primary shadow-sm scale-[1.01]' : 'border-transparent'
                  }`}
                >
                  <div className="mt-1">
                    {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                     step.status === 'running' ? <Loader2 className="h-5 w-5 text-primary animate-spin" /> :
                     step.status === 'failed' ? <AlertCircle className="h-5 w-5 text-destructive" /> :
                     <Circle className="h-5 w-5 text-muted-foreground/30" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold ${currentStep === idx ? 'text-primary' : ''}`}>{step.name}</p>
                      <Badge variant="outline" className="text-[10px] uppercase">{step.agent} Agent</Badge>
                    </div>
                    {currentStep === idx && (
                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Autonomous thinking in progress...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-sidebar text-sidebar-foreground border-none shadow-xl flex flex-col h-[600px]">
          <CardHeader className="border-b border-sidebar-border bg-sidebar-accent/30">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              <CardTitle className="text-sm font-mono text-white">Execution Logs</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 font-mono text-xs space-y-2">
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                <Bot className="h-12 w-12" />
                <p>Waiting for execution...</p>
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 ${log.includes('[ERROR]') ? 'text-red-400' : log.includes('Agent:') ? 'text-accent' : 'text-sidebar-foreground/70'}`}>
                <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span>{log}</span>
              </div>
            ))}
            {status === 'running' && (
              <div className="flex items-center gap-2 text-accent">
                <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                <span className="animate-pulse">_</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
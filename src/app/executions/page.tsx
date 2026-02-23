"use client"

import { 
  Play, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const RECENT_EXECUTIONS = [
  { id: "ex-1", workflow: "Customer Onboarding", status: "completed", duration: "1.2s", time: "2m ago", steps: 4, agent: "Data" },
  { id: "ex-2", workflow: "Invoice Processing", status: "failed", duration: "0.8s", time: "15m ago", steps: 2, agent: "Analysis" },
  { id: "ex-3", workflow: "Slack Sync", status: "running", duration: "0.2s", time: "Just now", steps: 1, agent: "Comm" },
  { id: "ex-4", workflow: "Lead Enrichment", status: "completed", duration: "2.4s", time: "1h ago", steps: 6, agent: "Integration" },
  { id: "ex-5", workflow: "Security Audit", status: "completed", duration: "3.1s", time: "3h ago", steps: 12, agent: "Validation" },
  { id: "ex-6", workflow: "Inventory Sync", status: "completed", duration: "1.5s", time: "5h ago", steps: 8, agent: "Data" },
]

export default function ExecutionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Execution History</h1>
          <p className="text-muted-foreground">Monitor real-time agent activity and past workflow outcomes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">-5% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Recovery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Autonomous self-healing</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search executions..." className="pl-9 bg-white" />
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="divide-y">
            {RECENT_EXECUTIONS.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`rounded-full p-2 ${
                    ex.status === 'completed' ? 'bg-green-100 text-green-600' :
                    ex.status === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600 animate-pulse'
                  }`}>
                    {ex.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                     ex.status === 'failed' ? <AlertTriangle className="h-5 w-5" /> :
                     <Activity className="h-5 w-5" />}
                  </div>
                  <div className="min-w-[200px]">
                    <p className="font-semibold">{ex.workflow}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {ex.time} • {ex.steps} steps • {ex.duration}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {ex.agent} Agent
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={ex.status === 'completed' ? 'default' : ex.status === 'failed' ? 'destructive' : 'secondary'}>
                    {ex.status}
                  </Badge>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/executions/${ex.id === 'ex-1' ? 'wf-1' : 'wf-2'}`}>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

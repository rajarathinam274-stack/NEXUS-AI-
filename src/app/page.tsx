import { 
  Zap, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus,
  ArrowRight,
  Workflow as WorkflowIcon,
  Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/StatCard"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const stats = [
    { title: "Active Workflows", value: "12", description: "Across 4 teams", icon: WorkflowIcon, trend: { value: "15%", positive: true } },
    { title: "Success Rate", value: "99.4%", description: "Past 30 days", icon: CheckCircle2, trend: { value: "0.2%", positive: true } },
    { title: "Total Executions", value: "1,482", description: "This month", icon: Zap, trend: { value: "24%", positive: true } },
    { title: "Agent Reliability", value: "98.8%", description: "Self-healing active", icon: Bot, trend: { value: "2.1%", positive: true } },
  ]

  const recentExecutions = [
    { id: "ex-1", name: "Customer Onboarding", status: "completed", time: "2m ago", steps: 4 },
    { id: "ex-2", name: "Invoice Processing", status: "failed", time: "15m ago", steps: 2 },
    { id: "ex-3", name: "Slack Sync", status: "running", time: "Just now", steps: 1 },
    { id: "ex-4", name: "Lead Enrichment", status: "completed", time: "1h ago", steps: 6 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nexus Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your autonomous agent workflows.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/workflows" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Workflow
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest workflow executions and their status.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/executions" className="text-primary hover:text-primary/80">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${
                      ex.status === 'completed' ? 'bg-green-100 text-green-600' :
                      ex.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600 animate-pulse'
                    }`}>
                      {ex.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                       ex.status === 'failed' ? <AlertTriangle className="h-5 w-5" /> :
                       <Activity className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.steps} steps executed • {ex.time}</p>
                    </div>
                  </div>
                  <Badge variant={ex.status === 'completed' ? 'default' : ex.status === 'failed' ? 'destructive' : 'secondary'}>
                    {ex.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-white">Active Agents</CardTitle>
            <CardDescription className="text-primary-foreground/70">Autonomous specialists currently online.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Orchestrator", status: "Busy", color: "bg-white" },
              { name: "Communication", status: "Idle", color: "bg-accent" },
              { name: "Analysis", status: "Busy", color: "bg-white" },
              { name: "Data", status: "Idle", color: "bg-accent" },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${agent.status === 'Busy' ? 'bg-accent animate-pulse' : 'bg-green-400'}`} />
                  <span className="font-medium text-sm">{agent.name}</span>
                </div>
                <span className="text-xs uppercase tracking-widest font-bold opacity-70">{agent.status}</span>
              </div>
            ))}
            <Button variant="secondary" className="w-full mt-4 bg-white text-primary hover:bg-white/90">
              Agent Settings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
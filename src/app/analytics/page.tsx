"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Brain
} from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"

const data = [
  { name: "Mon", total: 400, success: 380, fail: 20 },
  { name: "Tue", total: 300, success: 290, fail: 10 },
  { name: "Wed", total: 500, success: 480, fail: 20 },
  { name: "Thu", total: 280, success: 275, fail: 5 },
  { name: "Fri", total: 590, success: 580, fail: 10 },
  { name: "Sat", total: 320, success: 310, fail: 10 },
  { name: "Sun", total: 440, success: 430, fail: 10 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Intelligence</h1>
        <p className="text-muted-foreground">Deep insights into agent performance and workflow efficiency.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Health Score" value="98/100" description="Very Stable" icon={Activity} trend={{ value: "4%", positive: true }} />
        <StatCard title="Avg. Parsing Time" value="1.2s" description="LLM Efficiency" icon={Brain} trend={{ value: "0.2s", positive: true }} />
        <StatCard title="Recovery Rate" value="92%" description="Self-healing" icon={TrendingUp} trend={{ value: "5%", positive: true }} />
        <StatCard title="Human Escalation" value="0.4%" description="Minimal intervention" icon={AlertTriangle} trend={{ value: "1%", positive: false }} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Execution Volume</CardTitle>
            <CardDescription>Daily workflow executions across all agents.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Agent Success Rate</CardTitle>
            <CardDescription>Performance comparison of specialized agents.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { agent: 'Data', score: 99 },
                { agent: 'Comm', score: 97 },
                { agent: 'Integr', score: 94 },
                { agent: 'Analy', score: 98 },
                { agent: 'Valid', score: 100 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="agent" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Efficiency Insights</CardTitle>
          <CardDescription>AI-generated observations about your automation landscape.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Bottleneck Detected", text: "Integration Agent is experiencing higher latency during peak hours (2pm-4pm).", level: "warning" },
              { title: "Cost Optimization", text: "Workflow 'Slack Sync' could be 30% more efficient by batching updates.", level: "info" },
              { title: "Auto-Healing Win", text: "The Recovery Agent successfully prevented 14 human escalations this week.", level: "success" },
            ].map((insight, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={insight.level === 'warning' ? 'destructive' : insight.level === 'success' ? 'default' : 'secondary'}>
                    {insight.level.toUpperCase()}
                  </Badge>
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{insight.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
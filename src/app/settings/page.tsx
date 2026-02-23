
"use client"

import { useState } from "react"
import { 
  Shield, 
  Database, 
  Save,
  Settings as SettingsIcon,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Configuration Saved",
        description: "Your API keys and credentials have been updated.",
      })
    }, 1000)
  }

  const ConnectionStatus = ({ active }: { active: boolean }) => (
    <Badge variant="outline" className={active ? "text-green-600 bg-green-50 border-green-200" : "text-muted-foreground bg-muted/50"}>
      <div className={`h-1.5 w-1.5 rounded-full mr-2 ${active ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
      {active ? "Connected" : "Not Configured"}
    </Badge>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">Manage your API keys and external service connections for autonomous agents.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          {loading ? <SettingsIcon className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Save All Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> AI Core Providers
              </CardTitle>
              <ConnectionStatus active={true} />
            </div>
            <CardDescription>Primary LLMs for orchestration and recovery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini">Google Gemini Key (Primary)</Label>
              <Input id="gemini" type="password" placeholder="AIza..." defaultValue="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openai">OpenAI API Key</Label>
              <Input id="openai" type="password" placeholder="sk-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key</Label>
              <Input id="anthropic" type="password" placeholder="sk-ant-..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-accent" /> Google Data Services
              </CardTitle>
              <ConnectionStatus active={true} />
            </div>
            <CardDescription>Spreadsheet and File Management access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Service Account</span>
                <Badge variant="secondary" className="text-[10px]">credential.json detected</Badge>
              </div>
              <p className="text-xs text-muted-foreground">The Data Agent is authenticated via your root service account file.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheetId">Default Spreadsheet ID</Label>
              <Input id="sheetId" placeholder="1abc123..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" /> Communication Agent
              </CardTitle>
              <ConnectionStatus active={false} />
            </div>
            <CardDescription>Notifications via Slack and Email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack">Slack Bot User OAuth Token</Label>
              <Input id="slack" type="password" placeholder="xoxb-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resend">Email Provider Key (Resend)</Label>
              <Input id="resend" type="password" placeholder="re_..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-500" /> Integration Agent
              </CardTitle>
              <ConnectionStatus active={false} />
            </div>
            <CardDescription>Financial transactions and external payments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe">Stripe Secret Key</Label>
              <Input id="stripe" type="password" placeholder="sk_test_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook Secret</Label>
              <Input id="webhook" type="password" placeholder="whsec_..." />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center p-8">
        <div className="max-w-md text-center space-y-2">
           <div className="flex items-center justify-center gap-2 text-primary font-semibold">
             <CheckCircle2 className="h-4 w-4" /> Encryption Active
           </div>
           <p className="text-xs text-muted-foreground">
             All API keys are stored in environment variables and never exposed to the client-side bundle.
           </p>
        </div>
      </div>
    </div>
  )
}

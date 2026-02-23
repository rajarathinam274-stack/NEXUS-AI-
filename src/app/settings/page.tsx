
"use client"

import { useState } from "react"
import { 
  Key, 
  Shield, 
  Database, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Settings as SettingsIcon,
  Globe
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
        title: "API Settings Saved",
        description: "Your credentials have been updated securely.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground">Manage your API keys and external agent connections.</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          {loading ? <SettingsIcon className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          Save Configuration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> AI Providers
            </CardTitle>
            <CardDescription>Configure secondary LLM providers for multi-agent support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai">OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input id="openai" type="password" placeholder="sk-..." defaultValue="••••••••••••••••" />
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Connected</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key</Label>
              <div className="flex gap-2">
                <Input id="anthropic" type="password" placeholder="sk-ant-..." />
                <Badge variant="outline" className="text-muted-foreground">Not Set</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gemini">Google Gemini Key</Label>
              <div className="flex gap-2">
                <Input id="gemini" type="password" placeholder="AIza..." defaultValue="••••••••••••••••" />
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" /> Data Agent Creds
            </CardTitle>
            <CardDescription>Authentication for Google Sheets and Drive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Service Account</span>
                <Badge variant="secondary" className="text-[10px]">credential.json detected</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Nexus AI is using the service account: <code className="bg-muted px-1 rounded">nexus-ai-bot@...iam.gserviceaccount.com</code></p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheetId">Default Spreadsheet ID</Label>
              <Input id="sheetId" placeholder="1abc123..." defaultValue="1WqXaieQyaIQdYvTdfk..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driveId">Default Drive Folder ID</Label>
              <Input id="driveId" placeholder="folder-id-123" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" /> Integration Webhooks
            </CardTitle>
            <CardDescription>Inbound URLs for external service triggers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-sidebar-accent/10 rounded-lg border">
                <div>
                  <p className="text-sm font-semibold">Stripe Events</p>
                  <p className="text-xs text-muted-foreground">https://nexus-ai.app/api/webhooks/stripe</p>
                </div>
                <Button variant="ghost" size="sm">Copy URL</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-sidebar-accent/10 rounded-lg border">
                <div>
                  <p className="text-sm font-semibold">CRM Webhooks</p>
                  <p className="text-xs text-muted-foreground">https://nexus-ai.app/api/webhooks/crm</p>
                </div>
                <Button variant="ghost" size="sm">Copy URL</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

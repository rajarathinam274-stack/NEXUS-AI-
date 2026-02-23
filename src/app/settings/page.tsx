
"use client"

import { useState } from "react"
import { 
  Key, 
  Shield, 
  Database, 
  CheckCircle2, 
  Save,
  Settings as SettingsIcon,
  Globe,
  MessageSquare,
  CreditCard,
  Mail
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
              <Shield className="h-5 w-5 text-primary" /> AI Core Providers
            </CardTitle>
            <CardDescription>Primary LLMs for orchestration and recovery agents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini">Google Gemini Key (Primary)</Label>
              <div className="flex gap-2">
                <Input id="gemini" type="password" placeholder="AIza..." defaultValue="••••••••••••••••" />
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
              </div>
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
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" /> Data & Files
            </CardTitle>
            <CardDescription>Credentials for Google Sheets and Drive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Service Account</span>
                <Badge variant="secondary" className="text-[10px]">credential.json detected</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Nexus AI is using the service account for Sheets/Drive.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheetId">Default Spreadsheet ID</Label>
              <Input id="sheetId" placeholder="1abc123..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" /> Communication Agent
            </CardTitle>
            <CardDescription>Configuration for Slack and Email notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack">Slack Bot Token</Label>
              <Input id="slack" type="password" placeholder="xoxb-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resend">Email Provider Key (Resend/SendGrid)</Label>
              <Input id="resend" type="password" placeholder="re_..." />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" /> Integration Agent
            </CardTitle>
            <CardDescription>Payment gateway and CRM connections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe">Stripe Secret Key</Label>
              <Input id="stripe" type="password" placeholder="sk_test_..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook">Stripe Webhook Secret</Label>
              <Input id="webhook" type="password" placeholder="whsec_..." />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { 
  Search, 
  ArrowRight,
  Plus,
  Bot,
  Loader2
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
import { TEMPLATES, addWorkflowFromTemplate } from "@/app/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleUseTemplate = async (templateId: string) => {
    setProcessingId(templateId)
    
    // Simulate AI "processing" of the template
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newWf = addWorkflowFromTemplate(templateId)
    
    if (newWf) {
      toast({
        title: "Template Processed",
        description: `"${newWf.name}" has been added to your workflows.`,
      })
      router.push("/workflows")
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process template. Please try again.",
      })
      setProcessingId(null)
    }
  }

  const filteredTemplates = TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <Input 
            placeholder="Search templates..." 
            className="pl-9 bg-white" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="cursor-pointer">All Categories</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Sales</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Finance</Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-muted">Ops</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group border-none shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden">
            {processingId === template.id && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-primary space-y-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Initializing Agents...</span>
              </div>
            )}
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
              <Button 
                className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all"
                onClick={() => handleUseTemplate(template.id)}
                disabled={processingId !== null}
              >
                {processingId === template.id ? "Processing..." : (
                  <>
                    Use Template <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="bg-muted rounded-full p-6">
            <Bot className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or create a custom workflow.</p>
          </div>
          <Button onClick={() => setSearchQuery("")} variant="outline">Clear Search</Button>
        </div>
      )}
    </div>
  )
}

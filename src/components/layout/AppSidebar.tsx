"use client"

import { 
  LayoutDashboard, 
  Workflow, 
  Play, 
  Settings, 
  BarChart3, 
  Library,
  Zap,
  Cpu
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    { name: "Workflows", icon: Workflow, href: "/workflows" },
    { name: "Executions", icon: Play, href: "/executions" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Templates", icon: Library, href: "/templates" },
  ]

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">NEXUS AI</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-primary-foreground/50">Agentic Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="px-3">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                    pathname === item.href 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "hover:bg-sidebar-accent hover:text-white"
                  }`}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-xl bg-sidebar-accent/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold">Pro Plan</span>
          </div>
          <p className="text-xs text-sidebar-foreground/60 mb-3">85% of your quota used this month.</p>
          <div className="h-1.5 w-full bg-sidebar-border rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: '85%' }}></div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const user = localStorage.getItem("adminUser")
    if (!user) {
      router.push("/login")
      return
    }

    setUsername(JSON.parse(user).username)
  }, [router])

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("adminUser")
    router.push("/login")
  }

  if (!isClient) {
    return null
  }

  const menuItems = [
    {
      title: "Overview",
      path: "/admin/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      title: "Profile Editor",
      path: "/admin/profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: "Work Experience",
      path: "/admin/experience",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      title: "Technical Skills",
      path: "/admin/skills",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      ),
    },
    {
      title: "Skill Proficiency",
      path: "/admin/proficiency",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: "Projects",
      path: "/admin/projects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M3 3v18h18" />
          <path d="M18.4 9.4 8.5 19.2" />
          <path d="m10.8 7.8 7.9-7.9 3.4 3.4-7.9 7.9" />
        </svg>
      ),
    },
    {
      title: "Education & Certs",
      path: "/admin/education",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Sidebar className="w-64">
          <SidebarHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{username}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Administrator</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                    <a href={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
          </header>
          <main className="flex-1 min-w-0 overflow-auto w-full max-w-full p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

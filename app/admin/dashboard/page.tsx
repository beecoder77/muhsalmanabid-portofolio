"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/ui/charts"
import { Users, Mail, Linkedin, User, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Briefcase, GraduationCap, Code2, Star } from "lucide-react"

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface SocialMedia {
  type: string;
  url: string;
}

interface Profile {
  name: string;
  title: string;
  city: string;
  tagline: string;
  aboutMe: string;
  photo: string;
  socialMedia: SocialMedia[];
}

interface EducationData {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  data: EducationData[];
  pagination: Pagination;
}

interface ExperienceData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  data: ExperienceData[];
  pagination: Pagination;
}


interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
}

interface Project {
  data: ProjectData[];
  pagination: Pagination;
}

interface SkillData {
  name: string;
  category: string;
  level: string;
}

interface Skill {
  data: SkillData[];
  pagination: Pagination;
}


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("daily")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [educations, setEducations] = useState<Education>({ data: [], pagination: { total: 0, page: 0, limit: 0, pages: 0 } })
  const [experiences, setExperiences] = useState<Experience>({ data: [], pagination: { total: 0, page: 0, limit: 0, pages: 0 } })
  const [projects, setProjects] = useState<Project>({ data: [], pagination: { total: 0, page: 0, limit: 0, pages: 0 } })
  const [skills, setSkills] = useState<Skill>({ data: [], pagination: { total: 0, page: 0, limit: 0, pages: 0 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for visitor statistics
  const visitorData = {
    daily: {
      data: [12, 18, 25, 15, 22, 30, 35],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      total: 157,
      change: 12.5,
      increased: true,
    },
    monthly: {
      data: [320, 420, 380, 450, 390, 520, 550, 480, 620, 580, 650, 700],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      total: 6060,
      change: 8.2,
      increased: true,
    },
    yearly: {
      data: [4500, 5200, 6060],
      labels: ["2023", "2024", "2025"],
      total: 15760,
      change: 16.5,
      increased: true,
    },
  }

  const emailData = {
    sent: 48,
    change: 22.5,
    increased: true,
  }

  const linkedinData = {
    connections: 124,
    change: -5.2,
    increased: false,
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

        // Fetch all data in parallel
        const [profileRes, educationsRes, experiencesRes, projectsRes, skillsRes] = await Promise.all([
          fetch(`${baseUrl}/profile`, { headers }),
          fetch(`${baseUrl}/education`, { headers }),
          fetch(`${baseUrl}/experience`, { headers }),
          fetch(`${baseUrl}/projects`, { headers }),
          fetch(`${baseUrl}/skills`, { headers })
        ])

        if (!profileRes.ok || !educationsRes.ok || !experiencesRes.ok || !projectsRes.ok || !skillsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [profileData, educationsData, experiencesData, projectsData, skillsData] = await Promise.all([
          profileRes.json(),
          educationsRes.json(),
          experiencesRes.json(),
          projectsRes.json(),
          skillsRes.json()
        ])

        setProfile(profileData)
        setEducations(educationsData)
        setExperiences(experiencesData)
        setProjects(projectsData)
        setSkills(skillsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitorData[activeTab as keyof typeof visitorData].total}
              <span
                className={`ml-2 text-sm font-normal ${visitorData[activeTab as keyof typeof visitorData].increased ? "text-green-500" : "text-red-500"}`}
              >
                {visitorData[activeTab as keyof typeof visitorData].increased ? (
                  <ArrowUpRight className="inline h-4 w-4" />
                ) : (
                  <ArrowDownRight className="inline h-4 w-4" />
                )}
                {visitorData[activeTab as keyof typeof visitorData].change}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Compared to previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailData.sent}
              <span className={`ml-2 text-sm font-normal ${emailData.increased ? "text-green-500" : "text-red-500"}`}>
                {emailData.increased ? (
                  <ArrowUpRight className="inline h-4 w-4" />
                ) : (
                  <ArrowDownRight className="inline h-4 w-4" />
                )}
                {emailData.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Compared to previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">LinkedIn Connections</CardTitle>
            <Linkedin className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {linkedinData.connections}
              <span
                className={`ml-2 text-sm font-normal ${linkedinData.increased ? "text-green-500" : "text-red-500"}`}
              >
                {linkedinData.increased ? (
                  <ArrowUpRight className="inline h-4 w-4" />
                ) : (
                  <ArrowDownRight className="inline h-4 w-4" />
                )}
                {Math.abs(linkedinData.change)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Compared to previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Code2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.pagination.total}</div>
            <p className="text-xs text-gray-500">Total projects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitor Statistics</CardTitle>
          <CardDescription>Track your website traffic over time</CardDescription>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <LineChart
              data={{
                labels: visitorData[activeTab as keyof typeof visitorData].labels,
                datasets: [
                  {
                    label: "Visitors",
                    data: visitorData[activeTab as keyof typeof visitorData].data,
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    tension: 0.4,
                  },
                ],
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Education</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educations.pagination.total}</div>
            <p className="text-xs text-gray-500">Total education entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Briefcase className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experiences.pagination.total}</div>
            <p className="text-xs text-gray-500">Total experience entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills.pagination.total}</div>
            <p className="text-xs text-gray-500">Total skills</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
            <CardDescription>Current about section content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4 text-sm">
              <p>{profile?.aboutMe || 'No bio available'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Current profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-gray-500">{profile?.name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Title</p>
                  <p className="text-sm text-gray-500">{profile?.title || 'Not set'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Education</CardTitle>
            <CardDescription>Most recent education entry</CardDescription>
          </CardHeader>
          <CardContent>
            {educations.pagination.total ? (
              <div className="space-y-2">
                <h3 className="font-medium">{educations.data[0].school}</h3>
                <p className="text-sm text-gray-500">{educations.data[0].degree} in {educations.data[0].field}</p>
                <p className="text-sm text-gray-500">
                  {new Date(educations.data[0].startDate).getFullYear()} - {new Date(educations.data[0].endDate).getFullYear()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No education entries found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Experience</CardTitle>
            <CardDescription>Most recent work experience</CardDescription>
          </CardHeader>
          <CardContent>
            {experiences.pagination.total > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium">{experiences.data[0].company}</h3>
                <p className="text-sm text-gray-500">{experiences.data[0].position}</p>
                <p className="text-sm text-gray-500">
                  {new Date(experiences.data[0].startDate).getFullYear()} - {new Date(experiences.data[0].endDate).getFullYear()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No experience entries found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


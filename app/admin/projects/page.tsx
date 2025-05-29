"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Trash2, Edit, Code } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { apiService } from "@/lib/api"
import type { Project } from "@/lib/api"

const projectFormSchema = z.object({
  name: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  techStack: z.array(z.string()).min(1, { message: "At least one technology is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

export default function ProjectEditor() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      techStack: [],
      startDate: "",
      endDate: null,
      current: false,
    },
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProjects()
      setProjects(response.data.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: ProjectFormValues) {
    try {
      const projectData = {
        name: data.name,
        description: data.description,
        url: data.url || "",
        techStack: data.techStack,
        startDate: data.startDate,
        endDate: data.endDate || null,
        current: data.current,
        user: "683200c74cb992aec9127890", // TODO: Get from auth context
        __v: 0,
      }

      if (currentProject) {
        // Update existing project
        await apiService.updateProject(currentProject._id, projectData)

        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        })
      } else {
        // Add new project
        await apiService.addProject(projectData)

        toast({
          title: "Project added",
          description: "Your project has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      form.reset()
      fetchProjects() // Refresh the list
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project: Project) => {
    setCurrentProject(project)
    form.reset({
      name: project.name,
      description: project.description,
      url: project.url,
      techStack: project.techStack,
      startDate: project.startDate,
      endDate: project.endDate,
      current: project.current,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProject(id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      })
      fetchProjects() // Refresh the list
    } catch (error) {
      console.error('Error deleting project:', error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNew = () => {
    setCurrentProject(null)
    form.reset({
      name: "",
      description: "",
      url: "",
      techStack: [],
      startDate: "",
      endDate: null,
      current: false,
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Editor</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 w-full">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Code className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No projects</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Add your projects to showcase your work.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {projects.map((project) => (
            <AccordionItem key={project._id} value={project._id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(project)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.url && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Project URL:</h4>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        {project.url}
                      </a>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProject ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription>
              {currentProject
                ? "Update your project details below."
                : "Fill in your project details below."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. My Awesome Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. https://myproject.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. React, Node.js, MongoDB"
                        {...field}
                        onChange={(e) => {
                          const values = e.target.value.split(',').map(tech => tech.trim())
                          field.onChange(values)
                        }}
                        value={field.value.join(', ')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Currently working on this project</FormLabel>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{currentProject ? "Update" : "Add"} Project</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

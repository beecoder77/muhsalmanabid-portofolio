"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Trash2, Edit, Calendar, Building, MapPin, ChevronDown, ChevronUp } from "lucide-react"
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
import type { Experience } from "@/lib/api"

const experienceFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  startDate: z.string().min(2, { message: "Start date must be at least 2 characters." }),
  endDate: z.string().min(2, { message: "End date must be at least 2 characters." }),
  achievements: z.string().min(10, { message: "Achievements must be at least 10 characters." }),
})

type ExperienceFormValues = z.infer<typeof experienceFormSchema>

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      achievements: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await apiService.getExperiences()
      setExperiences(response.data.data)
    } catch (error) {
      console.error('Error fetching experiences:', error)
      toast({
        title: "Error",
        description: "Failed to fetch experiences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: ExperienceFormValues) {
    try {
      if (currentExperience) {
        // Update existing experience
        await apiService.updateExperience(currentExperience._id, {
          title: data.title,
          company: data.company,
          location: data.location,
          startDate: data.startDate,
          endDate: data.endDate,
          achievements: data.achievements.split("\n\n").filter((item) => item.trim() !== ""),
        })

        toast({
          title: "Experience updated",
          description: "Your work experience has been updated successfully.",
        })
      } else {
        // Add new experience
        await apiService.addExperience({
          title: data.title,
          company: data.company,
          location: data.location,
          startDate: data.startDate,
          endDate: data.endDate,
          achievements: data.achievements.split("\n\n").filter((item) => item.trim() !== ""),
        })

        toast({
          title: "Experience added",
          description: "Your work experience has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      form.reset()
      fetchExperiences() // Refresh the list
    } catch (error) {
      console.error('Error saving experience:', error)
      toast({
        title: "Error",
        description: "Failed to save experience. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience)
    form.reset({
      title: experience.title,
      company: experience.company,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      achievements: experience.description?.join("\n\n") || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteExperience(id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Experience deleted",
        description: "Your work experience has been deleted successfully.",
      })
      fetchExperiences() // Refresh the list
    } catch (error) {
      console.error('Error deleting experience:', error)
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNew = () => {
    setCurrentExperience(null)
    form.reset({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      achievements: "",
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
        <h1 className="text-2xl font-bold">Work Experience Editor</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 w-full">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Building className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No work experience</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Add your work experience to showcase your professional journey.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {experiences.map((experience, index) => (
            <AccordionItem key={experience._id} value={experience._id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg font-semibold">{experience.title}</h3>
                      <p className="text-sm text-gray-500">{experience.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(experience)
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
                            This action cannot be undone. This will permanently delete the experience.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(experience._id)}>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {experience.startDate} - {experience.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Achievements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {(experience.description ?? []).map((achievement, i) => (
                        <li key={i} className="text-sm text-gray-500">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentExperience ? "Edit Experience" : "Add Experience"}</DialogTitle>
            <DialogDescription>
              {currentExperience
                ? "Update your work experience details below."
                : "Fill in your work experience details below."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Senior Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. San Francisco, CA" {...field} />
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
                        <Input placeholder="e.g. January 2020" {...field} />
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Present" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your achievements (separate with double newlines)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{currentExperience ? "Update" : "Add"} Experience</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import type { Skill } from "@/lib/api"

const skillFormSchema = z.object({
  name: z.string().min(2, { message: "Skill name must be at least 2 characters." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  proficiency: z.number().min(0).max(100),
})

type SkillFormValues = z.infer<typeof skillFormSchema>

export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
      category: "",
      proficiency: 0,
    },
    mode: "onChange",
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSkills()
      setSkills(response.data.data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast({
        title: "Error",
        description: "Failed to fetch skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: SkillFormValues) {
    try {
      if (currentSkill) {
        // Update existing skill
        await apiService.updateSkill(currentSkill._id, {
          name: data.name,
          category: data.category,
          proficiency: data.proficiency,
        })

        toast({
          title: "Skill updated",
          description: "Your skill has been updated successfully.",
        })
      } else {
        // Add new skill
        await apiService.addSkill({
          name: data.name,
          category: data.category,
          proficiency: data.proficiency,
        })

        toast({
          title: "Skill added",
          description: "Your skill has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      form.reset()
      fetchSkills() // Refresh the list
    } catch (error) {
      console.error('Error saving skill:', error)
      toast({
        title: "Error",
        description: "Failed to save skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill)
    form.reset({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteSkill(id)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Skill deleted",
        description: "Your skill has been deleted successfully.",
      })
      fetchSkills() // Refresh the list
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNew = () => {
    setCurrentSkill(null)
    form.reset({
      name: "",
      category: "",
      proficiency: 0,
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
        <h1 className="text-2xl font-bold">Skills Editor</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 w-full">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Code className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No skills</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Add your skills to showcase your expertise.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {skills.map((skill) => (
            <AccordionItem key={skill._id} value={skill._id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg font-semibold">{skill.name}</h3>
                      <p className="text-sm text-gray-500">{skill.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(skill)
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
                            This action cannot be undone. This will permanently delete the skill.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(skill._id)}>
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
                    <h4 className="font-medium">Proficiency:</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-cyan-600 h-2.5 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">{skill.proficiency}%</p>
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
            <DialogTitle>{currentSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {currentSkill
                ? "Update your skill details below."
                : "Fill in your skill details below."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. React" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency (0-100)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 90"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{currentSkill ? "Update" : "Add"} Skill</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

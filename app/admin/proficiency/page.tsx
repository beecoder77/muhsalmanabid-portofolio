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
import { apiService, type Proficiency } from "@/lib/api"

const proficiencyFormSchema = z.object({
  skill: z.string().min(2, { message: 'Skill is required.' }),
  value: z.number().min(0).max(100),
  description: z.string().optional(),
})

type ProficiencyFormValues = z.infer<typeof proficiencyFormSchema>

export default function ProficiencyEditor() {
  const [proficiencies, setProficiencies] = useState<Proficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentProficiency, setCurrentProficiency] = useState<Proficiency | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<ProficiencyFormValues>({
    resolver: zodResolver(proficiencyFormSchema),
    defaultValues: {
      skill: '',
      value: 0,
      description: '',
    },
    mode: "onChange",
  })

  useEffect(() => {
    fetchProficiencies()
  }, [])

  const fetchProficiencies = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProficiencies()
      setProficiencies(response.data)
    } catch (error) {
      console.error('Error fetching proficiencies:', error)
      toast({
        title: "Error",
        description: "Failed to fetch proficiencies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: ProficiencyFormValues) {
    try {
      if (currentProficiency) {
        await apiService.updateProficiency(currentProficiency._id, data)
        toast({ title: "Proficiency updated", description: "Your proficiency has been updated successfully." })
      } else {
        const nextId = proficiencies.length > 0 ? Math.max(...proficiencies.map(p => p.id)) + 1 : 1;
        await apiService.addProficiency({ id: nextId, skill: data.skill, value: data.value, description: data.description || '' })
        toast({ title: "Proficiency added", description: "Your proficiency has been added successfully." })
      }
      setIsDialogOpen(false)
      form.reset()
      fetchProficiencies()
    } catch (error) {
      console.error('Error saving proficiency:', error)
      toast({ title: "Error", description: "Failed to save proficiency. Please try again.", variant: "destructive" })
    }
  }

  const handleEdit = (proficiency: Proficiency) => {
    setCurrentProficiency(proficiency)
    form.reset({
      skill: proficiency.skill,
      value: proficiency.value,
      description: proficiency.description || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProficiency(id)
      setIsDeleteDialogOpen(false)
      toast({ title: "Proficiency deleted", description: "Your proficiency has been deleted successfully." })
      fetchProficiencies()
    } catch (error) {
      console.error('Error deleting proficiency:', error)
      toast({ title: "Error", description: "Failed to delete proficiency. Please try again.", variant: "destructive" })
    }
  }

  const handleAddNew = () => {
    setCurrentProficiency(null)
    form.reset({ skill: '', value: 0, description: '' })
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
        <h1 className="text-2xl font-bold">Proficiency Editor</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Proficiency
        </Button>
      </div>

      {proficiencies.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 w-full">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Code className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No proficiencies</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Add your proficiencies to showcase your expertise.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {proficiencies.map((proficiency) => (
            <AccordionItem key={proficiency._id} value={proficiency._id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-start">
                      <h3 className="text-lg font-semibold">{proficiency.skill}</h3>
                      <p className="text-sm text-gray-500">{proficiency.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(proficiency)
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
                            This action cannot be undone. This will permanently delete the proficiency.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(proficiency._id)}>
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
                    <h4 className="font-medium">Value:</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-cyan-600 h-2.5 rounded-full"
                        style={{ width: `${proficiency.value}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">{proficiency.value}%</p>
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
            <DialogTitle>{currentProficiency ? "Edit Proficiency" : "Add Proficiency"}</DialogTitle>
            <DialogDescription>
              {currentProficiency
                ? "Update your proficiency details below."
                : "Fill in your proficiency details below."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JavaScript/TypeScript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (0-100)</FormLabel>
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. JavaScript/TypeScript" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{currentProficiency ? "Update" : "Add"} Proficiency</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

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
import { Plus, Trash2, Edit, GraduationCap, Calendar, MapPin } from "lucide-react"
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
import type { Education } from "@/lib/api"

const educationFormSchema = z.object({
  type: z.enum(['education', 'certification']),
  publisher: z.string().min(2, { message: 'Publisher is required.' }),
  title: z.string().min(2, { message: 'Title is required.' }),
  city: z.string().optional(),
  startDate: z.string().min(2, { message: 'Start date is required.' }),
  endDate: z.string().optional(),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
})

type EducationFormValues = z.infer<typeof educationFormSchema>

export default function EducationEditor() {
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      type: 'education',
      publisher: '',
      title: '',
      city: '',
      startDate: '',
      endDate: '',
      description: '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    try {
      setLoading(true)
      const response = await apiService.getEducations()
      setEducations(response.data.data)
    } catch (error) {
      console.error('Error fetching educations:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch educations. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: EducationFormValues) {
    try {
      if (currentEducation) {
        await apiService.updateEducation(currentEducation._id, data)
        toast({ title: 'Education updated', description: 'Your education/certification has been updated successfully.' })
      } else {
        await apiService.addEducation(data)
        toast({ title: 'Education added', description: 'Your education/certification has been added successfully.' })
      }
      setIsDialogOpen(false)
      form.reset()
      fetchEducations()
    } catch (error) {
      console.error('Error saving education:', error)
      toast({ title: 'Error', description: 'Failed to save education/certification. Please try again.', variant: 'destructive' })
    }
  }

  const handleEdit = (education: Education) => {
    setCurrentEducation(education)
    form.reset({
      type: education.type,
      publisher: education.publisher,
      title: education.title,
      city: education.city || '',
      startDate: education.startDate,
      endDate: education.endDate || '',
      description: education.description,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteEducation(id)
      setIsDeleteDialogOpen(false)
      toast({ title: 'Education deleted', description: 'Your education/certification has been deleted successfully.' })
      fetchEducations()
    } catch (error) {
      console.error('Error deleting education:', error)
      toast({ title: 'Error', description: 'Failed to delete education/certification. Please try again.', variant: 'destructive' })
    }
  }

  const handleAddNew = () => {
    setCurrentEducation(null)
    form.reset({
      type: 'education',
      publisher: '',
      title: '',
      city: '',
      startDate: '',
      endDate: '',
      description: '',
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
        <h1 className="text-2xl font-bold">Education & Certifications Editor</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      {educations.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 w-full">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <GraduationCap className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No education/certification</h3>
            <p className="mt-2 text-center text-sm text-gray-500">
              Add your education or certification to showcase your background.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations.map((education) => (
            <Card key={education._id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {education.type === 'education' ? (
                    <GraduationCap className="h-6 w-6 text-cyan-400" />
                  ) : (
                    <Calendar className="h-6 w-6 text-cyan-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold">{education.title}</h3>
                    <div className="text-cyan-400 font-medium text-sm">{education.publisher}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm mb-2">
                  {education.city && <span>{education.city} </span>}
                  ({education.startDate?.slice(0, 4)}{education.endDate ? ` - ${education.endDate.slice(0, 4)}` : ''})
                </div>
                <div className="text-gray-300 text-sm mb-4">
                  {education.description}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(education)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the education/certification.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(education._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentEducation ? 'Edit' : 'Add'} Education/Certification</DialogTitle>
            <DialogDescription>
              {currentEducation
                ? 'Update your education/certification details below.'
                : 'Fill in your education or certification details below.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select {...field} className="input">
                        <option value="education">Education</option>
                        <option value="certification">Certification</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.watch('type') === 'education' ? 'School' : 'Publisher/Issuer'}</FormLabel>
                    <FormControl>
                      <Input placeholder={form.watch('type') === 'education' ? 'e.g. Binus University' : 'e.g. PT Ekipa Agile Consultancy'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{form.watch('type') === 'education' ? 'Major / Degree' : 'Certification Title'}</FormLabel>
                    <FormControl>
                      <Input placeholder={form.watch('type') === 'education' ? 'e.g. Teknik Informatika' : 'e.g. Certified Indonesia Scrum Master (ISM) I'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jakarta, Indonesia" {...field} />
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
                        <Input placeholder="e.g. 2024-01" type="month" {...field} />
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
                        <Input placeholder="e.g. 2028-01" type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your description"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{currentEducation ? 'Update' : 'Add'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}

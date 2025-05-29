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
import { User, MapPin, Briefcase, MessageSquare, Image as ImageIcon } from "lucide-react"
import { apiService, authService } from "@/lib/api"
import type { Profile } from "@/lib/api"
import Image from "next/image"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  tagline: z.string().min(2, { message: "Tagline must be at least 2 characters." }),
  aboutMe: z.string().min(10, { message: "About me must be at least 10 characters." }),
  photo: z.string().min(2, { message: "Photo URL must be at least 2 characters." }),
  phoneNumbers: z.array(z.string()),
  emails: z.array(z.string()),
  socialMedia: z.array(
    z.object({
      type: z.string().min(2, { message: "Social media type must be at least 2 characters." }),
      url: z.string().min(2, { message: "Social media URL must be at least 2 characters." }),
    })
  ),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileEditor() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      title: "",
      city: "",
      tagline: "",
      aboutMe: "",
      photo: "",
      phoneNumbers: [""],
      emails: [""],
      socialMedia: [{ type: "", url: "" }],
    },
    mode: "onChange",
  })

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      setProfile(response.data);
      form.reset({
        name: response.data.name,
        title: response.data.title,
        city: response.data.city,
        tagline: response.data.tagline,
        aboutMe: response.data.aboutMe,
        photo: response.data.photo,
        phoneNumbers: response.data.phoneNumbers || [""],
        emails: response.data.emails || [""],
        socialMedia: response.data.socialMedia || [{ type: "", url: "" }],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    console.log('Form submitted with data:', data);
    
    try {
      console.log('Calling updateProfile API...');
      const response = await apiService.updateProfile(data);
      console.log('API Response:', response);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      fetchProfile(); // Refresh the profile
    } catch (error) {
      console.error('Error saving profile:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleSocialMediaChange = (index: number, field: string, value: string) => {
    const newSocialMedia = [...form.getValues("socialMedia")]
    newSocialMedia[index] = { ...newSocialMedia[index], [field]: value }
    form.setValue("socialMedia", newSocialMedia)
  }

  const addSocialMedia = () => {
    form.setValue("socialMedia", [...form.getValues("socialMedia"), { type: "", url: "" }])
  }

  const removeSocialMedia = (index: number) => {
    const newSocialMedia = form.getValues("socialMedia").filter((_, i) => i !== index)
    form.setValue("socialMedia", newSocialMedia)
  }

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...form.getValues("phoneNumbers")]
    newPhoneNumbers[index] = value
    form.setValue("phoneNumbers", newPhoneNumbers)
  }

  const addPhoneNumber = () => {
    form.setValue("phoneNumbers", [...form.getValues("phoneNumbers"), ""])
  }

  const removePhoneNumber = (index: number) => {
    const newPhoneNumbers = form.getValues("phoneNumbers").filter((_, i) => i !== index)
    form.setValue("phoneNumbers", newPhoneNumbers)
  }

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...form.getValues("emails")]
    newEmails[index] = value
    form.setValue("emails", newEmails)
  }

  const addEmail = () => {
    form.setValue("emails", [...form.getValues("emails"), ""])
  }

  const removeEmail = (index: number) => {
    const newEmails = form.getValues("emails").filter((_, i) => i !== index)
    form.setValue("emails", newEmails)
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
        <h1 className="text-2xl font-bold">Profile Editor</h1>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Doe" {...field} />
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
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
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Building the future of web" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input placeholder="e.g. https://example.com/photo.jpg" {...field} />
                          {field.value && (
                            <div className="relative w-full aspect-square max-w-[200px] rounded-lg overflow-hidden border">
                              <Image
                                src={field.value}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/200x200?text=Invalid+Image";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aboutMe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a brief description about yourself"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Phone Numbers</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPhoneNumber}
                  >
                    Add Phone Number
                  </Button>
                </div>

                {form.watch("phoneNumbers").map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`phoneNumbers.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="+6281234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePhoneNumber(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Email Addresses</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmail}
                  >
                    Add Email
                  </Button>
                </div>

                {form.watch("emails").map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`emails.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeEmail(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Social Media</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSocialMedia}
                  >
                    Add Social Media
                  </Button>
                </div>

                {form.watch("socialMedia").map((social, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`socialMedia.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Type (e.g., linkedin)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialMedia.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSocialMedia(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}

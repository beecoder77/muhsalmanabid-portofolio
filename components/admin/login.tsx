"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react"
import RobotAnimation from "@/components/admin/robot-animation"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [focusedField, setFocusedField] = useState<"none" | "username" | "password">("none")
  const [robotState, setRobotState] = useState<"idle" | "looking" | "happy" | "thinking" | "surprised" | "error">(
    "idle",
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  // Watch form values for robot reactions
  const watchUsername = watch("username")
  const watchPassword = watch("password")

  // Update robot state based on form interaction
  useEffect(() => {
    if (loginStatus === "loading") {
      setRobotState("thinking")
      return
    }

    if (loginStatus === "success") {
      setRobotState("happy")
      return
    }

    if (loginStatus === "error") {
      setRobotState("error")
      return
    }

    if (focusedField === "username") {
      setRobotState("looking")
      return
    }

    if (focusedField === "password") {
      setRobotState("surprised")
      return
    }

    if (errors.username || errors.password) {
      setRobotState("error")
      return
    }

    if (isValid && isDirty) {
      setRobotState("happy")
      return
    }

    setRobotState("idle")
  }, [focusedField, errors, isValid, isDirty, loginStatus, watchUsername, watchPassword])

  const onSubmit = async (data: LoginFormValues) => {
    setLoginStatus("loading")

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: responseData.message || 'Invalid credentials',
          variant: "destructive"
        })
        setLoginStatus("error")
        return;
      }
      
      // Store token in cookie instead of localStorage
      document.cookie = `adminToken=${responseData.token}; path=/; max-age=86400` // 24 hours
      document.cookie = `adminUser=${JSON.stringify(responseData.user)}; path=/; max-age=86400`

      // Store token in localStorage
      localStorage.setItem('adminToken', responseData.token)
      localStorage.setItem('adminUser', JSON.stringify(responseData.user))

      setLoginStatus("success")
      toast({
        title: "Success",
        description: "Login successful! Redirecting to dashboard...",
        variant: "default",
      })
      console.log("Redirecting to /admin/dashboard")
      router.push("/admin/dashboard")
      return
    } catch (error) {
      console.error('Login error:', error)
      setLoginStatus("error")
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid username or password. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="w-full max-w-lg shadow-xl border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">Admin Login</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-6">
            <RobotAnimation state={robotState} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                  {...register("username")}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("none")}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  {...register("password")}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("none")}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginStatus === "error" && (
              <Alert
                variant="destructive"
                className="bg-red-500 text-white border-red-700 font-bold"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Invalid username or password. Please try again.</AlertDescription>
              </Alert>
            )}

            {loginStatus === "success" && (
              <Alert className="bg-green-500/20 text-green-600 border-green-500">
                <AlertDescription>Login successful! Redirecting to dashboard...</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loginStatus === "loading"}>
              {loginStatus === "loading" ? (
                <>
                  <motion.div
                    className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail, MapPin, Twitter, Facebook, Instagram, Globe } from "lucide-react"
import { Profile, apiService } from "@/lib/api"

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const defaultProfile: Profile = {
    name: "Muhammad Salman Abid",
    title: "Backend Developer",
    city: "Kota Pekalongan, Indonesia",
    tagline: "Experienced Backend Developer with 5+ years specializing in telecommunications solutions, creating scalable and efficient technical solutions to drive business innovation.",
    aboutMe: "Backend Developer with over 5 years of experience at Telkom Indonesia, specializing in telecommunications solutions development.",
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-05-09%20at%2013.09.10-tvWPOSeUwOSidDJ5QlfBqr1ZdbaHEt.jpeg",
    socialMedia: [
      { type: "linkedin", url: "https://linkedin.com/in/muhsalmanabid" },
      { type: "github", url: "https://github.com/muhsalmanabid" },
      { type: "email", url: "muhsalmanabid@gmail.com" },
      { type: "twitter", url: "https://twitter.com/muhsalmanabid" },
    ]
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.getProfile()
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfile(defaultProfile)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    const colors = ["#00d1b2", "#0074d9", "#f0b90b"]

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    function animate() {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x > canvas.width) p.x = 0
        if (p.x < 0) p.x = canvas.width
        if (p.y > canvas.height) p.y = 0
        if (p.y < 0) p.y = canvas.height

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 209, 178, ${1 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const socialLinks = profile?.socialMedia || defaultProfile.socialMedia

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-1 w-12 bg-cyan-400"></div>
              <span className="text-cyan-400 font-medium">{profile?.title || defaultProfile.title}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {profile?.name.split(' ').slice(0, -1).join(' ')}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {profile?.name.split(' ').pop() || defaultProfile.name.split(' ').pop()}
              </span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              {profile?.tagline || defaultProfile.tagline}
            </p>

            <div className="flex items-center space-x-4 mb-8">
              {socialLinks.map((link) => {
                let Icon
                switch (link.type) {
                  case "linkedin":
                    Icon = Linkedin
                    break
                  case "github":
                    Icon = Github
                    break
                  case "email":
                    Icon = Mail
                    break
                  case "twitter":
                  case "x":
                    Icon = Twitter
                    break
                  case "facebook":
                    Icon = Facebook
                    break
                  case "instagram":
                    Icon = Instagram
                    break
                  default:
                    Icon = Globe
                }

                return (
                  <a
                    key={link.type}
                    href={link.type === "email" ? `mailto:${link.url}` : link.url}
                    target={link.type === "email" ? undefined : "_blank"}
                    rel={link.type === "email" ? undefined : "noopener noreferrer"}
                    className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                    aria-label={link.type}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary">
                Contact Me
              </a>
              <a
                href="#about"
                className="px-6 py-3 border border-gray-700 text-white font-medium rounded-lg transition-all duration-300 hover:border-cyan-500 hover:text-cyan-400 flex items-center justify-center"
              >
                Learn More
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
                <Image
                  src={profile?.photo || defaultProfile.photo}
                  alt={profile?.name || defaultProfile.name}
                  fill
                  sizes="(max-width: 768px) 16rem, 20rem"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-2 rounded-full border border-gray-700 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">{profile?.city || defaultProfile.city}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a
          href="#about"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-cyan-500 transition-colors"
          aria-label="Scroll down"
        >
          <ArrowDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { apiService, type Project } from "@/lib/api"

const defaultProjects: Project[] = [
  {
    _id: "1",
    name: "STAR - Automation Bot Builder",
    description:
      "Developed an AI-based solution that simplifies bot creation without coding, accelerating automation processes by 40%. Combines natural language processing and visual interfaces for automated tasks like data scraping and digital workflows.",
    techStack: ["AI", "NLP", "RPA", "Automation"],
    url: "https://star.biasaaja.cloud",
    startDate: "2025-01-01",
    endDate: null,
    current: true,
    // @ts-expect-error: award is not in Project type but used for display
    award: "AIGNITE - Telkom AI Challenge 2025",
  },
  {
    _id: "2",
    name: "Mancing Pak",
    description:
      "Developed during ICP Hacker House Bali, this innovative app combines physical-digital fishing experiences using Motoko and TypeScript, connecting physical fishing devices with digital interfaces via smart contracts.",
    techStack: ["Motoko", "TypeScript", "Smart Contracts", "ICP"],
    url: "#",
    startDate: "2024-08-01",
    endDate: null,
    current: false,
    // @ts-expect-error: award is not in Project type but used for display
    award: "ICP Hacker House BALI - August 2024",
  },
  {
    _id: "3",
    name: "IRPIN (Irigasi Pintar)",
    description:
      "IoT-based agricultural irrigation system that monitors groundwater depth in real-time with ±2cm accuracy using ultrasonic sensors, featuring water requirement prediction algorithms and data visualization dashboard.",
    techStack: ["IoT", "Arduino", "LoRaWAN", "Cloud Computing"],
    url: "#",
    startDate: "2018-09-01",
    endDate: "2018-12-01",
    current: false,
    // @ts-expect-error: award is not in Project type but used for display
    award: "Top 10 IoT Competition Telkom - September 2018",
  },
]

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.getProjects(1, 10)
        if (response.data.data && response.data.data.length > 0) {
          setProjects(response.data.data)
        }
      } catch (error) {
        setProjects(defaultProjects)
      }
    }
    fetchProjects()
  }, [])

  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card flex flex-col h-full"
            >
              <div className="mb-4">
                {(project as any).award && (
                  <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                    {(project as any).award}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3">{project.name}</h3>

              <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>

              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-auto">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span>Live Demo</span>
                </a>
                <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Github className="h-4 w-4 mr-1" />
                  <span>Source Code</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

export default function Projects() {
  const projects = [
    {
      title: "STAR - Automation Bot Builder",
      description:
        "Developed an AI-based solution that simplifies bot creation without coding, accelerating automation processes by 40%. Combines natural language processing and visual interfaces for automated tasks like data scraping and digital workflows.",
      technologies: ["AI", "NLP", "RPA", "Automation"],
      award: "AIGNITE - Telkom AI Challenge 2025",
      link: "https://star.biasaaja.cloud",
    },
    {
      title: "Mancing Pak",
      description:
        "Developed during ICP Hacker House Bali, this innovative app combines physical-digital fishing experiences using Motoko and TypeScript, connecting physical fishing devices with digital interfaces via smart contracts.",
      technologies: ["Motoko", "TypeScript", "Smart Contracts", "ICP"],
      award: "ICP Hacker House BALI - August 2024",
      link: "#",
    },
    {
      title: "IRPIN (Irigasi Pintar)",
      description:
        "IoT-based agricultural irrigation system that monitors groundwater depth in real-time with ±2cm accuracy using ultrasonic sensors, featuring water requirement prediction algorithms and data visualization dashboard.",
      technologies: ["IoT", "Arduino", "LoRaWAN", "Cloud Computing"],
      award: "Top 10 IoT Competition Telkom - September 2018",
      link: "#",
    },
  ]

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
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card flex flex-col h-full"
            >
              <div className="mb-4">
                <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                  {project.award}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{project.title}</h3>

              <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>

              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-auto">
                <a
                  href={project.link}
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

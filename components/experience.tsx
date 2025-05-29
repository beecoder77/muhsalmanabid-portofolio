"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { Experience as ExperienceType, apiService } from "@/lib/api"

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const defaultExperiences = [
    {
      _id: "default",
      title: "Backend Developer",
      company: "Telkom Indonesia",
      location: "Jakarta, Indonesia",
      startDate: "2020-08-01T00:00:00.000Z",
      endDate: "2025-03-01T00:00:00.000Z",
      description: [
        "Fitur POI (Point of Interest): Merancang fitur identifikasi lead berbasis Google Maps di seluruh Indonesia, meningkatkan potensi lead sebesar 30% dan memperoleh Jutaan pelanggan UMKM baru.",
        "Fitur Underspec dan Gaul (Gangguan Berulang): Membantu teknisi menganalisis Ratusan tiket gangguan/bulan, mendeteksi masalah jaringan 70% lebih cepat, dan meningkatkan kepuasan pelanggan hingga 90%.",
        "Platform Approval Management: Menyederhanakan proses persetujuan proyek dengan pengurangan waktu approval dari 30 hari → 5 hari, serta meningkatkan koordinasi antar 10+ tim.",
        "Pengembangan Website MyCarrier: Membangun landing page & portal pelanggan yang meningkatkan konversi lead sebesar 25% dan memangkas waktu update konten produk via CMS hingga 50%.",
        "Lead Management System: Berkontribusi pada sistem yang mengkonversi 1000+ lead/tahun menjadi proyek, mendorong pertumbuhan pendapatan Telkom.",
      ],
      current: false,
    },
  ]

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await apiService.getExperiences(1, 10)
        setExperiences(response.data.data)
      } catch (error) {
        console.error('Error fetching experiences:', error)
        setExperiences(defaultExperiences)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <section id="experience" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Work Experience</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading experiences...</div>
          ) : (
            experiences.map((exp) => (
            <motion.div
                key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                  <h4 className="text-xl text-cyan-400 font-medium">{exp.company}</h4>
                </div>
                <div className="mt-2 md:mt-0">
                  <div className="flex items-center text-gray-400 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                      <span>{`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-lg font-semibold mb-4 text-gray-200">Key Achievements:</h5>
                <ul className="space-y-4">
                    {exp.description.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="timeline-item pl-8"
                    >
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Award } from "lucide-react"
import { apiService, type Education as EducationType } from "@/lib/api"

const defaultEducations: EducationType[] = [
  {
    _id: "1",
    type: "education",
    publisher: "Binus University",
    title: "Teknik Informatika",
    city: "Jakarta, Indonesia",
    startDate: "2024-01-01",
    endDate: "2028-01-01",
    description: "Saat ini sedang menempuh pendidikan S1 Teknik Informatika di Binus University (2024-sekarang)",
  },
  {
    _id: "2",
    type: "certification",
    publisher: "PT Ekipa Agile Consultancy",
    title: "Certified Indonesia Scrum Master (ISM) I",
    startDate: "2020-01-01",
    description: "Sertifikasi ini memperkuat pemahaman saya dalam penerapan metodologi Scrum di lingkungan pengembangan Agile. Dengan pelatihan berbasis studi kasus dunia nyata, saya terlatih untuk memfasilitasi tim multidisplin, menghilangkan hambatan proses, dan memastikan deliver produk sesuai iterasi yang efisien.",
  },
]

export default function Education() {
  const [educations, setEducations] = useState<EducationType[]>(defaultEducations)

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const response = await apiService.getEducations()
        if (response.data.data && response.data.data.length > 0) {
          setEducations(response.data.data)
        }
      } catch (error) {
        setEducations(defaultEducations)
      }
    }
    fetchEducations()
  }, [])

  return (
    <section id="education" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Education & Certifications</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {educations.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, x: item.type === 'education' ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex items-start">
                <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                  {item.type === 'education' ? (
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                  ) : (
                    <Award className="h-6 w-6 text-cyan-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-cyan-400 font-medium mb-2">{item.publisher}</p>
                  <p className="text-gray-400 mb-4">
                    {item.type === 'education'
                      ? `${item.city ? item.city + ' ' : ''}(${item.startDate?.slice(0, 4)} - ${item.endDate?.slice(0, 4)})`
                      : item.startDate?.slice(0, 4)}
                  </p>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

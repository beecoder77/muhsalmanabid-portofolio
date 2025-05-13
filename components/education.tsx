"use client"

import { motion } from "framer-motion"
import { BookOpen, Award } from "lucide-react"

export default function Education() {
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-start">
              <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Teknik Informatika</h3>
                <p className="text-cyan-400 font-medium mb-2">Binus University</p>
                <p className="text-gray-400 mb-4">Jakarta, Indonesia (2024 - 2028)</p>
                <p className="text-gray-300">
                  Saat ini sedang menempuh pendidikan S1 Teknik Informatika di Binus University (2024-sekarang)
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card"
          >
            <div className="flex items-start">
              <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                <Award className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Certified Indonesia Scrum Master (ISM) I</h3>
                <p className="text-cyan-400 font-medium mb-2">PT Ekipa Agile Consultancy</p>
                <p className="text-gray-400 mb-4">2020</p>
                <p className="text-gray-300">
                  Sertifikasi ini memperkuat pemahaman saya dalam penerapan metodologi Scrum di lingkungan pengembangan
                  Agile. Dengan pelatihan berbasis studi kasus dunia nyata, saya terlatih untuk memfasilitasi tim
                  multidisplin, menghilangkan hambatan proses, dan memastikan deliver produk sesuai iterasi yang
                  efisien.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

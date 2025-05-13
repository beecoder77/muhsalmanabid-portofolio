"use client"

import { motion } from "framer-motion"
import { Code, Server, Database, Cpu } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
          I am a seasoned Backend Developer with 5 years of professional experience crafting robust and scalable server-side solutions. Throughout my journey, I've developed a deep expertise in building high-performance systems, RESTful APIs, and microservices architectures. My passion lies in solving complex technical challenges and implementing efficient solutions that drive business growth. I specialize in modern technologies like Node.js, TypeScript, and Golang, with a strong foundation in database management and system design. I'm constantly learning and adapting to new technologies while maintaining a focus on writing clean, maintainable, and well-documented code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Code className="h-10 w-10 text-cyan-400" />,
              title: "Backend Development",
              description:
                "Expertise in building robust backend systems using JavaScript, TypeScript, Node.js, and Golang.",
            },
            {
              icon: <Server className="h-10 w-10 text-cyan-400" />,
              title: "API Development",
              description: "Creating efficient and secure APIs that power modern web and mobile applications.",
            },
            {
              icon: <Database className="h-10 w-10 text-cyan-400" />,
              title: "Database Management",
              description: "Experience with MongoDB, MySQL, and PostgreSQL for efficient data storage and retrieval.",
            },
            {
              icon: <Cpu className="h-10 w-10 text-cyan-400" />,
              title: "System Architecture",
              description:
                "Designing scalable system architectures using microservices, Kafka, and cloud technologies.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card flex flex-col items-center text-center p-8"
            >
              <div className="mb-6 p-4 bg-gray-800 rounded-full">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

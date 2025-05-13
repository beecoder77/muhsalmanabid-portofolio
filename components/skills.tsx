"use client"

import { motion } from "framer-motion"

export default function Skills() {
  const skills = {
    "Programming Languages": ["JavaScript", "TypeScript", "Golang"],
    "Backend Technologies": ["Node.js", "Express.js", "RESTful APIs", "GraphQL"],
    Databases: ["MongoDB", "MySQL", "PostgreSQL"],
    "DevOps & Tools": ["Kafka", "Elastic", "Logstash", "Kibana", "Datadog", "Grafana"],
    Methodologies: ["Agile", "Scrum", "Microservices Architecture"],
  }

  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Technical Skills</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, skillList], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-6 text-cyan-400">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="skill-tag"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 card p-8 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">Skill Proficiency</h3>

          {[
            { name: "JavaScript/TypeScript", percentage: 90 },
            { name: "Node.js", percentage: 85 },
            { name: "Golang", percentage: 80 },
            { name: "Database Management", percentage: 85 },
            { name: "System Architecture", percentage: 75 },
          ].map((skill, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-cyan-400">{skill.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

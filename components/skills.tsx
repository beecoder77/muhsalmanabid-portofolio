"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { apiService, type Skill, type Proficiency } from "@/lib/api"

const defaultSkills: Skill[] = [
  { _id: "1", id: 1, name: "JavaScript", category: "Programming Languages", level: 5, description: "" },
  { _id: "2", id: 2, name: "TypeScript", category: "Programming Languages", level: 5, description: "" },
  { _id: "3", id: 3, name: "Golang", category: "Programming Languages", level: 4, description: "" },
  { _id: "4", id: 4, name: "Node.js", category: "Backend Technologies", level: 5, description: "" },
  { _id: "5", id: 5, name: "Express.js", category: "Backend Technologies", level: 5, description: "" },
  { _id: "6", id: 6, name: "RESTful APIs", category: "Backend Technologies", level: 5, description: "" },
  { _id: "7", id: 7, name: "GraphQL", category: "Backend Technologies", level: 4, description: "" },
  { _id: "8", id: 8, name: "MongoDB", category: "Databases", level: 5, description: "" },
  { _id: "9", id: 9, name: "MySQL", category: "Databases", level: 4, description: "" },
  { _id: "10", id: 10, name: "PostgreSQL", category: "Databases", level: 4, description: "" },
  { _id: "11", id: 11, name: "Kafka", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "12", id: 12, name: "Elastic", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "13", id: 13, name: "Logstash", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "14", id: 14, name: "Kibana", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "15", id: 15, name: "Datadog", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "16", id: 16, name: "Grafana", category: "DevOps & Tools", level: 3, description: "" },
  { _id: "17", id: 17, name: "Agile", category: "Methodologies", level: 5, description: "" },
  { _id: "18", id: 18, name: "Scrum", category: "Methodologies", level: 5, description: "" },
  { _id: "19", id: 19, name: "Microservices Architecture", category: "Methodologies", level: 4, description: "" },
]

const defaultProficiencies: Proficiency[] = [
  { _id: "1", id: 1, skill: "JavaScript/TypeScript", value: 90, description: "" },
  { _id: "2", id: 2, skill: "Node.js", value: 85, description: "" },
  { _id: "3", id: 3, skill: "Golang", value: 80, description: "" },
  { _id: "4", id: 4, skill: "Database Management", value: 85, description: "" },
  { _id: "5", id: 5, skill: "System Architecture", value: 75, description: "" },
]

function groupSkillsByCategory(skills: Skill[]) {
  return skills.reduce<Record<string, string[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill.name)
    return acc
  }, {})
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const [proficiencies, setProficiencies] = useState<Proficiency[]>(defaultProficiencies)

  useEffect(() => {
    const fetchSkillsAndProficiencies = async () => {
      try {
        const [skillsRes, profRes] = await Promise.all([
          apiService.getSkills(1, 100),
          apiService.getProficiencies(),
        ])
        if (skillsRes.data.data && skillsRes.data.data.length > 0) {
          setSkills(skillsRes.data.data)
        }
        if (profRes.data && profRes.data.length > 0) {
          setProficiencies(profRes.data)
        }
      } catch (e) {
        setSkills(defaultSkills)
        setProficiencies(defaultProficiencies)
      }
    }
    fetchSkillsAndProficiencies()
  }, [])

  const groupedSkills = groupSkillsByCategory(skills)

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
          {Object.entries(groupedSkills).map(([category, skillList], index) => (
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

          {proficiencies.map((skill, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.skill}</span>
                <span className="text-cyan-400">{skill.value}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
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

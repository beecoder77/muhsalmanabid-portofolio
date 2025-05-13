import { Suspense } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Education from "@/components/education"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import HexagonBackground from "@/components/hexagon-background"
import Loading from "@/components/loading"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <HexagonBackground />

      <Header />

      <Suspense fallback={<Loading />}>
        <Hero />
      </Suspense>

      <div className="container mx-auto px-4 py-16 space-y-32">
        <Suspense fallback={<Loading />}>
          <About />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <Education />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <Contact />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}

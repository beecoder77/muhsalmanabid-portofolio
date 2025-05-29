export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">&copy; {currentYear} Muhammad Salman Abid. All rights reserved.</p>
          </div>

          <div className="flex space-x-6">
            <a href="#home" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-400 hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#experience" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Experience
            </a>
            <a href="#contact" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

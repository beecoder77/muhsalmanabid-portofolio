"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, Facebook, Instagram, Globe } from "lucide-react"
import { apiService, Profile } from "@/lib/api"

// Default contact values (fallback)
const defaultContact: Pick<Profile, 'emails' | 'phoneNumbers' | 'socialMedia'> = {
  emails: ["muhsalmanabid@gmail.com"],
  phoneNumbers: ["+6285157519229"],
  socialMedia: [
    { type: "linkedin", url: "https://linkedin.com/in/muhsalmanabid" },
    { type: "github", url: "https://github.com/muhsalmanabid" },
    { type: "github", url: "https://github.com/muhsalmanabid" },
    { type: "twitter", url: "https://twitter.com/muhsalmanabid" }
  ],
}

export default function Contact() {
  const [contact, setContact] = useState(defaultContact)

  useEffect(() => {
    apiService.getProfile()
      .then(res => {
        setContact({
          emails: res.data?.emails || defaultContact.emails,
          phoneNumbers: res.data?.phoneNumbers || defaultContact.phoneNumbers,
          socialMedia: res.data?.socialMedia || defaultContact.socialMedia,
        })
      })
      .catch(() => setContact(defaultContact))
  }, [])

  const handleSocialClick = async (type: string) => {
    try {
      await apiService.updateContactCounts({ type: 'socialMedia', count: contact.socialMedia.length });
    } catch (error) {
      console.error('Error updating social media count:', error);
    }
  };

  const handlePhoneClick = async () => {
    try {
      await apiService.updateContactCounts({ type: 'phoneNumbers', count: contact.phoneNumbers.length });
    } catch (error) {
      console.error('Error updating phone count:', error);
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-gray-300">
            Feel free to reach out if you're looking for a developer, have a question, or just want to connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

            <div className="space-y-6 text-center lg:text-left">
              {contact.emails.length > 0 && (
                <div className="flex items-start justify-center lg:justify-start">
                  <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">Email</h4>
                    {contact.emails.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="block text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {contact.phoneNumbers.length > 0 && (
                <div className="flex items-start justify-center lg:justify-start">
                  <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">WhatsApp</h4>
                    {contact.phoneNumbers.map((phone, index) => {
                      // Remove non-digit characters for wa.me
                      const waNumber = phone.replace(/\D/g, "");
                      const waUrl = `https://wa.me/${waNumber}?text=Halo%20Salman%2C%20saya%20tertarik%20dengan%20portofolio%20Anda`;
                      return (
                        <a
                          key={`wa-${waNumber}-${index}`}
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handlePhoneClick}
                          className="block text-gray-300 hover:text-cyan-400 transition-colors"
                        >
                          {phone}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-start justify-center lg:justify-start">
                <div className="p-3 bg-cyan-400/20 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Location</h4>
                  <p className="text-gray-300">Kota Pekalongan, Jawa Tengah, Indonesia</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {/* WhatsApp untuk semua phoneNumbers */}
                {contact.phoneNumbers.map((phone, idx) => {
                  const waNumber = phone.replace(/\D/g, "");
                  const waUrl = `https://wa.me/${waNumber}?text=Halo%20Salman%2C%20saya%20tertarik%20dengan%20portofolio%20Anda`;
                  return (
                    <a
                      key={`wa-${waNumber}-${idx}`}
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handlePhoneClick}
                      className="p-3 bg-gray-800 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 icon"
                      aria-label="whatsapp"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z" fill="#25D366"/>
                      </svg>
                    </a>
                  );
                })}
                {/* Social Media (skip email, skip url with @) */}
                {contact.socialMedia
                  .filter((social) =>
                    social.type.toLowerCase() !== 'email' &&
                    !(social.url && social.url.includes('@'))
                  )
                  .map((social, index) => {
                    let Icon
                    let bgHoverClass

                    switch (social.type) {
                      case "linkedin":
                        Icon = Linkedin
                        bgHoverClass = "hover:bg-blue-600"
                        break
                      case "github":
                        Icon = Github
                        bgHoverClass = "hover:bg-gray-700"
                        break
                      case "twitter":
                      case "x":
                        Icon = Twitter
                        bgHoverClass = "hover:bg-blue-400"
                        break
                      case "facebook":
                        Icon = Facebook
                        bgHoverClass = "hover:bg-blue-700"
                        break
                      case "instagram":
                        Icon = Instagram
                        bgHoverClass = "hover:bg-pink-600"
                        break
                      default:
                        Icon = Globe
                        bgHoverClass = "hover:bg-gray-600"
                    }

                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleSocialClick(social.type)}
                        className={`p-3 bg-gray-800 rounded-lg ${bgHoverClass} transition-colors flex items-center gap-2`}
                        aria-label={social.type}
                      >
                        <Icon className="h-5 w-5" />
                        {typeof (social as any).username === 'string' && (social as any).username && (
                          <span className="text-sm">{(social as any).username}</span>
                        )}
                      </a>
                    )
                  })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

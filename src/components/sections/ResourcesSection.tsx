'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLazyVideoThumb } from '@/hooks/useLazyVideoThumb'
import { Download, FileText, CheckCircle2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type BrochureFormState = {
  fullName: string
  email: string
  organization: string
  country: string
  language: 'EN' | 'FR'
}

const INITIAL_STATE: BrochureFormState = {
  fullName: '',
  email: '',
  organization: '',
  country: '',
  language: 'EN',
}

export function ResourcesSection() {
  const [form, setForm] = useState<BrochureFormState>(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)
  const [videoLanguage, setVideoLanguage] = useState<'EN' | 'FR' | 'AR'>('EN')

  const videoSources: Record<'EN' | 'FR' | 'AR', { label: string; src: string }> = {
    EN: { label: 'English', src: '/videos/aurora-masterpiece-en.mp4' },
    FR: { label: 'Français', src: '/videos/aurora-masterpiece-fr.mp4' },
    AR: { label: 'العربية', src: '/videos/aurora-masterpiece-ar.mp4' },
  }

  const { containerRef: videoContainerRef, isInView: videoInView, posterUrl: videoPoster } =
    useLazyVideoThumb(videoSources[videoLanguage].src, 3)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const onFieldChange = (key: keyof BrochureFormState, value: string) => {
    setSubmitted(false)
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  return (
    <section id="resources" className="py-28 md:py-36 bg-[#08080d] relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[#c9844a] text-sm tracking-[0.3em] uppercase mb-5 font-medium">
            Resources
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-7 text-white">
            Brochures And <span className="aurora-gradient">Media</span>
          </h2>
          <p className="text-[#a0a0b0] font-light max-w-3xl mx-auto leading-relaxed text-lg">
            Share your details to unlock Aurora OSI brochures in English and French. The video player
            area is now ready and will go live as soon as your final video is provided.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="aurora-border bg-[#0a0a10]/80 rounded-xl p-7 md:p-9"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#c9844a]" />
              <h3 className="text-2xl font-semibold text-white">Download Aurora Brochure</h3>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-[#d8d8df]">Full Name</Label>
                  <Input
                    id="fullName"
                    required
                    value={form.fullName}
                    onChange={(event) => onFieldChange('fullName', event.target.value)}
                    className="h-11 bg-[#12121b] border-[#2c2c3a] text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#d8d8df]">Email</Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => onFieldChange('email', event.target.value)}
                    className="h-11 bg-[#12121b] border-[#2c2c3a] text-white"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-[#d8d8df]">Organization</Label>
                  <Input
                    id="organization"
                    required
                    value={form.organization}
                    onChange={(event) => onFieldChange('organization', event.target.value)}
                    className="h-11 bg-[#12121b] border-[#2c2c3a] text-white"
                    placeholder="Organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-[#d8d8df]">Country</Label>
                  <Input
                    id="country"
                    required
                    value={form.country}
                    onChange={(event) => onFieldChange('country', event.target.value)}
                    className="h-11 bg-[#12121b] border-[#2c2c3a] text-white"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-[#d8d8df]">Preferred brochure language</Label>
                <select
                  id="language"
                  value={form.language}
                  onChange={(event) => onFieldChange('language', event.target.value as 'EN' | 'FR')}
                  className="w-full h-11 px-3 rounded-md bg-[#12121b] border border-[#2c2c3a] text-white"
                >
                  <option value="EN">English</option>
                  <option value="FR">Français</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#c9844a] hover:bg-[#d4a574] text-[#050508] font-semibold tracking-wide"
              >
                Unlock Brochure Downloads
              </Button>
            </form>

            {submitted && (
              <div className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-300 text-sm mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Thank you. Your brochures are ready.
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a href="/brochures/aurora-osi-brochure-en.pdf" download>
                    <Button variant="outline" className="w-full border-[#c9844a]/50 text-white hover:bg-[#c9844a]/15">
                      <Download className="w-4 h-4 mr-2" />
                      English PDF
                    </Button>
                  </a>
                  <a href="/brochures/aurora-osi-brochure-fr.pdf" download>
                    <Button variant="outline" className="w-full border-[#c9844a]/50 text-white hover:bg-[#c9844a]/15">
                      <Download className="w-4 h-4 mr-2" />
                      Français PDF
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="aurora-border bg-[#0a0a10]/80 rounded-xl p-5 md:p-6">
              <div className="relative overflow-hidden rounded-lg border border-[#2c2c3a] bg-[#10101a]">
                <Image
                  src="/assets/aurora-scan-3d.png"
                  alt="Aurora subsurface visualization collage"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority={false}
                />
              </div>
              <p className="text-[#a0a0b0] text-sm mt-4 leading-relaxed">
                Visual showcase: AOI heat response, interpretive subsurface model, and inversion-grade concept views.
              </p>
            </div>

            <div className="aurora-border bg-[#0a0a10]/80 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Video className="w-6 h-6 text-[#c9844a]" />
                <h3 className="text-2xl font-semibold text-white">Aurora Video</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['EN', 'FR', 'AR'] as const).map((lang) => (
                  <Button
                    key={lang}
                    type="button"
                    variant={videoLanguage === lang ? 'default' : 'outline'}
                    className={
                      videoLanguage === lang
                        ? 'bg-[#c9844a] hover:bg-[#d4a574] text-[#050508]'
                        : 'border-[#c9844a]/50 text-white hover:bg-[#c9844a]/15'
                    }
                    onClick={() => setVideoLanguage(lang)}
                  >
                    {videoSources[lang].label}
                  </Button>
                ))}
              </div>

              <div ref={videoContainerRef} className="aspect-video rounded-lg overflow-hidden border border-[#2c2c3a] bg-[#06060b]">
                <video
                  key={videoSources[videoLanguage].src}
                  controls
                  preload={videoInView ? 'metadata' : 'none'}
                  poster={videoPoster ?? undefined}
                  className="w-full h-full"
                >
                  {videoInView && (
                    <source src={videoSources[videoLanguage].src} type="video/mp4" />
                  )}
                  Your browser does not support HTML5 video.
                </video>
              </div>
              <p className="text-[#a0a0b0] text-sm mt-3">
                Now playing: <span className="text-white font-medium">{videoSources[videoLanguage].label}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

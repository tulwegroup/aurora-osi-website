'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { OffersSection } from '@/components/sections/OffersSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { ArchitectureSection } from '@/components/sections/ArchitectureSection'
import { WhoWeServeSection } from '@/components/sections/WhoWeServeSection'
import { PlatformSection } from '@/components/sections/PlatformSection'
import { ApplicationsSection } from '@/components/sections/ApplicationsSection'
import { DigitalTwinSection } from '@/components/sections/DigitalTwinSection'
import { EngagementSection } from '@/components/sections/EngagementSection'
import { ResourcesSection } from '@/components/sections/ResourcesSection'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Latest Round of Offers — hydrogen + lithium AOIs, access tiers, CTA */}
        <OffersSection />

        {/* About Section - What Aurora Is */}
        <AboutSection />
        
        {/* Core Architecture Pillars */}
        <ArchitectureSection />
        
        {/* Who We Serve */}
        <WhoWeServeSection />
        
        {/* Platform Section */}
        <PlatformSection />
        
        {/* Applications Section */}
        <ApplicationsSection />
        
        {/* Digital Twin Section */}
        <DigitalTwinSection />

        {/* Resources (Brochures + Video) */}
        <ResourcesSection />
        
        {/* Strategic Engagement Section */}
        <EngagementSection />
      </main>
      
      <Footer />
    </div>
  )
}

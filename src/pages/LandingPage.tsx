import React, { useState } from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProofBar } from '../components/landing/SocialProofBar';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionSection } from '../components/landing/SolutionSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function LandingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen font-sans antialiased">
      <LandingNav />
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection billing={billing} onBillingChange={setBilling} />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}

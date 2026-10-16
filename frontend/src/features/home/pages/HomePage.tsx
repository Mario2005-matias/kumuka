import { AudienceSection } from '../components/AudienceSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { FinalCTASection } from '../components/FinalCTASection';
import { HeroSection } from '../components/HeroSection';
import { HomeFooter } from '../components/HomeFooter';
import { JourneySection } from '../components/JourneySection';
import { StatsSection } from '../components/StatsSection';
import { WhatIsSection } from '../components/WhatIsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhatIsSection />
      <JourneySection />
      <FeaturesSection />
      <AudienceSection />
      <StatsSection />
      <FinalCTASection />
      <HomeFooter />
    </main>
  );
}

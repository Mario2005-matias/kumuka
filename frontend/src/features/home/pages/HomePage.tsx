import { AudienceSection } from '../components/AudienceSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { FinalCTASection } from '../components/FinalCTASection';
import { HomeFooter } from '../components/HomeFooter';
import { HeroSection } from '../components/HeroSection';
import { JourneySection } from '../components/JourneySection';
import { WhatIsSection } from '../components/WhatIsSection';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <WhatIsSection />
        <JourneySection />
        <FeaturesSection />
        <AudienceSection />
        <FinalCTASection />
      </main>
      <HomeFooter />
    </>
  );
}

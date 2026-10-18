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
    <>
      <main>
        <HeroSection />
        <WhatIsSection />
        <JourneySection />
        <FeaturesSection />
        <AudienceSection />
        <StatsSection />
        <FinalCTASection />
      </main>
      <div className="bg-background/50 border-t border-border/50 py-4 text-center text-muted-foreground">
        <h1 className="text-[clamp(3rem,22vw,30rem)] font-black leading-none tracking-tighter">
          KUMUKA
        </h1>
      </div>
      <HomeFooter />
    </>
  );
}

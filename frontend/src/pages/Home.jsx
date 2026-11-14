import Hero from "../components/landing/Hero";
import ProofConstellation from "../components/landing/ProofConstellation";
import HowItWorks from "../components/landing/HowItWorks";
import FlagshipDemo from "../components/landing/FlagshipDemo";
import Pathways from "../components/landing/Pathways";
import FinalCta from "../components/landing/FinalCta";
import Stack from "../components/ui/Stack";

export default function Home() {
  return (
    <Stack gap="none">
      <Hero />
      <ProofConstellation />
      <div className="relative py-20 lg:py-28">
        <HowItWorks />
      </div>
      <div className="relative border-y border-electric/10 bg-abyss/40 py-20 lg:py-28">
        <FlagshipDemo />
      </div>
      <div className="relative py-20 lg:py-28">
        <Pathways />
      </div>
      <div className="relative pb-24 lg:pb-32">
        <FinalCta />
      </div>
    </Stack>
  );
}


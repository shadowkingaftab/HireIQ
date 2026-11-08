import Hero from "../components/landing/Hero";
import ProofNetwork from "../components/landing/ProofNetwork";
import TrustStrip from "../components/landing/TrustStrip";
import HowItWorks from "../components/landing/HowItWorks";
import FlagshipDemo from "../components/landing/FlagshipDemo";
import Pathways from "../components/landing/Pathways";
import FinalCta from "../components/landing/FinalCta";
import Stack from "../components/ui/Stack";

export default function Home() {
  return (
    <Stack gap="none">
      <Hero />
      <div className="relative z-[1] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TrustStrip />
      </div>
      <ProofNetwork />
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

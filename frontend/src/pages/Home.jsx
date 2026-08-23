import Hero from "../components/landing/Hero";
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TrustStrip />
      </div>
      <div className="py-20 lg:py-28">
        <HowItWorks />
      </div>
      <div className="border-t border-line-subtle bg-surface-1/40 py-20 lg:py-28">
        <FlagshipDemo />
      </div>
      <div className="py-20 lg:py-28">
        <Pathways />
      </div>
      <div className="pb-24 lg:pb-32">
        <FinalCta />
      </div>
    </Stack>
  );
}

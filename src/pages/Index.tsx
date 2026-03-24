import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ServicesSection from "@/components/landing/ServicesSection";
import PortfolioSection from "@/components/landing/PortfolioSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function Index() {
  return (
    <div className="min-h-screen luxury-gradient">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ServicesSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
      <footer className="border-t border-border/20 py-8 px-4 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} AIThenticLabs. Crafting the future, one innovation at a time.
      </footer>
    </div>
  );
}

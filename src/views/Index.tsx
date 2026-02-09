import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <FeaturesGrid />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

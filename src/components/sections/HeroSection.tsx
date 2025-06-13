import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/background_v1.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="section-container z-10 pt-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-graphite mb-6 leading-tight animate-fade-in border-b-2 border-slate-graphite/20 pb-4">
            Transform Your Business with Safe, Strategic AI
          </h1>
          <p className="text-lg md:text-xl text-slate-graphite mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Advisory and implementation services from a world-class AI expert. 
            Navigate the future with confidence and clarity.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              onClick={scrollToContact}
              className="bg-slate-indigo hover:bg-slate-indigo/90 text-white text-lg px-8 py-6 transition-colors duration-300"
            >
              Book a Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

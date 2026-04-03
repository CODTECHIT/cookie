import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Cookie, Leaf, Truck, Container, ShieldCheck, 
  ArrowRight, CheckCircle2, Star, Target, Zap
} from 'lucide-react';

const Services = () => {
  const heroImg = "/assets/services-hero.png";
  const qualityImg = "/assets/quality-check.png";
  const packagingImg = "/assets/premium-packaging.png";
  const milletImg = "/assets/millet-powder.png";

  return (
    <div className="bg-background min-h-screen font-sans text-on-surface antialiased overflow-x-hidden">
      <SEO 
        title="Our Services | Premium Cookie Manufacturing & Millet Processing"
        description="Daksha Food Artisan offers high-quality cookie manufacturing, millet processing, bulk orders, and wholesale solutions. Order custom gift packaging for weddings, corporate events, and special occasions. Free shipping above ₹999."
        keywords="cookie manufacturing, millet processing, bulk orders, wholesale cookies, corporate gifting, wedding cookies, custom packaging, artisanal bakery, bulk supply India"
      />

      {/* 🚀 PROFESSIONAL HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-44 pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={heroImg} 
            alt="Artisanal Bakery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[0.5px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex px-4 py-1 bg-secondary text-primary rounded-md font-black uppercase tracking-[0.4em] text-[9px] border border-white/10">
                    Artisanal Standard
                </div>
                
                <h1 className="text-4xl md:text-6xl font-serif font-black text-white italic leading-tight tracking-tight drop-shadow-lg">
                    Services We <br /> <span className="text-secondary-fixed">Provide.</span>
                </h1>
                
                <p className="text-sm md:text-lg text-white/90 italic font-medium leading-relaxed max-w-lg mx-auto opacity-80">
                    Comprehensive artisanal solutions ensuring quality, convenience, and customer satisfaction across every batch.
                </p>

                <div className="flex justify-center pt-6">
                    <a href="#major-offerings" className="bg-secondary text-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:-translate-y-1 transition-all active:scale-95 group flex items-center gap-3">
                        Discover More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
      </section>

      {/* 📸 COMPACT OFFERINGS GRID */}
      <section id="major-offerings" className="py-16 md:py-24 container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 space-y-2">
            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[9px] block">Premium Excellence</span>
            <h2 className="text-2xl md:text-4xl font-serif font-black text-primary italic leading-none">Main Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PhotoServiceCard 
                 img={qualityImg}
                 title="Artisan Cookies"
                 desc="Premium Ingredients"
                 brief="Crafted with pure cashew powder for a rich taste and superior artisanal quality."
            />
            <PhotoServiceCard 
                 img={milletImg}
                 title="Millet Powder"
                 desc="Hygienic Processing"
                 brief="Nutrient-rich millet powders processed naturally for a vibrant lifestyle."
            />
            <PhotoServiceCard 
                 img={packagingImg}
                 title="Wholesale Supply"
                 desc="Customized Solutions"
                 brief="Reliable large-scale supply with consistent quality for your boutique needs."
            />
        </div>
      </section>

      {/* 📋 THE FIVE PILLARS */}
      <section className="py-16 md:py-24 bg-surface-container-low/30 border-y border-primary/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
            <div className="mb-16 space-y-2">
                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] block font-black">The Daksha Standard</span>
                <h2 className="text-2xl md:text-4xl font-serif font-black text-primary italic leading-none">Our Core Commitment</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    "Fresh Cookies Production",
                    "Millet Powder Supply",
                    "Bulk & Wholesale Orders",
                    "Custom Packaging",
                    "Quality & Hygiene Assurance"
                ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-primary/5 shadow-sm hover:border-secondary transition-all group overflow-hidden relative">
                        <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner px-2 shrink-0">
                            <CheckCircle2 className="w-5 h-5 font-black" />
                        </div>
                        <span className="text-sm font-black text-primary italic tracking-tight text-left relative z-10 font-bold">{s}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 📞 PROFESSIONAL CTA */}
      <section className="py-16 md:py-24 bg-primary text-secondary-fixed text-center px-6">
        <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-black italic mb-8 leading-tight text-white">Connect with <br />The Artisan Team.</h2>
            <p className="text-sm md:text-base text-stone-400 font-medium italic mb-10 opacity-80">
                Discuss your custom orders, wholesale requirements, or specific powder processing needs.
            </p>
            <a href="tel:+919704254959" className="inline-flex items-center gap-4 bg-secondary text-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-95 group">
                Contact Us Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>
      </section>
    </div>
  );
};

const PhotoServiceCard = ({ img, title, desc, brief }) => (
    <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg transition-all duration-700 hover:-translate-y-2">
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/70 transition-colors duration-700 z-10"></div>
        <img 
            src={img} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
            <h3 className="text-2xl font-serif font-black italic leading-none mb-1">{title}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#be9590] mb-4">{desc}</p>
            <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-700">
                <p className="text-xs text-white/80 font-medium italic leading-relaxed pt-2 border-t border-white/10">{brief}</p>
            </div>
        </div>
    </div>
);

export default Services;

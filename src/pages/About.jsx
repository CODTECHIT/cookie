import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <main className="pt-24 xl:pt-40 pb-20 xl:pb-40 px-6 xl:px-10 max-w-[1700px] mx-auto min-h-screen">
      
      {/* 📜 Breadcrumb */}
      <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-10 xl:mb-20 opacity-40 animate-fade-in">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
        <span className="text-primary">Our Heritage</span>
      </nav>

      {/* 🏛️ Philosophy Section */}
      <section className="text-center mb-24 xl:mb-48">
        <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-6 block animate-slide-right">The Daksha Legacy</span>
        <h1 className="text-4xl md:text-6xl xl:text-[9rem] font-serif font-black text-primary mb-8 xl:mb-12 italic leading-[1.1] xl:leading-[0.85] tracking-tighter animate-slide-up opacity-0 fill-mode-forwards">
          Crafting Health <br /> <span className="text-tertiary">& Heritage.</span>
        </h1>
        <p className="text-lg xl:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed italic font-medium animate-slide-up delay-200 opacity-0 fill-mode-forwards px-4">
           Daksha Cookies & Millets was founded with a passion to create high-quality, healthy, and delicious baked products that honor our roots.
        </p>
      </section>

      {/* 📜 Detailed Story - Founders */}
      <section className="grid lg:grid-cols-2 gap-16 xl:gap-32 items-center mb-32 xl:mb-64 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-px bg-primary/5 -rotate-12 -z-10 group-hover:rotate-0 transition-all duration-1000 hidden xl:block"></div>
        <div className="relative group animate-fade-in delay-300 opacity-0 fill-mode-forwards">
           <div className="aspect-[4/5] rounded-[2.5rem] xl:rounded-[4rem] overflow-hidden bg-surface-container-low shadow-[0_40px_100px_rgba(51,25,23,0.1)] relative border-[1px] border-primary/5 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-1000 ease-out">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlAj993WagWtMXGAqi4HbZXc9ozVN_JcDsDdg8RcpFhUlmc1Fn41U8Z5BMqiY8Tz1MjTWwZ6lnV0g4MRXCO43cj0D_l1IZ9TLt-Qt15uo8w-DuB0T0MbfyH6Lzt3ncmuJEC34LAlWHAs4njr5bvpNov9EkVXXBj1v82L_rCraSSKKzKixX_7L4Crl05cLz0QkZsMToVvpQ1XSgrNBc5ghBoDDmuZ1Q4FeVuCVO15hDk1VLtBLEI7VniJoSNK5I27DpdGILmXv14qY" alt="Founders" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
           </div>
           <div className="absolute -bottom-6 xl:-bottom-12 -left-4 xl:-left-12 bg-white/80 backdrop-blur-xl p-6 xl:p-10 rounded-[2rem] xl:rounded-[3rem] shadow-2xl border border-primary/5 max-w-[200px] xl:max-w-xs animate-slide-right delay-500 opacity-0 fill-mode-forwards">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary mb-2 block italic">Est. 2026</span>
              <p className="text-[10px] xl:text-sm font-serif font-black text-primary italic leading-snug">"Bringing the warmth of a hearth-baked kitchen to every home."</p>
           </div>
        </div>
        <div className="space-y-8 xl:space-y-12 animate-slide-up delay-500 opacity-0 fill-mode-forwards">
           <div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">The Visionaries</span>
              <h2 className="text-3xl xl:text-6xl font-serif font-black text-primary mb-6 xl:mb-10 italic leading-[1.1] xl:leading-[1.1]">Koripalli Janakiram Chowdery & <br/><span className="text-tertiary">Gowri Priya</span></h2>
              <div className="text-base xl:text-lg text-stone-600 font-medium space-y-6 xl:space-y-10 leading-relaxed italic">
                 <p className="first-letter:text-4xl xl:first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary first-letter:mt-2">
                    Daksha Cookies & Millets was founded with a passion to create high-quality, healthy, and delicious baked products. Our brand focuses on combining traditional ingredients with modern baking techniques to deliver a unique taste experience.
                 </p>
                 <p className="pl-6 xl:pl-12 border-l-4 border-tertiary/20 italic text-stone-500">
                    At Daksha Cookies & Millets, our mission is to provide tasty and nutritious alternatives that everyone can enjoy, while maintaining the highest standards in every product we make.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* 🌾 Product Focus - Cookies & Millets */}
      <section className="grid xl:grid-cols-2 gap-8 xl:gap-16 mb-32 xl:mb-64">
         {/* Cookies Detail */}
         <div className="bg-white rounded-[2.5rem] xl:rounded-[4rem] p-10 xl:p-20 shadow-2xl border border-primary/5 group hover:shadow-[0_40px_100px_rgba(51,25,23,0.1)] hover:-translate-y-4 transition-all duration-1000 animate-slide-up delay-300 opacity-0 fill-mode-forwards">
            <div className="w-16 h-16 xl:w-24 xl:h-24 bg-primary/5 text-primary rounded-[1.5rem] xl:rounded-[2rem] flex items-center justify-center mb-8 xl:mb-12 group-hover:bg-primary group-hover:text-white group-hover:rotate-[15deg] transition-all duration-700">
               <span className="material-symbols-outlined text-4xl xl:text-5xl font-black">cookie</span>
            </div>
            <h3 className="text-3xl xl:text-5xl font-serif font-black text-primary mb-6 xl:mb-10 italic">Our Artisan Cookies</h3>
            <p className="text-base xl:text-xl text-stone-500 leading-relaxed font-medium italic">
               We specialize in cookies made with premium cashew powder and carefully selected millets, offering a rich flavor, natural nutrition, and a distinct texture in every bite.
            </p>
         </div>

         {/* Millets Detail */}
         <div className="bg-primary text-secondary-fixed rounded-[2.5rem] xl:rounded-[4rem] p-10 xl:p-20 shadow-2xl group hover:-translate-y-4 transition-all duration-1000 relative overflow-hidden animate-slide-up delay-500 opacity-0 fill-mode-forwards">
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-tertiary opacity-10 rounded-full blur-[120px] -z-0"></div>
            <div className="w-16 h-16 xl:w-24 xl:h-24 bg-white/10 text-white rounded-[1.5rem] xl:rounded-[2rem] flex items-center justify-center mb-8 xl:mb-12 group-hover:bg-tertiary group-hover:rotate-[-15deg] transition-all duration-700 relative z-10">
               <span className="material-symbols-outlined text-4xl xl:text-5xl font-black">eco</span>
            </div>
            <h3 className="text-3xl xl:text-5xl font-serif font-black text-white mb-6 xl:mb-10 italic relative z-10">High-Quality Millets</h3>
            <p className="text-base xl:text-xl opacity-80 leading-relaxed font-medium italic relative z-10">
                At Daksha Cookies & Millets, we bring you nutrient-dense, unpolished grains that honor traditional processing methods for maximum purity and health.
            </p>
         </div>
      </section>

      {/* 💎 Brand Philosophy - The Daksha Standard */}
      <section className="bg-surface-container-low/50 rounded-[3rem] xl:rounded-[5rem] p-10 xl:p-32 relative overflow-hidden animate-fade-in delay-700 opacity-0 fill-mode-forwards border border-primary/5">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 translate-x-[-1/2] translate-y-[-1/2]"></div>
        <div className="text-center mb-16 xl:mb-32">
           <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-8 block">The Daksha Standard</span>
           <h2 className="text-4xl xl:text-7xl font-serif font-black text-primary italic leading-none">Our Core Essence</h2>
        </div>
        
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-8 xl:gap-20">
           <BrandValue icon="star" title="Indulgent Nutrition" desc="Premium quality and superior taste with a focus on artisanal positioning." />
           <BrandValue icon="medical_services" title="Health First" desc="Healthy millet alternatives that support a natural lifestyle." />
           <BrandValue icon="clean_hands" title="Pure & Hygienic" desc="Clean, chemical-free and trustworthy brand image in every batch." />
           <BrandValue icon="auto_awesome" title="Modern Artisan" desc="Natural ingredients and traditional taste with a premium modern touch." />
           <div className="col-span-2 xl:col-span-1">
              <BrandValue icon="package_2" title="Professional Soul" desc="Modern, attractive and professional packaging with a premium feel." />
           </div>
        </div>
      </section>

    </main>
  );
};

export default About;

const BrandValue = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center group">
     <div className="w-20 h-20 rounded-3xl bg-white text-primary flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110 duration-500 shadow-xl border border-primary/5">
        <span className="material-symbols-outlined text-3xl font-black">{icon}</span>
     </div>
     <h4 className="font-serif font-black text-xl text-primary mb-6 italic tracking-tight">{title}</h4>
     <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant opacity-40 leading-relaxed max-w-[150px]">{desc}</p>
  </div>
);


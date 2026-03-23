import React from 'react';
import { Link } from 'react-router-dom';
import cookieHero from '../assets/cookie_hero.png';

const Home = () => {
  return (
    <div className="bg-background min-h-screen">
      
      {/* 📱 Mobile Experience (Flipkart Style) */}
      <section className="lg:hidden pt-28 pb-32 space-y-4">
        {/* ... (Keep mobile categories as is) */}
        <div className="flex gap-4 px-4 overflow-x-auto hide-scrollbar py-4 bg-white/50 backdrop-blur-md">
           <MobileCategory label="Cookies" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmk59cSQSIjdJI7BeSql6AmUYJd1iVfWqZSUrOTaImbfcAnGEron1HuTYNwnExiZVl1HD1s74_LbEaH6kH0l7GYdrxZxB5sP1pPru-8SphVc7AXNlDK0zqwCjALC-dvpf0qto6-pfIb4ecFeim3OYQY58paOMhIp8PrODioTCgat9GJ_KEjvhF2ADRUdIB_1E8nCixW5iM_r3uhxvluBjWzz25Oshxk-PIZmxlfERDjT5qK0mZ4NLMhIiFf98_kyXYMLotwj_APso" />
           <MobileCategory label="Millets" to="/millets" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbo9u6lGD9EKS6uiqeL3v87SUCRG_wvUJSJ-XEYlotCypKCVJSh-2cQOGgw7HhMrKk-vRuQhojkkKJ2mupji7EnqvUwBWf394_qs4gdYyBFxQX9IWY_vkZQerbzTFImxNnMACBqZhUKtnSuFp3RX7nH7u_ENwdIJeBLyXCf0yO0oOhDbRK7EPe49IpvzHTaYoVTuXYAGMDZLaCL2cGTh6sE_TDqC2Av05HdaqlHOuQ4VqvkptMeUL7ohu_4kVlNXhFD9vrA1Slz3o" />
           <MobileCategory label="Bundles" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrV-I8OoJAkKbYr7Xugm2b-cD8tTpqF0VEWlts8wK6g7ExH35JXGzVbbRTqo3Srcxlk3Bk-T-5fPg71H225Hw5w-q4e7qKEBpR82rvmA8qYTgd_s8hupfI7dGJbWpv96KJZ1jOIqATBtXXlcY-dp_iwYDT5dQa1UT4fnZUtn_6v-wMenr4gWb4rDToTSk6CJgceHT2ZFpQBnHJD1wV1mBgMt5f_OncU8YrbzKmDjw0PO70aNiNmsknpzL5PhtpVHmzICZKqfzIE0g" />
           <MobileCategory label="Bulk" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVKsTPdAmkmAsC9AjbmLzuRa_bqnFJR1AFol6a1OwaFqg0TWcVX-m_izv8LoOALZKUfvCFjhps0uL2kVsy0IX11ml9OsI06Z3DMp_VjX_cYfNlF920ul7imXFapGqExxn556knJmDdsH3LhlntNBVEN9BnyhyCn0J5rTx_fn-iBXR7EVwl6cr08CI9KlMlCMZQm6FC0pS3mpkb3bAB-bsual5nQFWMVLiWHjEdS_MoiwmLPoTrRnRCBFEPMYXOlAfDOt8QsE4cpYU" />
           <Link to="/products" className="flex flex-col items-center gap-1 shrink-0 px-2 min-w-[72px]">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center shadow-lg border-2 border-primary/10">
                 <span className="material-symbols-outlined text-tertiary text-2xl font-black">percent</span>
              </div>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest mt-1">Offers</span>
           </Link>
        </div>

        {/* Mobile Banner (16:9) */}
        <div className="px-4">
           <div className="aspect-[16/9] w-full bg-primary rounded-2xl overflow-hidden relative shadow-2xl">
              <img className="w-full h-full object-cover opacity-60" src={cookieHero} alt="Hero" />
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                 <p className="text-secondary-fixed text-[10px] uppercase font-black tracking-[0.2em] mb-2 leading-none">Freshly Baked Every Day</p>
                 <h2 className="text-white text-3xl font-serif font-black italic leading-tight mb-4 tracking-tight">Pure. Natural.<br/><span className="text-secondary">Delicious.</span></h2>
                 <Link to="/products" className="bg-secondary text-[#331917] w-fit px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20">Explore All</Link>
              </div>
           </div>
        </div>

        {/* ... (Keep mobile bset sellers as is) */}
        <section className="px-4 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-primary font-black uppercase text-xs tracking-widest bg-primary-container/20 px-3 py-1 rounded-full border border-primary/10">Best Sellers</h3>
              <Link to="/products" className="text-tertiary font-black uppercase text-[10px] tracking-widest flex items-center">View All <span className="material-symbols-outlined text-sm ml-1">chevron_right</span></Link>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <MobileProductCard title="Cashew Cookies" price="199" oldPrice="249" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY" />
              <MobileProductCard title="Pearl Millet" price="145" oldPrice="180" img="https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ" />
              <MobileProductCard title="Granola Mix" price="320" oldPrice="400" img="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkVBfwVW3Q4gpaL9YhaEkW1scwp_R5nVaMY8Br3th_LuilP7kIBEshx3Njn_y27kYoXBMwZUi1fW-j5B1722mpGtwcPoWPDeZRLfU7EMalo-qHRekdW6vkacyuONA3tfyOd4yB-OX6DtrnwO47_8wE28yNEAa_Vk6FuLlSKoeJGq97TvLMhVQpTdgU1JMG7TzqvGh73o4pXMGw5FhTOpw8XqNx0M5e0autUX5_mIcrQTT0KgYe1QpywJgWIqpPW-5ur9vI5K5TI4" />
              <MobileProductCard title="Gift Bundle" price="999" oldPrice="1249" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAVKsTPdAmkmAsC9AjbmLzuRa_bqnFJR1AFol6a1OwaFqg0TWcVX-m_izv8LoOALZKUfvCFjhps0uL2kVsy0IX11ml9OsI06Z3DMp_VjX_cYfNlF920ul7imXFapGqExxn556knJmDdsH3LhlntNBVEN9BnyhyCn0J5rTx_fn-iBXR7EVwl6cr08CI9KlMlCMZQm6FC0pS3mpkb3bAB-bsual5nQFWMVLiWHjEdS_MoiwmLPoTrRnRCBFEPMYXOlAfDOt8QsE4cpYU" />
           </div>
        </section>
      </section>

      {/* 🖥️ Desktop Experience (As per design.md) */}
      <main className="hidden lg:block">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[80vh] xl:h-[90vh] flex items-center group">
          <div className="absolute inset-0 z-0">
             <img 
               src={cookieHero} 
               alt="Background" 
               className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[4s] ease-out"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
          </div>

          <div className="max-w-[1700px] mx-auto px-6 xl:px-10 w-full relative z-10">
            <div className="max-w-3xl">
              <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-6 block animate-slide-right">Established 2026 • Artisanal Excellence</span>
              <h1 className="text-5xl xl:text-[6.5rem] font-serif font-black text-primary mb-6 leading-[0.9] xl:leading-[0.85] italic animate-slide-up opacity-0 fill-mode-forwards">
                Pure. Natural. <br/><span className="text-tertiary">Delicious.</span>
              </h1>
              <p className="text-base xl:text-xl text-stone-600 mb-10 max-w-xl leading-relaxed font-sans font-medium italic animate-slide-up delay-200 opacity-0 fill-mode-forwards">
                Premium Cashew Cookies & Healthy Millet Powders — Crafted with tradition, delivered with love.
              </p>
              <div className="flex flex-wrap gap-4 animate-slide-up delay-300 opacity-0 fill-mode-forwards">
                <Link to="/products" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-black text-sm shadow-2xl shadow-primary/20 hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-3 tracking-[0.2em] uppercase">
                  Shop Cookies <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                </Link>
                <Link to="/millets" className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-black text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center tracking-[0.2em] uppercase">
                  Explore Millets
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Strip */}
        <section className="py-12 xl:py-24 bg-surface relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          <div className="max-w-[1700px] mx-auto px-6 xl:px-10 flex justify-between items-center overflow-x-auto gap-6 xl:gap-12 hide-scrollbar animate-fade-in delay-500 opacity-0 fill-mode-forwards">
            <DesktopCategory label="Cookies" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmk59cSQSIjdJI7BeSql6AmUYJd1iVfWqZSUrOTaImbfcAnGEron1HuTYNwnExiZVl1HD1s74_LbEaH6kH0l7GYdrxZxB5sP1pPru-8SphVc7AXNlDK0zqwCjALC-dvpf0qto6-pfIb4ecFeim3OYQY58paOMhIp8PrODioTCgat9GJ_KEjvhF2ADRUdIB_1E8nCixW5iM_r3uhxvluBjWzz25Oshxk-PIZmxlfERDjT5qK0mZ4NLMhIiFf98_kyXYMLotwj_APso" />
            <DesktopCategory label="Millet Powders" to="/millets" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbo9u6lGD9EKS6uiqeL3v87SUCRG_wvUJSJ-XEYlotCypKCVJSh-2cQOGgw7HhMrKk-vRuQhojkkKJ2mupji7EnqvUwBWf394_qs4gdYyBFxQX9IWY_vkZQerbzTFImxNnMACBqZhUKtnSuFp3RX7nH7u_ENwdIJeBLyXCf0yO0oOhDbRK7EPe49IpvzHTaYoVTuXYAGMDZLaCL2cGTh6sE_TDqC2Av05HdaqlHOuQ4VqvkptMeUL7ohu_4kVlNXhFD9vrA1Slz3o" />
            <DesktopCategory label="Gift Packs" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrV-I8OoJAkKbYr7Xugm2b-cD8tTpqF0VEWlts8wK6g7ExH35JXGzVbbRTqo3Srcxlk3Bk-T-5fPg71H225Hw5w-q4e7qKEBpR82rvmA8qYTgd_s8hupfI7dGJbWpv96KJZ1jOIqATBtXXlcY-dp_iwYDT5dQa1UT4fnZUtn_6v-wMenr4gWb4rDToTSk6CJgceHT2ZFpQBnHJD1wV1mBgMt5f_OncU8YrbzKmDjw0PO70aNiNmsknpzL5PhtpVHmzICZKqfzIE0g" />
            <DesktopCategory label="Bulk Orders" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVKsTPdAmkmAsC9AjbmLzuRa_bqnFJR1AFol6a1OwaFqg0TWcVX-m_izv8LoOALZKUfvCFjhps0uL2kVsy0IX11ml9OsI06Z3DMp_VjX_cYfNlF920ul7imXFapGqExxn556knJmDdsH3LhlntNBVEN9BnyhyCn0J5rTx_fn-iBXR7EVwl6cr08CI9KlMlCMZQm6FC0pS3mpkb3bAB-bsual5nQFWMVLiWHjEdS_MoiwmLPoTrRnRCBFEPMYXOlAfDOt8QsE4cpYU" />
            <DesktopCategory label="New Arrivals" to="/products" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6lgqiq9QPC9lAFNrU3drgKveMkF5yJvqcWPmMYl2EaTLkDIrcQiWrm97oCybQAbp85G8OhysJMURNX1pHZAdYccV4vn4Yz8j9GzZ0dIJM8Rb9XvypGSnrUA5VDDQCnnVB76pe4vtH1_9okkDz6i3TmUF-EaeBogOUZ4zP6ajAY6-8_gnVXE9n99ssNwVYMiLywXAnfVLmMEpXOOX8PpZAhe4ct2XVUaxa94IuHiSbnzqLSGOd9Ax7RWbHUPIf5swg5_die9FGd24" />
            <Link to="/products" className="flex flex-col items-center gap-4 group cursor-pointer transition-all hover:translate-y-[-8px]">
              <div className="w-40 h-40 rounded-full bg-secondary-container flex items-center justify-center border-4 border-primary/5 shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <span className="material-symbols-outlined text-6xl">percent</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Limited Offers</span>
            </Link>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16 xl:py-32 bg-surface-container-low/50">
          <div className="max-w-[1700px] mx-auto px-6 xl:px-10">
            <div className="flex flex-wrap justify-between items-end mb-10 xl:mb-20 px-4 gap-6">
              <div>
                <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-4 block">Our Curated Favorites</span>
                <h2 className="text-3xl xl:text-5xl font-serif font-black text-primary italic leading-none">The Best Sellers</h2>
              </div>
              <Link to="/products" className="text-tertiary font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 border-b-2 border-tertiary pb-1 hover:gap-6 transition-all">
                View Collection <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12">
               <DesktopProductCard title="Premium Cashew Cookies" price="199" oldPrice="249" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY" desc="Handcrafted butter cookies with premium W180 cashews." />
               <DesktopProductCard title="Organic Pearl Millet" price="145" oldPrice="180" img="https://lh3.googleusercontent.com/aida-public/AB6AXuDqaTyoHCDyWZIeGkC_a_Gq-4zmaNubJTZW5n-LKjSWh4I0nmkZxEWmdxLKhlaZGayZK4YAMu559nT29mxngRZvte-UiLq12GpAnf93pAmIeiAIh-nf9-6vW9ZG0JdS-_QbNBSV8K6kity99VIKBnXoVbmBTFSohuHKLJ44r2QlFlqgsJuew7IxcNxqdxjE3NH5CIrpn93osqMuitzDIRlYEJ38n0bXnKTa5rocEDQ-R-oGXn917bbGIWZqfOA8-3c8hcai5o4nDnQ" desc="Traditional hearth-baked millet snacks." />
               <DesktopProductCard title="Millet & Honey Granola" price="320" oldPrice="400" img="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkVBfwVW3Q4gpaL9YhaEkW1scwp_R5nVaMY8Br3th_LuilP7kIBEshx3Njn_y27kYoXBMwZUi1fW-j5B1722mpGtwcPoWPDeZRLfU7EMalo-qHRekdW6vkacyuONA3tfyOd4yB-OX6DtrnwO47_8wE28yNEAa_Vk6FuLlSKoeJGq97TvLMhVQpTdgU1JMG7TzqvGh73o4pXMGw5FhTOpw8XqNx0M5e0autUX5_mIcrQTT0KgYe1QpywJgWIqpPW-5ur9vI5K5TI4" desc="Cold-pressed granola with raw forest honey." />
               <DesktopProductCard title="Signature Gift Bundle" price="999" oldPrice="1249" img="https://lh3.googleusercontent.com/aida-public/AB6AXuAVKsTPdAmkmAsC9AjbmLzuRa_bqnFJR1AFol6a1OwaFqg0TWcVX-m_izv8LoOALZKUfvCFjhps0uL2kVsy0IX11ml9OsI06Z3DMp_VjX_cYfNlF920ul7imXFapGqExxn556knJmDdsH3LhlntNBVEN9BnyhyCn0J5rTx_fn-iBXR7EVwl6cr08CI9KlMlCMZQm6FC0pS3mpkb3bAB-bsual5nQFWMVLiWHjEdS_MoiwmLPoTrRnRCBFEPMYXOlAfDOt8QsE4cpYU" desc="Curated selection for mindful gifting." />
            </div>
          </div>
        </section>

        {/* Dynamic Offer Banner */}
        <section className="px-4 xl:px-10 py-10 xl:py-16">
          <div className="max-w-[1700px] mx-auto bg-primary rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-16 flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-12 overflow-hidden relative shadow-2xl">
            <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-12 z-10 text-center xl:text-left">
              <div className="w-16 h-16 xl:w-24 xl:h-24 bg-tertiary/20 rounded-full flex items-center justify-center text-secondary-fixed shrink-0">
                <span className="material-symbols-outlined text-4xl xl:text-6xl">local_shipping</span>
              </div>
              <div>
                <h2 className="text-2xl xl:text-5xl font-serif font-black text-secondary-fixed mb-3 italic leading-none">🚚 Free Global Shipping.</h2>
                <p className="text-sm xl:text-xl text-on-primary-container font-sans font-medium uppercase tracking-[0.2em]">Orders above <span className="text-secondary-fixed text-lg xl:text-2xl px-2 italic">₹999</span> enjoy complimentary delivery</p>
              </div>
            </div>
            <button className="bg-secondary-fixed text-primary px-10 xl:px-16 py-4 xl:py-6 rounded-2xl font-black text-sm xl:text-xl hover:translate-y-[-4px] hover:shadow-2xl transition-all shadow-xl active:scale-95 shrink-0 z-10 tracking-[0.3em] uppercase">
              Shop Now
            </button>
            <div className="absolute right-[-2%] top-[-20%] w-[500px] h-[500px] bg-tertiary opacity-10 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* 🛠️ Services We Provide */}
        <section className="py-16 xl:py-40 bg-surface-container-low overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tertiary/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="max-w-[1700px] mx-auto px-6 xl:px-10">
            <div className="text-center mb-12 xl:mb-24 reveal">
              <span className="text-secondary font-black uppercase tracking-[0.5em] text-xs mb-6 block">Our Expertise</span>
              <h2 className="text-4xl xl:text-7xl font-serif font-black text-primary mb-8 xl:mb-12 italic leading-none">Services We Provide</h2>
              <p className="text-base xl:text-xl text-stone-600 max-w-4xl mx-auto leading-relaxed italic font-medium">
                 At Daksha Cookies & Millets, we offer a range of services to ensure quality, convenience, and customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
              <ServiceCard 
                 icon="cookie" 
                 title="Artisan Cookies Manufacturing" 
                 desc="Crafted with premium ingredients like cashew powder for a rich taste and superior quality." 
                 tags={["Fresh Production", "Premium Ingredients"]}
              />
              <ServiceCard 
                 icon="eco" 
                 title="Millet Powder Production" 
                 desc="Finely processed, nutrient-rich millet powders for a healthy and natural lifestyle." 
                 tags={["Hygienic Processing", "Natural Goodness"]}
              />
              <ServiceCard 
                 icon="inventory_2" 
                 title="Bulk & Wholesale Supply" 
                 desc="Reliable large-scale supply with consistent quality and customized solutions." 
                 tags={["Custom Packaging", "Hygiene Assurance"]}
              />
            </div>
            
            <div className="mt-12 xl:mt-24 grid grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8 text-center bg-white/50 backdrop-blur rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 border border-outline-variant/10 shadow-sm">
               {["Fresh Cookies Production", "Millet Powder Supply", "Bulk & Wholesale Orders", "Custom Packaging", "Quality & Hygiene Assurance"].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-4 group">
                     <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-xl">verified</span>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">{s}</span>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 xl:py-32 bg-surface overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] select-none text-[20rem] font-serif font-black -translate-y-1/2 whitespace-nowrap">"Daksha Experience"</div>
          <div className="max-w-[1700px] mx-auto px-6 xl:px-10">
             <h2 className="text-center text-4xl xl:text-7xl font-serif font-black text-primary mb-12 xl:mb-24 italic">Patron Stories</h2>
             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
                <TestimonialCard 
                  name="Arjun Reddy" 
                  loc="Hyderabad" 
                  quote="The Cashew Cookies are divine. You can tell they use real butter and high-quality nuts. It takes me back to my childhood visits to the bakery."
                />
                <TestimonialCard 
                  dark
                  name="Lakshmi Prasanna" 
                  loc="Vizag" 
                  quote="Switching to Ragi Malt for my morning routine was the best decision. Daksha's quality is far superior to store-bought brands."
                />
                <TestimonialCard 
                  name="Karthik S." 
                  loc="Bangalore" 
                  quote="The Gift Bundles are my go-to for Diwali. Excellent packaging and everyone loves the variety of millet snacks. Great artisan touch."
                />
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* Components */
const MobileCategory = ({ label, src, to }) => (
  <Link to={to} className="flex flex-col items-center gap-1 shrink-0 px-2 min-w-[72px]">
     <div className="w-16 h-16 rounded-full p-0.5 bg-white shadow-lg border border-primary/5">
        <img className="w-full h-full object-cover rounded-full" src={src} alt={label} />
     </div>
     <span className="text-[10px] font-black uppercase text-primary tracking-widest mt-1 opacity-80">{label}</span>
  </Link>
);

const DesktopCategory = ({ label, src, to }) => (
  <Link to={to} className="flex flex-col items-center gap-4 group cursor-pointer transition-all hover:translate-y-[-8px]">
     <div className="w-40 h-40 rounded-full p-1 border-4 border-transparent group-hover:border-tertiary transition-all duration-500 shadow-2xl relative overflow-hidden">
        <img className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700" src={src} alt={label} />
     </div>
     <span className="text-sm font-black uppercase tracking-[0.3em] text-primary group-hover:text-tertiary transition-colors">{label}</span>
  </Link>
);

const MobileProductCard = ({ title, price, oldPrice, img, id, category }) => (
  <Link to={`/product/${category || 'cookies'}/${id || 1}`} className="bg-white rounded-2xl p-3 shadow-md border border-primary/5 active:scale-95 transition-transform flex flex-col group">
     <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 relative bg-surface-container-low">
        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={img} alt={title} />
        <button className="absolute top-2 right-2 w-7 h-7 bg-white/70 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
           <span className="material-symbols-outlined text-sm">favorite</span>
        </button>
     </div>
     <h4 className="font-serif font-black italic text-sm text-primary leading-tight line-clamp-1">{title}</h4>
     <div className="flex items-center gap-2 mt-2 leading-none">
        <span className="font-serif font-black text-lg text-primary italic">₹{price}</span>
        <span className="text-[10px] line-through text-stone-300">₹{oldPrice}</span>
     </div>
     <button className="w-full mt-3 bg-primary-container/20 text-primary py-2 rounded-lg font-black text-[9px] uppercase tracking-widest border border-primary/5">Bag It</button>
  </Link>
);

const DesktopProductCard = ({ title, price, oldPrice, img, desc, id, category }) => (
  <div className="group bg-surface-container-lowest rounded-[2.5rem] p-6 hover:shadow-[0_40px_80px_rgba(51,25,23,0.12)] transition-all duration-700 flex flex-col items-center text-center">
     <Link to={`/product/${category || 'cookies'}/${id || 1}`} className="aspect-[4/5] w-full rounded-[2rem] overflow-hidden mb-8 relative shadow-sm group-hover:shadow-2xl transition-all duration-700 block">
        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" src={img} alt={title} />
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
           <button className="w-12 h-12 bg-white/90 backdrop-blur shadow-xl rounded-full flex items-center justify-center text-primary active:scale-90"><span className="material-symbols-outlined">favorite</span></button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
           <div className="w-full bg-primary text-secondary-fixed py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm font-black">shopping_bag</span>
              Add To Bag
           </div>
        </div>
     </Link>
     <h3 className="font-serif text-2xl font-black text-primary leading-none mb-3 group-hover:text-tertiary transition-colors italic">{title}</h3>
     <p className="text-sm font-medium text-on-surface-variant opacity-60 line-clamp-2 italic mb-6">{desc}</p>
     <div className="flex items-baseline gap-4 mt-auto">
        <span className="font-serif text-3xl font-black text-tertiary italic">₹{price}</span>
        <span className="text-lg line-through text-stone-300 italic">₹{oldPrice}</span>
     </div>
  </div>
);

const WhyUsCard = ({ icon, title, desc }) => (
  <div className="p-10 bg-white rounded-[3rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group">
     <div className="w-20 h-20 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-110">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
     </div>
     <h4 className="font-serif font-black text-2xl text-primary mb-4 italic leading-none">{title}</h4>
     <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed font-sans">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, loc, quote, dark }) => (
  <div className={`p-12 rounded-[3.5rem] relative shadow-2xl transition-all duration-700 hover:translate-y-[-12px] ${dark ? 'bg-primary text-secondary-fixed' : 'bg-secondary-container/30 text-primary border border-outline-variant/10'}`}>
     <span className="material-symbols-outlined text-8xl absolute top-8 right-8 opacity-10">format_quote</span>
     <div className="flex gap-1 text-tertiary-fixed-dim mb-10">
        {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-xl fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
     </div>
     <p className="text-xl italic font-serif leading-relaxed mb-12 relative z-10 font-bold">"{quote}"</p>
     <div>
        <h4 className="font-black text-lg uppercase tracking-widest">{name}</h4>
        <p className={`text-xs uppercase font-black tracking-widest opacity-60 mt-1 italic ${dark ? 'text-secondary-fixed-dim' : 'text-primary'}`}>Verified Patron • {loc}</p>
     </div>
  </div>
);

const ServiceCard = ({ icon, title, desc, tags }) => (
  <div className="p-12 bg-white rounded-[3.5rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col group relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/20 transition-all"></div>
     <div className="w-20 h-20 bg-primary text-secondary-fixed rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:bg-tertiary transition-all duration-500 scale-110">
        <span className="material-symbols-outlined text-4xl">{icon}</span>
     </div>
     <h4 className="font-serif font-black text-3xl text-primary mb-6 italic leading-none">{title}</h4>
     <p className="text-lg font-medium text-on-surface-variant opacity-70 leading-relaxed font-sans italic mb-10">{desc}</p>
     <div className="mt-auto flex flex-wrap gap-2">
        {tags.map(t => <span key={t} className="px-4 py-1.5 bg-secondary-container/30 text-primary text-[9px] font-black uppercase tracking-widest rounded-full">{t}</span>)}
     </div>
  </div>
);

export default Home;

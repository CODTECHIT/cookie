import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
    History, Heart, Users, ShieldCheck,
    MapPin, Quote, Sparkles, Award, ArrowRight,
    Target, Zap, Leaf, Star
} from 'lucide-react';

const About = () => {
    const heritageImg = "/assets/heritage-kitchen.png";
    const foundersImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuDlAj993WagWtMXGAqi4HbZXc9ozVN_JcDsDdg8RcpFhUlmc1Fn41U8Z5BMqiY8Tz1MjTWwZ6lnV0g4MRXCO43cj0D_l1IZ9TLt-Qt15uo8w-DuB0T0MbfyH6Lzt3ncmuJEC34LAlWHAs4njr5bvpNov9EkVXXBj1v82L_rCraSSKKzKixX_7L4Crl05cLz0QkZsMToVvpQ1XSgrNBc5ghBoDDmuZ1Q4FeVuCVO15hDk1VLtBLEI7VniJoSNK5I27DpdGILmXv14qY";

    return (
        <div className="bg-background min-h-screen font-sans text-on-surface antialiased overflow-x-hidden">
            <SEO
                title="Our Story | The Daksha Heritage - Artisan Cookies & Millets"
                description="Discover the legacy of Daksha Cookies & Millets. Where traditional wisdom meets modern wellness innovation. Learn about our journey from Andhra Pradesh to becoming India's premier artisanal cookie brand."
                keywords="Daksha story, heritage cookies, artisan bakery Andhra Pradesh, traditional recipes, millet health benefits, our journey, family recipes, handmade cookies, premium cookies India, bulk orders"
            />

            {/* 🏺 REFINED HERO SECTION */}
            <section className="relative min-h-[60vh] flex items-center justify-center pt-40 pb-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heritageImg}
                        alt="Heritage"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/30 backdrop-blur-[0.5px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <span className="inline-block px-3 py-1 rounded-md bg-secondary text-primary text-[9px] font-black uppercase tracking-[0.4em] border border-white/10">
                            The Daksha Legacy
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-white italic leading-tight tracking-tight drop-shadow-lg">
                            Honoring Roots. <br /> <span className="text-secondary-fixed">Embracing Wellness.</span>
                        </h1>
                        <p className="text-sm md:text-base text-white/90 italic font-medium leading-relaxed max-w-lg mx-auto opacity-80">
                            Crafting premium millet-based artisanal cookies that bridge traditional wisdom with modern nutrition.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🏛️ COMPACT VISIONARY SECTION */}
            <section className="py-16 md:py-24 container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                            <img src={foundersImg} alt="Founders" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-2xl shadow-xl text-secondary-fixed max-w-[180px] hidden md:block border border-white/5">
                            <Quote className="w-6 h-6 mb-3 opacity-30" />
                            <p className="text-[11px] font-serif font-black italic leading-snug">"Bringing hearth-baked warmth to every modern home."</p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        <div className="space-y-4">
                            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] block">Visionaries</span>
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-primary italic leading-none">
                                Koripalli Janakiram & <br /><span className="text-tertiary">Gowri Priya.</span>
                            </h2>
                            <p className="text-base text-stone-600 font-medium italic leading-relaxed border-l-2 border-secondary/20 pl-6">
                                Founded with a passion to deliver high-quality, healthy, and delicious baked products by combining heritage ingredients with artisan skill.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 space-y-3">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Our Mission</h3>
                                <p className="text-xs text-stone-500 font-medium italic leading-relaxed">To provide tasty and nutritious alternatives that everyone can enjoy, maintaining the highest artisanal standards.</p>
                            </div>
                            <div className="p-6 bg-primary text-secondary-fixed rounded-2xl space-y-3">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#be9590] italic">Our Vision</h3>
                                <p className="text-xs text-white/80 font-medium italic leading-relaxed">Focusing on traditional ingredients and modern techniques to deliver a unique taste experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 💎 TIDY PHILOSOPHY SECTION */}
            <section className="py-16 md:py-24 bg-surface-container-low/30 border-y border-primary/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-4xl font-serif font-black text-primary italic leading-none">The Daksha Standard</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        <StandardItem icon={Sparkles} title="Pure Indulgence" desc="Premium quality and superior taste." />
                        <StandardItem icon={Heart} title="Health First" desc="Natural wellness alternatives." />
                        <StandardItem icon={ShieldCheck} title="Pure & Hygienic" desc="Clean, chemical-free and trustworthy." />
                        <StandardItem icon={Zap} title="Modern Artisan" desc="Tradition with a premium modern touch." />
                    </div>
                </div>
            </section>

            {/* 🎯 FINAL TIGHT CTA */}
            <section className="py-16 md:py-24 bg-primary text-secondary-fixed text-center px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-black italic text-white leading-tight">Celebrate Health <br />With Our Heritage.</h2>
                    <p className="text-sm md:text-base text-stone-400 font-medium italic max-w-md mx-auto">
                        Discover the warmth of our hearth-baked kitchen wisdom in every pure bite.
                    </p>
                    <Link to="/products" className="inline-flex items-center gap-4 bg-secondary-fixed text-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-95 group">
                        Shop Collection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

const StandardItem = (props) => {
    const Icon = props.icon;
    const { title, desc } = props;
    return (
        <div className="bg-white p-6 rounded-2xl border border-primary/5 hover:border-secondary transition-all group flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
                <h4 className="text-sm font-black text-primary italic leading-none">{title}</h4>
                <p className="text-[10px] font-medium text-stone-400 italic leading-snug">{desc}</p>
            </div>
        </div>
    );
};

export default About;

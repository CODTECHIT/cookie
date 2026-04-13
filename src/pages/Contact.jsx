import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, 
  Send, User, ArrowRight, Building
} from 'lucide-react';

const Contact = () => {
    const contactHeroImg = "/assets/daksha-contact-hero.png";
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `*New Message from DAKSHA Website*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Subject:* ${formData.subject}%0A*Message:* ${formData.message}`;
        window.open(`https://wa.me/919704254959?text=${text}`, '_blank');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-background min-h-screen font-sans text-on-surface antialiased overflow-x-hidden">
            <SEO 
                title="Contact Us | Daksha Cookies & Millets"
                description="Get in touch with Daksha Cookies & Millets. We're here to help with your orders, inquiries, and feedback. Visit us in Eluru, Andhra Pradesh."
                keywords="contact daksha, cookie inquiries, millet products contact, daksha cookies address, customer support, bulk orders, Eluru bakery"
            />

            {/* 🏺 REFINED HERO SECTION */}
            <section className="relative min-h-[50vh] flex items-center justify-center pt-40 pb-20">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={contactHeroImg} 
                        alt="Contact Us" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/60 backdrop-blur-[1px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/20"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-md bg-secondary text-primary text-[10px] font-black uppercase tracking-[0.4em] border border-white/20 shadow-lg">
                            Get In Touch
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-white italic leading-tight tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                            We'd Love to <br /> <span className="text-secondary-fixed">Hear From You.</span>
                        </h1>
                        <p className="text-sm md:text-base text-white font-medium italic leading-relaxed max-w-lg mx-auto drop-shadow-md">
                            Have questions about our artisanal treats or looking for bulk orders? Our team is ready to assist you.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🏛️ CONTACT DETAILS & FORM SECTION */}
            <section className="py-16 md:py-24 container mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-12 gap-12">
                    
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] block">Connection</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black text-primary italic leading-none">
                                Contact <br /><span className="text-tertiary">Details.</span>
                            </h2>
                            <p className="text-base text-stone-600 font-medium italic leading-relaxed border-l-2 border-secondary/20 pl-6">
                                Reach out through any of these channels. We usually respond within a few hours.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <ContactCard 
                                icon={Building} 
                                title="Business Name" 
                                value="Daksha Cookies & Millets" 
                            />
                            <ContactCard 
                                icon={User} 
                                title="Contact Person" 
                                value="Koripalli Janakiram Chowdery" 
                            />
                            <ContactCard 
                                icon={Phone} 
                                title="Phone Number" 
                                value="+91 9704254959" 
                                link="tel:+919704254959"
                            />
                            <ContactCard 
                                icon={MessageSquare} 
                                title="WhatsApp" 
                                value="+91 9704254959" 
                                link="https://wa.me/919704254959?text=Hello%21%20I%27m%20interested%20in%20Daksha%20Cookies%20%26%20Millets.%20Can%20you%20please%20provide%20more%20information%3F"
                            />
                            <ContactCard 
                                icon={Mail} 
                                title="Email Address" 
                                value="dakshacookiesmillets@gmail.com" 
                                link="mailto:dakshacookiesmillets@gmail.com"
                            />
                            <ContactCard 
                                icon={MapPin} 
                                title="Address" 
                                value="Nuzvidu, Eluru, Andhra Pradesh - 521202" 
                            />
                            <ContactCard 
                                icon={Clock} 
                                title="Working Hours" 
                                value="07:00 AM to 07:00 PM" 
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-100 shadow-sm space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif font-black text-primary italic">Send a Message</h3>
                                <p className="text-xs text-stone-500 font-medium italic">Fill out the form below and we'll get back to you shortly.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary italic">Your Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full bg-white border border-stone-200 p-4 rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors italic font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary italic">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full bg-white border border-stone-200 p-4 rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors italic font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary italic">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this regarding?"
                                        className="w-full bg-white border border-stone-200 p-4 rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors italic font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary italic">Message</label>
                                    <textarea 
                                        rows="5" 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Type your message here..."
                                        className="w-full bg-white border border-stone-200 p-4 rounded-xl text-sm focus:outline-none focus:border-secondary transition-colors italic font-medium resize-none"
                                        required
                                    ></textarea>
                                </div>
                                
                                <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center gap-4 bg-primary text-secondary-fixed px-10 py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-primary-dark transition-all shadow-xl active:scale-95 group">
                                    Send Message
                                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🎯 FINAL TIGHT CTA */}
            <section className="py-16 md:py-24 bg-primary text-secondary-fixed text-center px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-black italic text-white leading-tight">Taste the Tradition.</h2>
                    <p className="text-sm md:text-base text-stone-400 font-medium italic max-w-md mx-auto">
                        Explore our full range of handcrafted cookies and healthy millet snacks.
                    </p>
                    <Link to="/products" className="inline-flex items-center gap-4 bg-secondary-fixed text-primary px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl active:scale-95 group">
                        Explore Products
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

const ContactCard = ({ icon, title, value, link }) => {
    const Icon = icon;
    const content = (
        <div className="bg-white p-5 rounded-2xl border border-primary/5 hover:border-secondary transition-all group flex items-start gap-4 shadow-sm h-full">
            <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1 overflow-hidden">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 italic leading-none">{title}</h4>
                <p className="text-sm font-black text-primary italic leading-snug truncate">{value}</p>
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} className="block transition-transform active:scale-[0.98]">
                {content}
            </a>
        );
    }

    return content;
};

export default Contact;

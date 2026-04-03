import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | Daksha Food Artisan"
        description="Learn how Daksha Food Artisan collects, uses, and protects your personal data. Our commitment to your privacy and secure shopping experience. Contact us for any privacy concerns."
        keywords="privacy policy, data protection, personal information, security, cookies policy, terms of service, GDPR, data privacy India"
        url={`${window.location.origin}/privacy-policy`}
        noIndex={false}
      />
      <main className="pt-24 xl:pt-40 pb-20 xl:pb-40 px-6 xl:px-10 max-w-[1700px] mx-auto min-h-screen">
        {/* 📜 Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-10 xl:mb-20 opacity-40 animate-fade-in">
          <Link className="hover:text-primary transition-colors" to="/">
            Home
          </Link>
          <span className="material-symbols-outlined text-[10px]">
            chevron_right
          </span>
          <span className="text-primary font-bold">Privacy Policy</span>
        </nav>

        {/* 🏛️ Header Section */}
        <section className="text-center mb-10 xl:mb-16 reveal px-4">
          <span className="text-secondary font-black uppercase tracking-[0.5em] text-[10px] mb-4 xl:mb-6 block">
            Legal
          </span>
          <h1 className="text-4xl xl:text-8xl font-serif font-black text-primary mb-6 xl:mb-12 italic leading-none">
            Privacy Policy
          </h1>
          <p className="text-base xl:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed italic font-medium">
            Your privacy is important to us. This policy outlines how we
            collect, use, and safeguard your information.
          </p>
        </section>

        {/* 📋 Policy Content */}
        <section className="max-w-4xl mx-auto space-y-8">
          {/* Company Info */}
          <div className="bg-surface-container-low rounded-[2rem] xl:rounded-[3rem] p-6 xl:p-10">
            <h2 className="text-2xl xl:text-4xl font-serif font-black text-primary mb-6 italic">
              Daksha Cookies & Millets
            </h2>
            <p className="text-base xl:text-xl text-stone-600 leading-relaxed font-medium italic">
              At Daksha Cookies & Millets Private Limited, we are committed to
              protecting your privacy and ensuring that your personal
              information is handled in a safe and responsible manner. This
              privacy policy outlines how we collect, use, and safeguard your
              information when you visit our website or make a purchase from our
              online store.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              1. Information We Collect
            </h2>
            <div className="text-lg text-stone-600 leading-relaxed font-medium italic space-y-6">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-8 space-y-4">
                <li>
                  <strong className="text-primary">
                    Personal Information:
                  </strong>{" "}
                  Name, email address, contact details, shipping address,
                  billing information.
                </li>
                <li>
                  <strong className="text-primary">Usage Data:</strong> IP
                  address, browser type, browsing history on our site, and other
                  diagnostic data.
                </li>
                <li>
                  <strong className="text-primary">Payment Information:</strong>{" "}
                  We collect payment details only for the purpose of completing
                  your purchase. All transactions are processed securely by
                  third-party payment providers.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              2. How We Use Your Information
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium italic mb-6">
              We use your information to:
            </p>
            <ul className="list-disc pl-8 space-y-4 text-lg text-stone-600 font-medium italic">
              <li>Process and fulfill your orders.</li>
              <li>Improve our website, products, and services.</li>
              <li>Respond to customer service inquiries.</li>
              <li>Send promotional emails and updates (with your consent).</li>
            </ul>
          </div>

          {/* Section 3: Data Security */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              3. Data Security
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium italic">
              We employ industry-standard security measures to protect your
              personal information. However, no method of data transmission over
              the internet or electronic storage is 100% secure. While we strive
              to protect your personal information, we cannot guarantee its
              absolute security.
            </p>
          </div>

          {/* Section 4: Sharing Your Information */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              4. Sharing Your Information
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium italic">
              We do not sell or rent your personal information to third parties.
              However, we may share your information with trusted service
              providers (e.g., payment processors, shipping carriers) to help us
              fulfill your order and improve our services.
            </p>
          </div>

          {/* Section 5: Cookies */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              5. Cookies
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium italic">
              We use cookies to enhance your experience on our website. Cookies
              are small files stored on your device that help us remember your
              preferences and track website activity.
            </p>
          </div>

          {/* Section 6: Your Rights */}
          <div className="bg-white rounded-[2rem] xl:rounded-[3rem] p-8 xl:p-12 shadow-xl border border-outline-variant/10">
            <h2 className="text-3xl font-serif font-black text-primary mb-8 italic">
              6. Your Rights
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium italic mb-6">
              You have the right to:
            </p>
            <ul className="list-disc pl-8 space-y-4 text-lg text-stone-600 font-medium italic">
              <li>Access, update, or delete your personal information.</li>
              <li>Withdraw consent for marketing communications.</li>
              <li>Request a copy of the information we hold about you.</li>
            </ul>
          </div>

          {/* Section 7: Contact Us */}
          <div className="bg-primary text-secondary-fixed rounded-[2rem] xl:rounded-[3rem] p-6 xl:p-10 shadow-2xl relative overflow-hidden mb-6 xl:mb-10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tertiary opacity-10 rounded-full blur-[100px] -z-0"></div>
            <h2 className="text-2xl xl:text-4xl font-serif font-black text-white mb-6 xl:mb-10 italic relative z-10">
              7. Contact Us
            </h2>
            <div className="text-base xl:text-xl opacity-80 leading-relaxed font-medium italic relative z-10 space-y-4 xl:space-y-6">
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="space-y-3 xl:space-y-4">
                <p>
                  <strong className="text-white">Address:</strong> Nuzvidu,
                  Andhra Pradesh, INDIA, 521202
                </p>
                <p>
                  <strong className="text-white">Email:</strong>{" "}
                  inspacialdesigns@gmail.com
                </p>
                <p>
                  <strong className="text-white">WhatsApp:</strong> +91
                  9704254959
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PrivacyPolicy;

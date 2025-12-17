import './index.css';

export default function About() {
  return (
    <section className="cta-section" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="left-image cta-image">
              <img
                src="/crm_about.png"
                alt="OzBridge CRM Client Management"
                loading="lazy"
                className="rounded-lg shadow-xl border border-gray-200 w-full h-auto"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="cta-content-wrapper">
              <div className="section-title">
                <h2 className="mb-20">Built for Immigration & Education Professionals</h2>
                <div className="section-description">
                  OzBridge CRM is specifically designed for MARA agents, education consultants, and migration professionals. Manage your entire client lifecycle from initial inquiry to case completion with powerful tools for client management, case tracking, financial management, and workflow automation. Our bilingual platform (English & Chinese) ensures seamless communication with your diverse client base.
                </div>
              </div>
              <a
                className="main-btn btn-hover border-btn mt-30"
                href="#features"
              >
                Discover Key Features
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import './index.css';

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column - Content */}
          <div className="w-full lg:w-1/2">
            <div className="hero-content">
              <h1 className="hero-heading">
                OzBridge CRM
              </h1>
              <p className="hero-paragraph">
                The Complete CRM Solution for Immigration & Education Agents. Manage clients, cases, finances, and workflows in one powerful platform. Built specifically for MARA agents, education consultants, and migration professionals.
              </p>
              <div className="hero-actions">
                <a
                  className="main-btn btn-hover"
                  href="#features"
                >
                  Explore Features
                </a>
                <a
                  className="hero-secondary-link"
                  href="#pricing"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="w-full lg:w-1/2">
            <div className="hero-image">
              <img
                src="/crm-calendar.png"
                alt="OzBridge CRM Calendar Dashboard"
                loading="lazy"
                className="rounded-lg shadow-2xl border border-gray-200 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
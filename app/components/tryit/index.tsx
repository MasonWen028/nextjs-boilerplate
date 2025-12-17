import './index.css';

export default function TryIt() {
  return (
    <section className="cta-section" id="try-it">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column - Content */}
          <div className="w-full lg:w-1/2">
            <div className="cta-content-wrapper">
              <div className="section-title">
                <h2 className="mb-20">Experience OzBridge CRM Today</h2>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700">
                    See how OzBridge CRM can transform your immigration and education consulting business. Try our live demo with full access to all features.
                  </p>
                  <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                    <h3 className="font-bold text-cyan-900 mb-2">What you'll experience:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">✓</span>
                        <span>AI-powered email intelligence in action</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">✓</span>
                        <span>Complete client and case management</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">✓</span>
                        <span>Financial tracking and reporting</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-cyan-500 mr-2">✓</span>
                        <span>Bilingual interface (English & Chinese)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  className="main-btn btn-hover"
                  href="/dashboard"
                >
                  Access Dashboard
                </a>
                <a
                  className="main-btn btn-hover border-btn"
                  href="#pricing"
                >
                  View Pricing
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="w-full lg:w-1/2">
            <div className="right-image cta-image text-center lg:text-right">
              <img
                src="/crm-calendar.png"
                alt="OzBridge CRM Demo"
                loading="lazy"
                className="rounded-lg shadow-2xl border border-gray-200"
                style={{
                  height: 'auto',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


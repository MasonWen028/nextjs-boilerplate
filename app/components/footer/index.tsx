import './index.css';

export default function Footer() {
  return (
    <footer className="footer pt-120">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Logo and Description */}
            <div className="lg:col-span-3">
              <div className="footer-widget">
                <div className="logo mb-6">
                  <a href="/">
                    <img
                      src="/fenricwithtext.png"
                      alt="OzBridge CRM Logo"
                      className="h-12"
                    />
                  </a>
                </div>
                <p className="desc text-gray-600 mb-6">
                  OzBridge CRM is your complete management solution. Built specifically for immigration and education professionals.
                </p>
                <ul className="social-links flex gap-3">
                  <li>
                    <a href="#" className="social-link">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="social-link">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="social-link">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* About Us Links */}
            <div className="lg:col-span-5 lg:col-start-5">
              <div className="footer-widget">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Links</h3>
                <ul className="links grid grid-cols-2 gap-3">
                  <li><a href="#home" className="footer-link">Home</a></li>
                  <li><a href="#about" className="footer-link">About</a></li>
                  <li><a href="#features" className="footer-link">Features</a></li>
                  <li><a href="#pricing" className="footer-link">Pricing</a></li>
                  <li><a href="#try-it" className="footer-link">Try It</a></li>
                  <li><a href="/api/check" className="footer-link">API Docs</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <div className="footer-widget">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Subscribe Newsletter</h3>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-500 mb-3"
                  />
                  <button
                    type="submit"
                    className="main-btn btn-hover w-full"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8 pb-8">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} OzBridge CRM. All rights reserved. | Built for Immigration & Education Professionals</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

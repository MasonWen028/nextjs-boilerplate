import Hero from './components/hero';
import Navbar from './components/navbar';
import About from './components/about';
import Features from './components/features';
import TryIt from './components/tryit';
import Pricing from './components/pricing';
import Footer from './components/footer';
import ScrollToTop from './components/scroll-to-top';
import './App.css';

export default function Home() {
  return (
    <>
      <Navbar active="Home" />
      <Hero />
      <About />
      <Features />
      <Pricing />
      <TryIt />
      <Footer />
      <ScrollToTop />
    </>
  );
}

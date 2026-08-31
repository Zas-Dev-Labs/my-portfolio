import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import Admin from './components/Admin';
import SlokaLegal from './components/SlokaLegal';

function Portfolio() {
  return (
    <div className="bg-background text-white min-h-screen font-body overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/sloka-app/privacy-policy" element={<SlokaLegal initialTab="privacy" />} />
        <Route path="/sloka-app/terms-of-use" element={<SlokaLegal initialTab="terms" />} />
        <Route path="/sloka-app" element={<SlokaLegal initialTab="privacy" />} />
        <Route path="/sloka-privacy-policy" element={<SlokaLegal initialTab="privacy" />} />
        <Route path="/sloka-terms-of-use" element={<SlokaLegal initialTab="terms" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

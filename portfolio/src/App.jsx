import React from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

import ThreeScene from './components/ThreeScene';
import ParallaxSection from './components/ParallaxSection';

function App() {
  return (
    <>
      <ThreeScene />
      <Layout>
        <Hero />
        <ParallaxSection className="mb-20">
          <About />
        </ParallaxSection>
        <ParallaxSection offset={30} className="mb-20">
          <Skills />
        </ParallaxSection>
        <ParallaxSection offset={40} className="mb-20">
          <Projects />
        </ParallaxSection>
        <Contact />
      </Layout>
    </>
  );
}

export default App;

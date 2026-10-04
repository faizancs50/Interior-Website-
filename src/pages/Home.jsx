import React, { useEffect, useRef } from 'react';
import Hero from '../components/Hero/Hero';
import Intro from '../components/Intro/Intro';
import Residences from '../components/Residences/Residences';
import Services from '../components/Services/Services';
import Portfolio from '../components/Portfolio/Portfolio';
import Process from '../components/Process/Process';
import Credentials from '../components/Credentials/Credentials';
import Testimonials from '../components/Testimonials/Testimonials';
import FAQ from '../components/FAQ/FAQ';
import CTA from '../components/CTA/CTA';
import { pageEnter } from '../animations/pageTransitions';

const Home = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    pageEnter(pageRef.current);
  }, []);

  return (
    <div ref={pageRef} className="page-home">
      <Hero />
      <Intro />
      <Residences />
      <Services />
      <Portfolio />
      <Process />
      <Credentials />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;

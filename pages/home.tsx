import { useEffect } from 'react';
import Layout from '@/components/layout/layout';
import HeroSection from '@/components/home/hero-section';
import FeaturesSection from '@/components/home/features-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import VideoSection from '@/components/home/video-section';
import PlansSection from '@/components/home/plans-section';
import RulesSection from '@/components/home/rules-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import FAQSection from '@/components/home/faq-section';
import CTASection from '@/components/home/cta-section';

const Home = () => {
  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorLink = target.closest('a[href^="#"]');
      
      if (anchorLink) {
        e.preventDefault();
        const targetId = anchorLink.getAttribute('href');
        
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
          }
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
  
  // Handle hash in URL for direct navigation
  useEffect(() => {
    const handleInitialScroll = () => {
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        setTimeout(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };
    
    handleInitialScroll();
    window.addEventListener('load', handleInitialScroll);
    
    return () => {
      window.removeEventListener('load', handleInitialScroll);
    };
  }, []);

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <VideoSection />
      <PlansSection />
      <RulesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Home;

// In your LandingPage.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import CoursesSection from '../components/courses';
import TestimonialsSlider from '../components/TestimonialsSlider';


const LandingPage = () => {
  return (
    <div>
<div id="hero">
  <HeroSection />
</div>
<div id="courses">
  <CoursesSection />
</div>
<div id="testimonial">
  <TestimonialsSlider />
</div>

    </div>
  );
};

export default LandingPage;
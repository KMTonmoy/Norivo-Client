import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesSection from '../components/Category';
import FeaturedProducts from '../components/FeaturedProductsSection';
import OffersSection from '../components/OffersSection';
import BlogSection from '../components/BlogSection';
import Newsletter from '../components/Newsletter';
import ContactSection from '../components/Contact';
import Faq from '../components/Faq';

const page = () => {
  return (
    <div>
      <HeroCarousel />
      <div className="md:px-10 ">
        <CategoriesSection/>
        <FeaturedProducts/>
        <OffersSection/>
        <BlogSection/>
        <Newsletter/>
        <ContactSection/>
        <Faq/>
      </div>

    </div>
  );
};

export default page;

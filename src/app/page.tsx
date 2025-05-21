import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesSection from '../components/Category';
import FeaturedProducts from '../components/FeaturedProductsSection';
import OffersSection from '../components/OffersSection';
import BlogSection from '../components/BlogSection';
import Newsletter from '../components/Newsletter';

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
      </div>

    </div>
  );
};

export default page;

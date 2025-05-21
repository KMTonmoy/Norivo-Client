import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesSection from '../components/Category';
import FeaturedProducts from '../components/FeaturedProductsSection';

const page = () => {
  return (
    <div>
      <HeroCarousel />
      <div className="md:px-10 ">
        <CategoriesSection/>
        <FeaturedProducts/>
      </div>
    </div>
  );
};

export default page;

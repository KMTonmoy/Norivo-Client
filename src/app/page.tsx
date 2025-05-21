import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesSection from '../components/Category';
import FeaturedProducts from '../components/FeaturedProductsSection';
import OffersSection from '../components/OffersSection';

const page = () => {
  return (
    <div>
      <HeroCarousel />
      <div className="md:px-10 ">
        <CategoriesSection/>
        <FeaturedProducts/>
        <OffersSection/>
      </div>
    </div>
  );
};

export default page;

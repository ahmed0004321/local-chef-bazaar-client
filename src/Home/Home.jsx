import React from 'react';
import Hero from '../Components/Hero/Hero';
import MealForHome from '../Page/MealForHome/MealForHome';
import BlogPreview from '../Components/BlogPreview/BlogPreview';
import CTA from '../Components/Home/CTA';
import Partners from '../Components/Partners/Partners';
import AllReviews from '../Components/AllReviews/AllReviews';
import Newsletter from '../Components/Home/Newsletter';
import HowItWorks from '../Components/Home/HowItWorks';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <HowItWorks />
            <MealForHome></MealForHome>
            <BlogPreview />
            <CTA />
            <Partners />
            <AllReviews></AllReviews>
            <Newsletter />
        </div>
    );
};

export default Home;
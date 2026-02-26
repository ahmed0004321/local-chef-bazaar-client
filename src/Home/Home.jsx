import React from 'react';
import Hero from '../Components/Hero/Hero';
import Meals from '../Page/Meals/Meals';
import MealForHome from '../Page/MealForHome/MealForHome';
import AllReviews from '../Components/AllReviews/AllReviews';
import Partners from '../Components/Partners/Partners';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <MealForHome></MealForHome>
            <Partners />
            <AllReviews></AllReviews>
        </div>
    );
};

export default Home;
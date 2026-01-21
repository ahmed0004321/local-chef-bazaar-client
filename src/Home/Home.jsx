import React from 'react';
import Hero from '../Components/Hero/Hero';
import Meals from '../Page/Meals/Meals';
import MealForHome from '../Page/MealForHome/MealForHome';
import CustomerReviews from '../Components/CustomerReviews/CustomerReviews';
import Works from '../Components/Works/Works';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <MealForHome></MealForHome>
            <CustomerReviews></CustomerReviews>
            <Works></Works>
        </div>
    );
};

export default Home;
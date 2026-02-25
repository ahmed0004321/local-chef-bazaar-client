import React from 'react';
import Hero from '../Components/Hero/Hero';
import Meals from '../Page/Meals/Meals';
import MealForHome from '../Page/MealForHome/MealForHome';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <MealForHome></MealForHome>
        </div>
    );
};

export default Home;
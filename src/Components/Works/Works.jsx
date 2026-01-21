// WhyChooseUs.jsx
import React from "react";
import { FaShieldAlt, FaUsers, FaClock, FaStar } from "react-icons/fa";

const Works = () => {
  const benefits = [
    {
      id: 1,
      icon: <FaShieldAlt />,
      title: "Trusted Providers",
      description:
        "All local service providers are verified to ensure high-quality and reliable services.",
    },
    {
      id: 2,
      icon: <FaUsers />,
      title: "Community Driven",
      description:
        "Join a community of users and providers that share feedback and help each other grow.",
    },
    {
      id: 3,
      icon: <FaClock />,
      title: "Flexible Scheduling",
      description:
        "Book appointments at times that work best for you, with instant confirmations.",
    },
    {
      id: 4,
      icon: <FaStar />,
      title: "Top Ratings",
      description:
        "Providers are rated by users to ensure you always get the best service.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
            data-aos="fade-up"
          >
            <div className="text-purple-500 mb-4 text-5xl">{benefit.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
            <p className="text-gray-200 text-sm">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Works;

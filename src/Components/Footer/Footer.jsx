import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-base-200 text-base-content">
      
      {/* FULL WIDTH WRAPPER */}
      <div className="w-full">
        {/* 7xl CONTENT */}
        <div className="footer sm:footer-horizontal p-10 max-w-7xl mx-auto">
          
          {/* Brand */}
          <aside>
            <h2 className="text-2xl font-bold">LocalChefBazaar</h2>
            <p className="max-w-xs mt-2">
              Connecting local chefs with food lovers.
              Fresh, homemade meals delivered to your door.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-4 text-xl">
              <a className="hover:text-primary cursor-pointer"><FaFacebookF /></a>
              <a className="hover:text-primary cursor-pointer"><FaInstagram /></a>
              <a className="hover:text-primary cursor-pointer"><FaTwitter /></a>
              <a className="hover:text-primary cursor-pointer"><FaLinkedinIn /></a>
            </div>
          </aside>

          {/* Services */}
          <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Home Cooked Meals</a>
            <a className="link link-hover">Chef Registration</a>
            <a className="link link-hover">Online Orders</a>
            <a className="link link-hover">Fast Delivery</a>
          </nav>

          {/* Company */}
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About Us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Careers</a>
            <a className="link link-hover">Blog</a>
          </nav>

          {/* Legal */}
          <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of Use</a>
            <a className="link link-hover">Privacy Policy</a>
            <a className="link link-hover">Cookie Policy</a>
          </nav>
        </div>
      </div>

      {/* FULL WIDTH COPYRIGHT */}
      <div className="border-t border-base-300 w-full">
        <p className="text-center py-4 text-sm">
          © {new Date().getFullYear()} LocalChefBazaar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

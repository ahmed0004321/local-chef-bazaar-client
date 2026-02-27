import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-foreground/5 text-foreground/70 transition-colors duration-300">

      {/* Main Footer Content */}
      <div className="w-full">
        <div className="footer sm:footer-horizontal p-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

          {/* Brand & Social */}
          <aside className="space-y-4 max-w-sm">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                LocalChef<span className="text-primary">Bazaar</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-foreground/60">
              Connecting local chefs with food lovers. We bring fresh, homemade meals directly from community kitchens to your table.
            </p>

            <div className="flex gap-4 pt-2">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center transition-all hover:bg-primary hover:text-white hover:-translate-y-1"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </aside>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-20">
            {/* Services */}
            <nav className="flex flex-col gap-3">
              <h6 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Services</h6>
              <Link to="/meals" className="text-sm hover:text-primary transition-colors">Home Cooked Meals</Link>
              <Link to="/register" className="text-sm hover:text-primary transition-colors">Chef Registration</Link>
              <Link to="/dashboard/myOrders" className="text-sm hover:text-primary transition-colors">Online Orders</Link>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Fast Delivery</Link>
            </nav>

            {/* Company */}
            <nav className="flex flex-col gap-3">
              <h6 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Company</h6>
              <Link to="/about" className="text-sm hover:text-primary transition-colors">About Us</Link>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Contact</Link>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Careers</Link>
              <Link to="/blog" className="text-sm hover:text-primary transition-colors">Blog</Link>
            </nav>

            {/* Legal */}
            <nav className="flex flex-col gap-3">
              <h6 className="text-foreground font-bold uppercase tracking-widest text-xs mb-2">Legal</h6>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Terms of Use</Link>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/FAQ" className="text-sm hover:text-primary transition-colors">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-foreground/5 w-full">
        <div className="max-w-7xl mx-auto px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-foreground/40">
          <p>© {currentYear} LocalChefBazaar. Crafted for community flavor.</p>
          <div className="flex gap-6">
            <Link to="/FAQ" className="hover:text-primary transition-colors">Help Center</Link>
            <Link to="/FAQ" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

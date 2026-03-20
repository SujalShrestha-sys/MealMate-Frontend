import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="bg-linear-to-br from-green-600 via-green-700 to-green-800 text-white py-16 mt-12"
      id="contact"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                <UtensilsCrossed size={24} />
              </div>
              <span className="text-2xl font-bold">MealMate</span>
            </div>
            <p className="text-green-50 leading-relaxed">
              Transforming campus dining with seamless meal planning, ordering,
              and management for students, teachers, and administrators.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white hover:text-green-600 hover:-translate-y-1 transition-all duration-200"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/10 w-fit">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Menu", path: "/menu" },
                { name: "Plans", path: "/plans" },
                { name: "Order Tracking", path: "/order-tracking" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-green-50 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-px bg-white/0 group-hover:bg-white transition-all group-hover:w-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/10 w-fit">
              Quick Access
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Login", path: "/login" },
                { name: "Sign Up", path: "/SignUp" },
                { name: "Contact Us", path: "#contact" },
                { name: "FAQ", path: "#" },
              ].map((item) => (
                <li key={item.name}>
                  {item.path.startsWith("#") ? (
                    <a
                      href={item.path}
                      className="text-green-50 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-px bg-white/0 group-hover:bg-white transition-all group-hover:w-3" />
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-green-50 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-px bg-white/0 group-hover:bg-white transition-all group-hover:w-3" />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-white/10 w-fit">
              Contact
            </h3>
            <ul className="space-y-4 text-green-50">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-1 opacity-80" />
                <div>
                  <p className="text-white font-medium">Support</p>
                  <p className="text-sm">Support@mealmate.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-1 rounded bg-white/10">
                  <span className="text-[10px] font-bold">Call</span>
                </div>
                <div>
                  <p className="text-white font-medium">+977 9800925222</p>
                  <p className="text-sm">Dharan, Sunsari, Nepal</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/20 text-green-50 text-sm">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-bold">MealMate</span>. All rights
            reserved.
          </p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
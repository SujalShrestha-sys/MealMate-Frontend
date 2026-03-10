import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, UtensilsCrossed, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Button from "./Button";
import useAuthStore from "../../store/useAuthStore";
import useCartStore from "../../store/useCartStore";
import CartDrawer from "../cart/CartDrawer";

const links = ["Home", "Menu", "Order Tracking", "Plans"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  // Get shared state from global stores
  const { isLoggedIn, logout } = useAuthStore();
  const { getCartCount } = useCartStore();

  const cartCount = getCartCount();

  // Handle scroll effects and active section detection
  useEffect(() => {
    const handleScroll = () => {
      // Scrolled state for pill transformation
      setScrolled(window.scrollY > 20);

      // Active section detection
      const sectionIds = links.map((link) =>
        link.toLowerCase().replace(/\s+/g, "-"),
      );
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
          }
        }
      }

      // Special case for home (top of page)
      if (window.scrollY < 100) setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 w-full z-50 flex justify-center px-4 transition-all duration-500 ${scrolled ? "pt-4 md:pt-4" : "pt-3 md:pt-3"} pointer-events-none`}
      >
        <nav
          className={`
            pointer-events-auto
            transition-all duration-500 ease-in-out
            flex items-center justify-between
            ${
              scrolled
                ? "max-w-5xl w-full bg-white/80 backdrop-blur-2xl rounded-full px-8 py-2.5 shadow-lg shadow-green-600/20"
                : "max-w-7xl w-full bg-transparent px-2 py-3 "
            }
          `}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className={`
              flex items-center justify-center rounded-xl bg-linear-to-br from-green-600 to-green-700 text-white transition-all duration-500
              ${scrolled ? "w-8 h-8 rounded-lg" : "w-10 h-10"}
              group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-green-600/30
            `}
            >
              <UtensilsCrossed
                size={scrolled ? 16 : 20}
                className="drop-shadow-sm"
              />
            </div>
            <span
              className={`font-bold tracking-tight text-slate-800 transition-all duration-300 ${scrolled ? "text-base" : "text-xl"}`}
            >
              MealMate<span className="text-green-600"></span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const isActive =
                activeSection === link.toLowerCase().replace(" ", "-");
              const href =
                link === "Home"
                  ? "/"
                  : link === "Menu"
                    ? "/menu"
                    : link === "Plans"
                      ? "/plans"
                      : link === "Order Tracking"
                        ? "/order-tracking"
                        : `#${link.toLowerCase().replace(" ", "-")}`;

              return (
                <Link
                  key={link}
                  to={href}
                  className={`
                    relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300
                    ${
                      isActive
                        ? "text-green-700"
                        : scrolled
                          ? "text-slate-500 hover:text-slate-800"
                          : "text-slate-600 hover:text-slate-900"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-green-50/70 rounded-full -z-10 animate-fade-in" />
                  )}
                  <span className="relative z-10">{link}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Cart Button */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="group relative flex items-center justify-center transition-all duration-300 active:scale-95"
                >
                  <div
                    className={`
                    relative flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 
                    shadow-xs transition-all duration-500 group-hover:bg-white group-hover:border-green-200 group-hover:shadow-md
                    ${scrolled ? "w-9 h-9" : "w-11 h-11"}
                  `}
                  >
                    <ShoppingBag
                      size={scrolled ? 18 : 22}
                      className="text-slate-600 group-hover:text-green-600 transition-colors"
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white border-2 border-white shadow-sm ring-1 ring-green-600/10">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </button>

                {/* Profile Button */}
                <button
                  className="group relative flex items-center justify-center transition-all duration-300 active:scale-95"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  title="Click to logout"
                >
                  <div
                    className={`
                    relative flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 
                    shadow-xs transition-all duration-500 group-hover:bg-white group-hover:border-red-200 group-hover:shadow-md
                    ${scrolled ? "w-9 h-9" : "w-11 h-11"}
                  `}
                  >
                    <User
                      size={scrolled ? 18 : 22}
                      className="text-slate-600 group-hover:text-red-500 transition-colors"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse-slow" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full px-5 py-2 border-slate-200 text-slate-700 hover:text-green-700 hover:border-green-600 font-bold bg-white/50 transition-all active:scale-95"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full px-5 py-2 font-bold shadow-md shadow-green-600/10 bg-green-600 hover:bg-green-700 active:scale-95 transition-all"
                  onClick={() => navigate("/SignUp")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`
              md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
              ${scrolled ? "bg-slate-100/80 text-slate-600" : "bg-white/50 backdrop-blur-sm text-slate-800 shadow-xs"}
              active:scale-90 hover:bg-slate-200/50
            `}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 right-0 mt-4 mx-2 text-left pointer-events-auto"
              >
                <div className="bg-white/98 backdrop-blur-3xl rounded-3xl border border-slate-100 p-6 shadow-2xl">
                  <div className="flex flex-col gap-2.5">
                    {links.map((link) => {
                      const isActive =
                        activeSection ===
                          link.toLowerCase().replace(" ", "-") ||
                        (link === "Order Tracking" &&
                          window.location.pathname === "/order-tracking");
                      const href =
                        link === "Home"
                          ? "/"
                          : link === "Menu"
                            ? "/menu"
                            : link === "Plans"
                              ? "/plans"
                              : link === "Order Tracking"
                                ? "/order-tracking"
                                : `#${link.toLowerCase().replace(" ", "-")}`;

                      return (
                        <Link
                          key={link}
                          to={href}
                          className={`
                            px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between
                            ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }
                          `}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>{link}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </motion.div>
                          )}
                        </Link>
                      );
                    })}

                    <div className="h-px bg-slate-100/80 my-3 mx-4" />

                    {isLoggedIn ? (
                      <div className="flex flex-col gap-3 pt-2">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setCartOpen(true);
                          }}
                          className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-green-50 transition-colors"
                        >
                          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 group-hover:text-green-600 transition-all duration-500">
                            <ShoppingBag size={22} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800">
                              Your Cart
                            </span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {cartCount} items selected
                            </p>
                          </div>
                        </button>

                        <div
                          className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 rounded-2xl cursor-pointer group hover:bg-red-50 transition-colors"
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                        >
                          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 group-hover:text-red-500 transition-all duration-500">
                            <User size={22} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                              Logout
                            </span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              Tap to sign out
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button
                          variant="secondary"
                          size="md"
                          className="rounded-2xl font-bold border-slate-200"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate("/login");
                          }}
                        >
                          Login
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          className="rounded-2xl font-bold"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate("/SignUp");
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;

import React from "react";
import { Leaf, Package, Sparkles, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ activeTab, setActiveTab, isDark, setIsDark }) {
  const tabs = ["product", "impact"];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-5xl h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-400 font-bold text-2xl tracking-tight transition-colors duration-500">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
            <Leaf className="w-6 h-6" />
          </div>

          <span>
            Rayeva
            <span className="text-slate-400 dark:text-slate-500 font-light transition-colors duration-500">
              AI
            </span>
          </span>
        </div>

        {/* Right Side (Tabs + Dark Mode) */}
        <div className="flex items-center gap-3">
          
          {/* Tabs */}
          <div className="flex gap-1 p-1.5 bg-slate-100/80 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors duration-500">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "text-emerald-800 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    {tab === "product" ? (
                      <>
                        <Package className="w-4 h-4" />
                        <span className="hidden sm:inline">Product AI</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">Impact AI</span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:shadow-sm transition-all duration-300 group overflow-hidden"
            aria-label="Toggle Dark Mode"
          >
            {/* Sun icon */}
            <motion.div
              initial={false}
              animate={{
                rotate: isDark ? 180 : 0,
                scale: isDark ? 0.8 : 1,
                opacity: isDark ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </motion.div>

            {/* Moon icon */}
            <motion.div
              initial={false}
              animate={{
                rotate: isDark ? 0 : -180,
                scale: isDark ? 1 : 0.8,
                opacity: isDark ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </motion.div>

            {/* Invisible spacer to maintain size */}
            <div className="w-5 h-5 opacity-0" />
          </button>
        </div>
      </div>
    </nav>
  );
}
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, Search, ChevronDown } from "lucide-react";

/* =========================
   CARD COMPONENT
========================= */
export function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/50 rounded-3xl p-6 md:p-8 transition-colors duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* =========================
   BUTTON COMPONENT
========================= */
export function Button({
  children,
  loading,
  loadingText,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`group relative flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/25 dark:shadow-emerald-900/20 hover:shadow-emerald-500/40 dark:hover:shadow-emerald-900/40 hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          {loadingText && (
            <AnimatePresence mode="wait">
              <motion.span
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {loadingText}
              </motion.span>
            </AnimatePresence>
          )}
        </>
      ) : (
        <>
          {Icon && (
            <Icon className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
          )}
          {children}
        </>
      )}
    </button>
  );
}

/* =========================
   INPUT COMPONENT
========================= */
export function Input({
  label,
  helperText,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1 transition-colors duration-500">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors duration-500" />
        )}

        <input
          {...props}
          className={`w-full bg-white dark:bg-slate-950 border border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl ${
            Icon ? "pl-11 pr-4" : "px-4"
          } py-3.5 text-slate-900 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 outline-none shadow-sm ${className}`}
        />
      </div>

      {helperText && (
        <p className="text-sm text-slate-600 dark:text-slate-400 ml-1 mt-1.5 transition-colors duration-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

/* =========================
   TEXTAREA COMPONENT
========================= */
export function Textarea({
  label,
  helperText,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1 transition-colors duration-500">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className={`w-full bg-white dark:bg-slate-950 border border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl px-4 py-3.5 text-slate-900 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 outline-none shadow-sm resize-none ${className}`}
      />

      {helperText && (
        <p className="text-sm text-slate-600 dark:text-slate-400 ml-1 mt-1.5 transition-colors duration-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

/* =========================
   BADGE COMPONENT
========================= */
export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:
      "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60",
    success:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
    primary:
      "bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm transition-colors duration-500 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/* =========================
   MODAL COMPONENT
========================= */
export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* =========================
   SELECT WITH SEARCH
========================= */
export function SelectWithSearch({
  options,
  value,
  onChange,
  placeholder,
  icon: Icon,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {Icon && (
        <Icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10 pointer-events-none" />
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 rounded-xl ${
          Icon ? "pl-11 pr-4" : "px-4"
        } py-3.5 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 outline-none shadow-sm text-left`}
      >
        <span
          className={
            selectedOption ? "" : "text-slate-400 dark:text-slate-500"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-sm text-slate-500 text-center">
                  No results found
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      value === opt.value
                        ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { generateImpact } from "../services/api.js";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Leaf,
  PackageSearch,
  Settings2,
} from "lucide-react";
import { Card, Button, Input } from "../components/ui.jsx";
import { motion, AnimatePresence } from "framer-motion";

// Rotating loading messages while AI is working
const LOADING_MESSAGES = [
  "Calculating plastic saved...",
  "Calculating carbon avoided...",
  "Analyzing environmental impact...",
  "Drafting impact statement...",
  "Finalizing report...",
];

export default function ImpactForm() {
  const [formData, setFormData] = useState({
    quantity: 1,
    locally_sourced: false,
    model: "gemini-3-flash-preview",
    temperature: 0.7,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Cycle through loading messages while request is running
  useEffect(() => {
    if (!loading) return;

    setLoadingMessageIdx(0);

    const interval = setInterval(() => {
      setLoadingMessageIdx((prev) =>
        prev + 1 < LOADING_MESSAGES.length ? prev + 1 : prev
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateImpact({
        quantity: Number(formData.quantity),
        locally_sourced: formData.locally_sourced,
        model: formData.model,
        temperature: formData.temperature,
      });

      // Backend sometimes nests data differently, so handling both
      setResult(response.data?.data || response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "An error occurred during AI generation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          AI Impact Reporting
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Calculate environmental impact metrics and generate
          customer-facing sustainability statements.
        </p>
      </motion.div>

      {/* Main Form Card */}
      <Card delay={0.1}>
        {/* Toggle AI Settings */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            AI Settings
          </button>
        </div>

        {/* Collapsible Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-5 bg-slate-100/50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Model Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Model Select */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      AI Model
                    </label>

                    <select
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          model: e.target.value,
                        })
                      }
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="gemini-3-flash-preview">
                        Gemini 3 Flash (Fast)
                      </option>
                      <option value="gemini-3.1-pro-preview">
                        Gemini 3.1 Pro (Advanced)
                      </option>
                    </select>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Temperature: {formData.temperature}
                    </label>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Order Quantity"
            type="number"
            min="1"
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />

          {/* Locally Sourced Checkbox */}
          <label className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
            <input
              type="checkbox"
              className="accent-emerald-500 w-5 h-5"
              checked={formData.locally_sourced}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  locally_sourced: e.target.checked,
                })
              }
            />

            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Locally Sourced Materials
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Reduces carbon footprint.
              </p>
            </div>
          </label>

          <Button
            type="submit"
            loading={loading}
            loadingText={LOADING_MESSAGES[loadingMessageIdx]}
            icon={TrendingUp}
          >
            Calculate & Generate Statement
          </Button>
        </form>
      </Card>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl flex gap-3 text-red-700 dark:text-red-400"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{error}</p>
        </motion.div>
      )}

      {/* Result Card */}
      {result && (
        <Card delay={0.2} className="space-y-8">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-5">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Impact Report
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <PackageSearch className="w-4 h-4" />
                Plastic Saved
              </span>

              <p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-3">
                {result.plastic_saved_grams} g
              </p>
            </div>

            <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Carbon Avoided
              </span>

              <p className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-3">
                {Number(result.carbon_avoided_kg).toFixed(2)} kg
              </p>
            </div>
          </div>

          {/* AI Statement */}
          <div className="space-y-3 pt-4">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider">
              AI Generated Statement
            </span>

            <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-900/20 rounded-3xl border border-emerald-200/50 dark:border-emerald-800/30">
              <Sparkles className="absolute top-4 right-4 w-6 h-6 text-emerald-200 dark:text-emerald-800/50" />
              <p className="text-emerald-900 dark:text-emerald-300 italic font-medium leading-relaxed text-lg">
                "{result.impact_statement}"
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
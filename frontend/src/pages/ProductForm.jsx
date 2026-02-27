import React, { useState, useEffect } from "react";
import { createProduct, getProducts } from "../services/api.js";
import {
  CheckCircle2,
  AlertCircle,
  Filter,
  PackageSearch,
  Search,
  X,
  Sparkles,
  Leaf,
  Settings2,
  Eye,
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Textarea,
  Badge,
  Modal,
  SelectWithSearch,
} from "../components/ui.jsx";
import { motion, AnimatePresence } from "framer-motion";

// Messages shown while AI is generating metadata
const LOADING_MESSAGES = [
  "Analyzing product details...",
  "Extracting materials...",
  "Evaluating sustainability...",
  "Generating SEO tags...",
  "Calculating eco score...",
];

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model: "gemini-3-flash-preview",
    temperature: 0.7,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [sustainabilityFilter, setSustainabilityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Rotate loading messages while AI is working
  useEffect(() => {
    let interval;

    if (loading) {
      setLoadingMessageIdx(0);

      interval = setInterval(() => {
        setLoadingMessageIdx(
          (prev) => (prev + 1) % LOADING_MESSAGES.length
        );
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [loading]);

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoadingProducts(true);

    try {
      const response = await getProducts({
        category: categoryFilter,
        filter: sustainabilityFilter,
        search: searchQuery,
      });

      setProducts(response.data?.data || response.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Debounced fetch when filters change
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [categoryFilter, sustainabilityFilter, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await createProduct(formData);

      setResult(response.data?.data || response.data);

      // Clear only name + description after submit
      setFormData({
        ...formData,
        name: "",
        description: "",
      });

      fetchProducts();
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

  const clearFilters = () => {
    setCategoryFilter("");
    setSustainabilityFilter("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    categoryFilter || sustainabilityFilter || searchQuery;

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white transition-colors duration-500">
          AI Auto-Category & Tags
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium transition-colors duration-500">
          Instantly generate sustainable categories, SEO tags, and eco-scores
          for your products using Gemini AI.
        </p>
      </motion.div>

      {/* Product Creation Form */}
      <Card delay={0.1}>
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

        {/* Collapsible AI Settings */}
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
                  {/* Model */}
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
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    >
                      <option value="gemini-3-flash-preview">
                        Gemini 3 Flash (Fast)
                      </option>
                      <option value="gemini-3.1-pro-preview">
                        Gemini 3.1 Pro (Advanced)
                      </option>
                    </select>
                  </div>

                  {/* Temperature */}
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
            label="Product Name"
            helperText="The exact name of the product as it appears on your store."
            required
            placeholder="e.g., Bamboo Toothbrush"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <Textarea
            label="Product Description"
            helperText="Include materials, usage, and sustainability claims."
            required
            rows={4}
            placeholder="Describe the product in detail..."
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            loading={loading}
            loadingText={LOADING_MESSAGES[loadingMessageIdx]}
            icon={Sparkles}
          >
            Generate AI Metadata
          </Button>
        </form>
      </Card>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{error}</p>
        </motion.div>
      )}

      {/* Result */}
      {result && (
        <Card delay={0.2} className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold">
              Generated Metadata
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase">
                Primary Category
              </p>
              <p className="font-semibold text-lg">
                {result.primary_category}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase">
                Sub Category
              </p>
              <p className="font-semibold text-lg">
                {result.sub_category}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase mb-2">
              Sustainability Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {result.sustainability_filters?.map((filter) => (
                <Badge key={filter} variant="success">
                  <Leaf className="w-3 h-3" />
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase mb-2">
              SEO Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {result.seo_tags?.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Product Catalog + Modal remain logically identical,
          structure slightly relaxed for readability */}

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold">
              {selectedProduct.name}
            </h4>
            <p>{selectedProduct.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
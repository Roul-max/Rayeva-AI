import React, { useState, useEffect, useMemo } from "react";
import { createProduct, getProducts } from "../services/api.js";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Leaf,
  Settings2,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Textarea,
  Badge,
  Modal,
} from "../components/ui.jsx";
import { motion, AnimatePresence } from "framer-motion";

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

  /* -------------------------
     Rotate loading messages
  ------------------------- */
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

  /* -------------------------
     Fetch Products
  ------------------------- */
  const fetchProducts = async () => {
    setLoadingProducts(true);

    try {
      const response = await getProducts({
        category: categoryFilter,
        filter: sustainabilityFilter,
        search: searchQuery,
      });

      setProducts(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [categoryFilter, sustainabilityFilter, searchQuery]);

  /* -------------------------
     Average Eco Score (NEW)
  ------------------------- */
  const averageEcoScore = useMemo(() => {
    if (!products.length) return 0;
    const total = products.reduce(
      (sum, p) => sum + (p.eco_score || 0),
      0
    );
    return Math.round(total / products.length);
  }, [products]);

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await createProduct(formData);

      setResult(response?.data || response);

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

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          AI Auto-Category & Tags
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Instantly generate sustainable categories, SEO tags, and eco-scores
          for your products using Gemini AI.
        </p>
      </motion.div>

      {/* FORM */}
      <Card delay={0.1}>
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Settings2 className="w-4 h-4" />
            AI Settings
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Product Name"
            required
            placeholder="e.g., Bamboo Toothbrush"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <Textarea
            label="Product Description"
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

      {/* ERROR */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 bg-red-100 border rounded-2xl flex gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </motion.div>
      )}

      {/* RESULT */}
      {result && (
        <Card delay={0.2} className="space-y-8">
          <div className="flex items-center gap-3 border-b pb-5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold">
              Generated Metadata
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs font-bold uppercase">
                Primary Category
              </span>
              <p className="font-semibold text-lg">
                {result?.primary_category}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase">
                Sub Category
              </span>
              <p className="font-semibold text-lg">
                {result?.sub_category}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase">
                Eco Score
              </span>

              {/* High Impact Badge (NEW) */}
              <div className="flex items-center gap-2 mt-1">
                {result?.eco_score > 85 && (
                  <Badge variant="success">
                    High Impact
                  </Badge>
                )}
                <p className="text-2xl font-bold text-emerald-600">
                  {result?.eco_score}/100
                </p>
              </div>

              {/* Animated Progress Bar (NEW) */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result?.eco_score || 0}%` }}
                  transition={{ duration: 1.2 }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase">
              Sustainability Filters
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {result?.sustainability_filters?.map((filter) => (
                <Badge key={filter} variant="success">
                  <Leaf className="w-3 h-3" />
                  {filter}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase">
              SEO Tags
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {result?.seo_tags?.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Average Eco Score Dashboard (NEW) */}
      {products.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-slate-500">
                Average Eco Score
              </p>
              <p className="text-4xl font-black text-emerald-600">
                {averageEcoScore}/100
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500" />
          </div>
        </Card>
      )}

      {/* Modal */}
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
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BarChart2, Search, Percent, Shuffle } from "lucide-react";

const Header = () => (
  <motion.div
    className="max-w-4xl mx-auto flex flex-col items-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
      Sarva Math Suite
    </h1>
    <Link
      href="/"
      className="flex items-center text-sm text-gray-600 hover:text-purple-500 mb-6 transition"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <BarChart2 className="w-6 h-6 mr-2 text-purple-600" />
      Statistics Helper
    </h2>
  </motion.div>
);

// Utility for percentile
function getPercentile(arr: number[], p: number) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

// Formulas for display
const formulas: Record<string, string> = {
  Count: "n = number of observations",
  Sum: "Σxᵢ = x₁ + x₂ + ... + xₙ",
  Mean: "mean = (1/n) Σxᵢ",
  Median: "middle value of sorted data",
  Mode: "most frequent value(s)",
  Min: "minimum value",
  Max: "maximum value",
  Range: "max - min",
  Midrange: "(min + max) / 2",
  Variance_Pop: "σ² = (1/n) Σ(xᵢ - mean)²",
  Variance_Sample: "s² = (1/(n-1)) Σ(xᵢ - mean)²",
  StdDev_Pop: "σ = √σ²",
  StdDev_Sample: "s = √s²",
  Geometric_Mean: "GM = (Πxᵢ)^(1/n)",
  Harmonic_Mean: "HM = n / Σ(1/xᵢ)",
  Coefficient_of_Variation: "CV = σ / mean",
  MAD: "MAD = (1/n) Σ|xᵢ - mean|",
  Q1: "25th percentile",
  Q3: "75th percentile",
  IQR: "IQR = Q3 - Q1",
  Skewness: "γ1 = (1/n Σ(xᵢ - mean)³) / σ³",
  Kurtosis: "γ2 = (1/n Σ(xᵢ - mean)⁴) / σ⁴ - 3",
  Covariance: "cov = (1/n) Σ(xᵢ - mean_x)(yᵢ - mean_y)",
  Correlation: "r = cov / (σₓ σᵧ)",
  Slope: "b = cov / σₓ²",
  Intercept: "a = mean_y - b·meanₓ",
};

export default function StatisticsHelperPage() {
  const [input, setInput] = useState("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [enableTwoVar, setEnableTwoVar] = useState(false);
  const [input2, setInput2] = useState("");
  const [numbers2, setNumbers2] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customPct, setCustomPct] = useState<string>("90");

  const parseList = (raw: string) =>
    raw.split(/[,\s]+/).map(Number).filter((v) => !isNaN(v));

  const handleInput = (raw: string) => {
    setInput(raw);
    setNumbers(parseList(raw));
  };
  const handleInput2 = (raw: string) => {
    setInput2(raw);
    setNumbers2(parseList(raw));
  };

  const stats = useMemo(() => {
    const n = numbers.length;
    if (!n) return {} as Record<string, any>;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sorted = [...numbers].sort((a, b) => a - b);
    const median =
      n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];
    const freq: Record<number, number> = {};
    numbers.forEach((x) => (freq[x] = (freq[x] || 0) + 1));
    const maxFreq = Math.max(...Object.values(freq));
    const modeArr = Object.entries(freq)
      .filter(([, c]) => c === maxFreq)
      .map(([x]) => Number(x));
    const mode = modeArr.length === n ? "No mode" : modeArr.join(", ");
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const midrange = (min + max) / 2;
    const variancePop =
      numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
    const varianceSample =
      n > 1
        ? numbers.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1)
        : null;
    const stdDevPop = Math.sqrt(variancePop);
    const stdDevSample = varianceSample !== null ? Math.sqrt(varianceSample) : null;
    const geoProd = numbers.reduce((a, b) => a * b, 1);
    const geoMean = Math.pow(Math.abs(geoProd), 1 / n) * (geoProd < 0 ? -1 : 1);
    const harmMean = n / numbers.reduce((s, x) => s + 1 / x, 0);
    const coefVar = stdDevPop / mean;
    const mad = numbers.reduce((s, x) => s + Math.abs(x - mean), 0) / n;
    const q1 = getPercentile(numbers, 25);
    const q3 = getPercentile(numbers, 75);
    const iqr = q1 !== null && q3 !== null ? q3 - q1 : null;
    const p = parseFloat(customPct);
    const customVal = isNaN(p) ? null : getPercentile(numbers, p);
    const skewness =
      numbers.reduce((s, x) => s + (x - mean) ** 3, 0) / n / stdDevPop ** 3;
    const kurtosis =
      numbers.reduce((s, x) => s + (x - mean) ** 4, 0) / n / stdDevPop ** 4 - 3;

    let cov = null,
      corr = null,
      slope = null,
      intercept = null;
    if (enableTwoVar && numbers2.length === n) {
      const mean2 = numbers2.reduce((a, b) => a + b, 0) / n;
      cov =
        numbers.reduce(
          (s, x, i) => s + (x - mean) * (numbers2[i] - mean2),
          0
        ) / n;
      corr =
        cov / (stdDevPop *
          Math.sqrt(
            numbers2.reduce((s, y) => s + (y - mean2) ** 2, 0) / n
          ));
      slope = cov / variancePop;
      intercept = mean2 - slope * mean;
    }

    return {
      Count: n,
      Sum: sum.toFixed(4),
      Mean: mean.toFixed(4),
      Median: median.toFixed(4),
      Mode: mode,
      Min: min,
      Max: max,
      Range: range,
      Midrange: midrange.toFixed(4),
      Variance_Pop: variancePop.toFixed(4),
      Variance_Sample: varianceSample !== null ? varianceSample.toFixed(4) : "N/A",
      StdDev_Pop: stdDevPop.toFixed(4),
      StdDev_Sample: stdDevSample !== null ? stdDevSample.toFixed(4) : "N/A",
      Geometric_Mean: geoMean.toFixed(4),
      Harmonic_Mean: harmMean.toFixed(4),
      Coefficient_of_Variation: coefVar.toFixed(4),
      MAD: mad.toFixed(4),
      Q1: q1,
      Q3: q3,
      IQR: iqr,
      Skewness: skewness.toFixed(4),
      Kurtosis: kurtosis.toFixed(4),
      [`P_${customPct}%`]: customVal,
      ...(enableTwoVar && numbers2.length === n
        ? {
            Covariance: cov?.toFixed(4),
            Correlation: corr?.toFixed(4),
            Slope: slope?.toFixed(4),
            Intercept: intercept?.toFixed(4),
          }
        : {}),
    };
  }, [numbers, numbers2, enableTwoVar, customPct]);

  const list = useMemo(
    () =>
      Object.entries(stats)
        .map(([key, value]) => ({ key, value }))
        .filter((item) =>
          item.key.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [stats, searchTerm]
  );

  return (
    <motion.div
      className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />

      <motion.div
        className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Search className="w-4 h-4 mr-2 text-gray-500" />
            Enter numbers:
          </label>
          <textarea
            rows={3}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm resize-none"
            placeholder="e.g. 4, 7, 2, 9, 5"
          />
        </div>

        <div className="flex items-center space-x-2">
          <motion.input
            type="checkbox"
            id="twoVar"
            checked={enableTwoVar}
            onChange={() => setEnableTwoVar(!enableTwoVar)}
            className="mr-2"
            whileTap={{ scale: 1.2 }}
          />
          <label htmlFor="twoVar" className="text-sm text-gray-600 flex items-center">
            <Shuffle className="w-4 h-4 mr-1 text-gray-500" />
            Enable two-variable stats
          </label>
        </div>

        {enableTwoVar && (
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Search className="w-4 h-4 mr-2 text-gray-500" />
              Enter second dataset:
            </label>
            <textarea
              rows={2}
              value={input2}
              onChange={(e) => handleInput2(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm resize-none"
              placeholder="e.g. 3, 8, 1, 4, 6"
            />
          </div>
        )}

        {numbers.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center">
                <Search className="w-4 h-4 mr-2 text-gray-500" />
                Search statistics:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. mean, mode, variance"
                className="w-full p-2 border rounded-md shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {list.map(({ key, value }) => (
                <motion.div
                  key={key}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm break-words"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
                    {key.replace(/_/g, " ")}
                    {key === `P_${customPct}%` && (
                      <Percent className="w-4 h-4 ml-2 text-gray-500" />
                    )}
                  </h4>
                  <p className="text-xl text-gray-800 font-medium break-words">
                    {value}
                  </p>
                  {formulas[key] && (
                    <p className="text-xs text-gray-500 mt-2 whitespace-pre-line">
                      {formulas[key]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex items-center">
              <label className="block text-sm font-medium mb-1 mr-2 flex items-center">
                <Percent className="w-4 h-4 mr-1 text-gray-500" />
                Custom percentile (%):
              </label>
              <motion.input
                type="number"
                value={customPct}
                onChange={(e) => setCustomPct(e.target.value)}
                className="w-24 p-2 border rounded-md shadow-sm"
                min={0}
                max={100}
                whileFocus={{ scale: 1.05 }}
              />
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

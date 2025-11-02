"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BarChart2, CheckCircle } from "lucide-react";

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
      Chi-Square Tests
    </h2>
  </motion.div>
);

const parseNumbers = (input) => input.split(/[\,\s]+/).map(Number).filter((n) => !isNaN(n));

const ChiSquarePage = () => {
  const [testType, setTestType] = useState("goodness");
  const [observed, setObserved] = useState("");
  const [expected, setExpected] = useState("");

  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrix, setMatrix] = useState(() => Array(2).fill(null).map(() => Array(2).fill("")));

  const [result, setResult] = useState(null);

  useEffect(() => {
    setMatrix(Array(rows).fill(null).map(() => Array(cols).fill("")));
  }, [rows, cols]);

  const handleMatrixChange = (i, j, value) => {
    setMatrix(prev => {
      const updated = prev.map(row => [...row]);
      updated[i][j] = value;
      return updated;
    });
  };

  const runGoodnessTest = () => {
    const obs = parseNumbers(observed);
    const exp = parseNumbers(expected);
    if (obs.length !== exp.length || obs.length === 0) {
      setResult("Observed and expected values must be the same length.");
      return;
    }
    let chi = 0;
    for (let i = 0; i < obs.length; i++) {
      if (exp[i] === 0) continue;
      chi += ((obs[i] - exp[i]) ** 2) / exp[i];
    }
    setResult({ "Chi-Square Statistic": chi.toFixed(4), "Degrees of Freedom": obs.length - 1 });
  };

  const runMatrixTest = () => {
    const numericMatrix = matrix.map(row => row.map(cell => parseFloat(cell) || 0));
    const rowSums = numericMatrix.map(row => row.reduce((a, b) => a + b, 0));
    const colSums = numericMatrix[0].map((_, j) => numericMatrix.reduce((sum, row) => sum + row[j], 0));
    const total = rowSums.reduce((a, b) => a + b, 0);

    let chi = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const expected = (rowSums[i] * colSums[j]) / total;
        if (expected !== 0) {
          chi += ((numericMatrix[i][j] - expected) ** 2) / expected;
        }
      }
    }
    const dof = (rows - 1) * (cols - 1);
    setResult({ "Chi-Square Statistic": chi.toFixed(4), "Degrees of Freedom": dof });
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setTestType("goodness")} className={`px-4 py-2 rounded-md border ${testType === "goodness" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}>Goodness of Fit</button>
            <button onClick={() => setTestType("independence")} className={`px-4 py-2 rounded-md border ${testType === "independence" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}>Independence</button>
            <button onClick={() => setTestType("homogeneity")} className={`px-4 py-2 rounded-md border ${testType === "homogeneity" ? "bg-purple-600 text-white" : "bg-white text-gray-700 border-gray-300"}`}>Homogeneity</button>
          </div>

          {testType === "goodness" && (
            <div className="space-y-2">
              <textarea value={observed} onChange={(e) => setObserved(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Observed values (comma or space separated)" />
              <textarea value={expected} onChange={(e) => setExpected(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Expected values (same length)" />
              <button onClick={runGoodnessTest} className="w-full bg-purple-600 text-white rounded-md py-2 font-medium hover:bg-purple-700 transition">Run Goodness-of-Fit Test</button>
            </div>
          )}

          {(testType === "independence" || testType === "homogeneity") && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input type="number" min={1} value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-20 p-2 border rounded-md" />
                <input type="number" min={1} value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-20 p-2 border rounded-md" />
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {matrix.map((row, i) =>
                  row.map((val, j) => (
                    <input
                      key={`cell-${i}-${j}`}
                      type="number"
                      value={val}
                      onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                      className="p-2 border text-center border-gray-300 rounded"
                    />
                  ))
                )}
              </div>
              <button onClick={runMatrixTest} className="w-full bg-purple-600 text-white rounded-md py-2 font-medium hover:bg-purple-700 transition">
                Run {testType === "independence" ? "Independence" : "Homogeneity"} Test
              </button>
            </div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold">Results</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {typeof result === 'string' ? <p className="text-sm text-red-600">{result}</p> : Object.entries(result).map(([key, val]) => (
                    <div key={key} className="text-sm text-gray-700">
                      <span className="font-medium">{key}: </span>{val}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChiSquarePage;

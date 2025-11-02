"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoveDiagonal } from "lucide-react";
import numeric from "numeric";

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
      <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
    </Link>
    <h2 className="text-4xl font-extrabold mb-6 flex items-center">
      <MoveDiagonal className="w-6 h-6 mr-2 text-purple-600" />
      Orthogonal Projections
    </h2>
  </motion.div>
);

const Page = () => {
  const [dimension, setDimension] = useState(2);
  const [vectorU, setVectorU] = useState<string[]>(["", ""]);
  const [vectorV, setVectorV] = useState<string[]>(["", ""]);
  const [projection, setProjection] = useState<string[] | null>(null);
  const [gsResult, setGsResult] = useState<string[][] | null>(null);

  const handleChange = (setter: any, index: number, value: string) => {
    setter((prev: string[]) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const updateDimension = (dim: number) => {
    setDimension(dim);
    setVectorU(Array(dim).fill(""));
    setVectorV(Array(dim).fill(""));
  };

  const computeProjection = () => {
    const u = vectorU.map(val => parseFloat(val) || 0);
    const v = vectorV.map(val => parseFloat(val) || 0);

    const dotUV = numeric.dot(u, v);
    const dotUU = numeric.dot(u, u);
    const scale = dotUV / dotUU;
    const proj = numeric.mul(scale, u);

    setProjection(proj.map(val => val.toFixed(4)));
  };

  const gramSchmidt = () => {
    const u = vectorU.map(val => parseFloat(val) || 0);
    const v = vectorV.map(val => parseFloat(val) || 0);
    const vectors = [u, v];

    const orthogonal = [];

    for (let i = 0; i < vectors.length; i++) {
      let vi = [...vectors[i]];
      for (let j = 0; j < orthogonal.length; j++) {
        const proj = numeric.mul(
          numeric.dot(vi, orthogonal[j]) / numeric.dot(orthogonal[j], orthogonal[j]),
          orthogonal[j]
        );
        vi = numeric.sub(vi, proj);
      }
      orthogonal.push(vi);
    }

    setGsResult(orthogonal.map(vec => vec.map(v => v.toFixed(4))));
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />

      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <p className="text-base text-gray-600">
          Work with orthogonal vectors and projections.
        </p>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Vector Dimension:</label>
          <input type="number" min={1} value={dimension} onChange={(e) => updateDimension(parseInt(e.target.value))} className="w-24 p-2 border rounded" />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vector u</h3>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${vectorU.length}, minmax(60px, 1fr))` }}>
            {vectorU.map((val, i) => (
              <input
                key={`u-${i}`}
                type="number"
                value={val}
                onChange={(e) => handleChange(setVectorU, i, e.target.value)}
                className="p-2 border text-center border-gray-300 rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Vector v</h3>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${vectorV.length}, minmax(60px, 1fr))` }}>
            {vectorV.map((val, i) => (
              <input
                key={`v-${i}`}
                type="number"
                value={val}
                onChange={(e) => handleChange(setVectorV, i, e.target.value)}
                className="p-2 border text-center border-gray-300 rounded"
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={computeProjection}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Project v onto u
          </button>
          <button
            onClick={gramSchmidt}
            className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            Gram-Schmidt
          </button>
        </div>

        <AnimatePresence>
          {projection && (
            <motion.div
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2">Projection Result</h3>
              <p className="text-sm text-gray-700">
                proj<sub>u</sub>(v) = [ {projection.join(", ")} ]
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {gsResult && (
            <motion.div
              className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold mb-2">Gram-Schmidt Result</h3>
              {gsResult.map((vec, i) => (
                <p key={i} className="text-sm text-gray-700">
                  u<sub>{i + 1}</sub> = [ {vec.join(", ")} ]
                </p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Page;
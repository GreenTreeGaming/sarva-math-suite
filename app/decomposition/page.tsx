"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Columns, CheckCircle, XCircle } from 'lucide-react';

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
      <Columns className="w-6 h-6 mr-2 text-purple-600" />
      LU &amp; QR Decomposition
    </h2>
  </motion.div>
);

const page = () => {
  const [size, setSize] = useState(3);
  const [matrixData, setMatrixData] = useState<string[][]>(Array(3).fill(null).map(() => Array(3).fill("")));
  const [method, setMethod] = useState<'lu' | 'qr'>('lu');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMatrixData(Array(size).fill(null).map(() => Array(size).fill("")));
  }, [size]);

  const handleChange = (i: number, j: number, val: string) => {
    setMatrixData(prev => {
      const m = prev.map(row => [...row]);
      m[i][j] = val;
      return m;
    });
  };

  const parseMatrix = (m: string[][]): number[][] => m.map(r => r.map(v => parseFloat(v) || 0));

  const calculateLU = (A: number[][]) => {
    const n = A.length;
    const L = Array(n).fill(0).map(() => Array(n).fill(0));
    const U = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      L[i][i] = 1;
      for (let j = i; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) sum += L[i][k] * U[k][j];
        U[i][j] = A[i][j] - sum;
      }
      if (U[i][i] === 0) throw new Error('Zero pivot, LU fails without pivoting');
      for (let j = i + 1; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < i; k++) sum += L[j][k] * U[k][i];
        L[j][i] = (A[j][i] - sum) / U[i][i];
      }
    }
    return { L, U };
  };

  const calculateQR = (A: number[][]) => {
    const n = A.length;
    const Q: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const R: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const M = A.map(row => [...row]);

    for (let j = 0; j < n; j++) {
      let v = M.map(row => row[j]);
      for (let i = 0; i < j; i++) {
        const qi = Q.map(row => row[i]);
        const dot = qi.reduce((s, x, k) => s + x * M[k][j], 0);
        R[i][j] = dot;
        v = v.map((x, k) => x - dot * qi[k]);
      }
      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
      if (norm === 0) throw new Error('Zero column, QR fails');
      R[j][j] = norm;
      for (let i = 0; i < n; i++) Q[i][j] = v[i] / norm;
    }
    return { Q, R };
  };

  const handleCompute = () => {
    setError(null);
    try {
      const A = parseMatrix(matrixData);
      if (A.length !== A[0].length) {
        setError('Matrix must be square');
        return;
      }
      const res = method === 'lu' ? calculateLU(A) : calculateQR(A);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const renderMatrix = (M: number[][]) => (
    <div className="overflow-x-auto grid gap-1" style={{ gridTemplateColumns: `repeat(${M[0].length}, minmax(50px, 1fr))` }}>
      {M.map((row, i) =>
        row.map((val, j) => (
          <div key={`${i}-${j}`} className="p-2 border text-center text-sm border-gray-300 rounded">
            {val.toFixed(4)}
          </div>
        ))
      )}
    </div>
  );

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header />
      <motion.div className="max-w-xl mx-auto bg-white rounded-3xl shadow p-6 space-y-6 border border-gray-100" initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <div className="text-base text-gray-600">
          Enter a square matrix and choose LU or QR decomposition.
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Size (n × n)</label>
          <input type="number" min={2} value={size} onChange={e => setSize(Number(e.target.value))} className="w-20 p-2 border rounded-md" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Matrix</h3>
          <div className="grid gap-1 overflow-x-auto" style={{ gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))` }}>
            {matrixData.map((row, i) =>
              row.map((val, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  value={val}
                  onChange={e => handleChange(i, j, e.target.value)}
                  className="p-2 border text-center border-gray-300 rounded"
                />
              ))
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Method</label>
          <select value={method} onChange={e => setMethod(e.target.value as any)} className="w-full p-2 border rounded-md">
            <option value="lu">LU Decomposition</option>
            <option value="qr">QR Decomposition</option>
          </select>
        </div>
        <button onClick={handleCompute} className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
          Compute
        </button>

        <AnimatePresence>
          {(error || result) && (
            <motion.div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
              {error ? (
                <div className="flex items-center text-red-500">
                  <XCircle className="w-5 h-5 mr-2" />{error}
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold">Result</h3>
                  </div>
                  {method === 'lu' ? (
                    <>
                      <div className="mb-4">
                        <h4 className="font-medium">L (Lower Triangular):</h4>
                        {renderMatrix(result.L)}
                      </div>
                      <div>
                        <h4 className="font-medium">U (Upper Triangular):</h4>
                        {renderMatrix(result.U)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h4 className="font-medium">Q (Orthogonal):</h4>
                        {renderMatrix(result.Q)}
                      </div>
                      <div>
                        <h4 className="font-medium">R (Upper Triangular):</h4>
                        {renderMatrix(result.R)}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default page;

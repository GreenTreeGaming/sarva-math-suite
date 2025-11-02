"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, XCircle, CheckCircle, Info } from "lucide-react";

export default function TriangleSolverPage() {
  const [values, setValues] = useState<{ [k: string]: string }>({});
  const [steps, setSteps] = useState<string[]>([]);
  const [solution, setSolution] = useState<{
    a: number; b: number; c: number; A: number; B: number; C: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, v: string) => {
    setValues(prev => ({ ...prev, [field]: v }));
  };

  const toNum = (s?: string) => {
    const n = s ? parseFloat(s) : NaN;
    return isFinite(n) ? n : NaN;
  };

  const deg = (rad: number) => rad * (180 / Math.PI);
  const rad = (deg: number) => deg * (Math.PI / 180);

  const handleSolve = () => {
    setError(null);
    setSteps([]);
    setSolution(null);

    // parse inputs
    const a = toNum(values.a);
    const b = toNum(values.b);
    const c = toNum(values.c);
    const A = toNum(values.A);
    const B = toNum(values.B);
    const C = toNum(values.C);

    const knownSides = [a, b, c].filter(x => !isNaN(x));
    const knownAngles = [A, B, C].filter(x => !isNaN(x));
    const newSteps: string[] = [];

    // require at least 3 known with at least 1 side
    if (knownSides.length < 1 || knownSides.length + knownAngles.length < 3) {
      setError("Need at least 3 values including at least one side.");
      return;
    }

    let sol: any = {};
    // SSS
    if (knownSides.length === 3 && knownAngles.length === 0) {
      newSteps.push("Case: SSS (3 sides). Use Law of Cosines.");
      sol.a = a; sol.b = b; sol.c = c;
      sol.A = deg(Math.acos((b*b + c*c - a*a) / (2*b*c)));
      newSteps.push(`A = arccos((b² + c² - a²)/(2bc)) = ${sol.A.toFixed(3)}°`);
      sol.B = deg(Math.acos((a*a + c*c - b*b) / (2*a*c)));
      newSteps.push(`B = arccos((a² + c² - b²)/(2ac)) = ${sol.B.toFixed(3)}°`);
      sol.C = 180 - sol.A - sol.B;
      newSteps.push(`C = 180° - A - B = ${sol.C.toFixed(3)}°`);
    }
    // SAS
    else if (knownSides.length === 2 && knownAngles.length === 1) {
      newSteps.push("Case: SAS (2 sides + included angle). Use Law of Cosines.");
      sol.a = a; sol.b = b; sol.c = c;
      if (!isNaN(A) && !isNaN(b) && !isNaN(c)) {
        sol.a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad(A)));
        newSteps.push(`a = sqrt(b² + c² - 2bc cos(A)) = ${sol.a.toFixed(3)}`);
        sol.A = A;
      } else if (!isNaN(B) && !isNaN(a) && !isNaN(c)) {
        sol.b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(rad(B)));
        newSteps.push(`b = sqrt(a² + c² - 2ac cos(B)) = ${sol.b.toFixed(3)}`);
        sol.B = B;
      } else {
        sol.c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(rad(C)));
        newSteps.push(`c = sqrt(a² + b² - 2ab cos(C)) = ${sol.c.toFixed(3)}`);
        sol.C = C;
      }
      newSteps.push("Then use Law of Sines for remaining angles.");
      sol.A = sol.A || deg(Math.asin(sol.a*Math.sin(rad(sol.B||0))/(sol.b||1)));
      sol.B = sol.B || deg(Math.asin(sol.b*Math.sin(rad(sol.A))/(sol.a||1)));
      sol.C = 180 - sol.A - sol.B;
      newSteps.push(`Remaining angle: C = ${sol.C.toFixed(3)}°`);
    }
    // ASA/AAS
    else {
      newSteps.push("Case: ASA/AAS (2 angles + 1 side). Use sum and Law of Sines.");
      sol.a = a; sol.b = b; sol.c = c; sol.A = A; sol.B = B; sol.C = C;
      if (isNaN(sol.A)) sol.A = 180 - sol.B! - sol.C!;
      if (isNaN(sol.B)) sol.B = 180 - sol.A! - sol.C!;
      if (isNaN(sol.C)) sol.C = 180 - sol.A! - sol.B!;
      newSteps.push(`Angles sum: A+B+C=180 → (${sol.A.toFixed(3)}°, ${sol.B.toFixed(3)}°, ${sol.C.toFixed(3)}°)`);
      const ks = [['a','A'],['b','B'],['c','C']].find(([s, _]) => !isNaN(sol[s]))!;
      const [sk, Ak] = ks;
      const Sv = sol[sk], Av = sol[Ak];
      [['a','A'],['b','B'],['c','C']].forEach(([s,Ai]) => {
        if (isNaN(sol[s])) {
          sol[s] = Sv * Math.sin(rad(sol[Ai])) / Math.sin(rad(Av));
          newSteps.push(`${s} = ${sk}/sin(${Ak}) * sin(${Ai}) = ${sol[s].toFixed(3)}`);
        }
      });
    }

    setSteps(newSteps);
    setSolution({ a: sol.a!, b: sol.b!, c: sol.c!, A: sol.A!, B: sol.B!, C: sol.C! });
  };

  return (
    <motion.div className="min-h-screen bg-[#fdfcf9] px-6 py-10 text-gray-800" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
      <motion.div className="max-w-3xl mx-auto flex flex-col items-center" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">Sarva Math Suite</h1>
        <Link href="/" className="flex items-center mb-6 text-sm text-gray-600 hover:text-purple-500"><ArrowLeft className="w-4 h-4 mr-1"/>Back to Home</Link>
        <h2 className="text-4xl font-extrabold mb-6 flex items-center gap-2"><Info className="w-6 h-6 text-purple-600"/> Triangle Solver</h2>

        {/* Diagram legend */}
        <div className="w-full mb-6">
          <img src="/triangle_img.svg" alt="Triangle notation: sides a,b,c and angles A,B,C" className="mx-auto h-40" />
        </div>

        {/* Inputs grouped */}
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-3 font-semibold">Sides</div>
          <label className="flex flex-col items-center"><span>a</span><input type="text" value={values.a||""} onChange={e=>handleChange('a', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
          <label className="flex flex-col items-center"><span>b</span><input type="text" value={values.b||""} onChange={e=>handleChange('b', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
          <label className="flex flex-col items-center"><span>c</span><input type="text" value={values.c||""} onChange={e=>handleChange('c', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
        </div>
        <div className="w-full grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-3 font-semibold">Angles (°)</div>
          <label className="flex flex-col items-center"><span>A</span><input type="text" value={values.A||""} onChange={e=>handleChange('A', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
          <label className="flex flex-col items-center"><span>B</span><input type="text" value={values.B||""} onChange={e=>handleChange('B', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
          <label className="flex flex-col items-center"><span>C</span><input type="text" value={values.C||""} onChange={e=>handleChange('C', e.target.value)} className="mt-1 p-2 border rounded w-full max-w-xs text-center"/></label>
        </div>

        <motion.button onClick={handleSolve} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold shadow mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2"/>Solve
        </motion.button>

        <AnimatePresence>
          {error && <motion.div className="flex items-center text-red-500 mb-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><XCircle className="w-5 h-5 mr-2"/>{error}</motion.div>}
        </AnimatePresence>

        {solution && (
          <motion.div className="bg-white border border-gray-200 shadow p-6 rounded-xl w-full text-sm space-y-4" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}}>
            <div className="flex items-center mb-2"><CheckCircle className="w-5 h-5 text-green-600 mr-2"/><h3 className="text-lg font-semibold text-purple-600">Solution</h3></div>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>a:</strong> {solution.a.toFixed(3)}</div>
              <div><strong>b:</strong> {solution.b.toFixed(3)}</div>
              <div><strong>c:</strong> {solution.c.toFixed(3)}</div>
              <div><strong>A:</strong> {solution.A.toFixed(3)}°</div>
              <div><strong>B:</strong> {solution.B.toFixed(3)}°</div>
              <div><strong>C:</strong> {solution.C.toFixed(3)}°</div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1"><Info className="w-4 h-4 text-blue-600"/>Step-by-Step</h4>
              <ol className="list-decimal pl-6 space-y-1 text-gray-600">{steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
            </div>
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  );
}

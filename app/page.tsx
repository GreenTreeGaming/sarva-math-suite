"use client"

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  type Category = keyof typeof categorizedTools;

  // Tool list with routes
  const categorizedTools = {
    Arithmetic: [
      { name: "Calculator", route: "/calculator", desc: "Basic arithmetic calculator for quick calculations." },
      { name: "Unit Converter", route: "/unit-converter", desc: "Convert between units of length, mass, time, and more." },
    ],
    "Algebra / Precalc": [
      { name: "Function Simplifier", route: "/function-simplifier", desc: "Simplify algebraic expressions step by step." },
      { name: "Rational Equations", route: "/rational-equations", desc: "Analyze and graph quadratics: vertex, intercepts, direction, and more." },
      { name: "Polynomial Factorer", route: "/polynomial-factorer", desc: "Factor polynomials using various techniques, step by step." },
      { name: "System of Equations Solver", route: "/system-solver", desc: "Solve systems of linear equations using substitution, elimination, or matrices." },
      { name: "Inequality Solver", route: "/inequality-solver", desc: "Solve algebraic inequalities step by step, including linear, polynomial, and rational inequalities." },
      { name: "Equation Solver", route: "/equation-solver", desc: "Solve algebraic equations step by step." },
      { name: "Triangle Solver", route: "/triangle-solver", desc: "Solve triangles using Law of Sines, Law of Cosines, and compute unknown sides/angles." },
    ],
    "Linear Algebra": [
      { "name": "Matrix Ops", "route": "/matrix-ops", "desc": "Perform matrix operations like addition, inverse, and more." },
      { "name": "Determinant & Rank", "route": "/det-rank", "desc": "Calculate the determinant and rank of matrices." },
      { "name": "Eigenvalues & Eigenvectors", "route": "/eigen", "desc": "Compute eigenvalues and eigenvectors of a matrix." },
      { "name": "LU & QR Decomposition", "route": "/decomposition", "desc": "Perform LU and QR matrix decompositions." },
      { "name": "Linear Systems Solver", "route": "/linear-solver", "desc": "Solve systems of linear equations using matrices." },
      { "name": "Vector Spaces", "route": "/vector-spaces", "desc": "Explore basis, dimension, and span of vector spaces." },
      { "name": "Orthogonality & Projections", "route": "/orthogonality", "desc": "Work with orthogonal vectors and projections." },
    ],
    Statistics: [
      { name: "Statistics Helper", route: "/statistics-helper", desc: "Mean, median, mode, standard deviation made simple." },
      { name: "t Tests", route: "/t-tests", desc: "Easily perform one-sample, two-sample, and paired t-tests to compare group means." },
      { name: "z Tests", route: "/z-tests", desc: "Conduct one-sample and two-sample z-tests to compare population means when standard deviations are known." },
      { name: "Chi Square Tests", route: "/chi-tests", desc: "Perform chi-square tests for goodness-of-fit and independence to analyze categorical data and observed vs. expected frequencies." }
    ],

    "Number Theory & Discrete Math": [
      {
        name: "Prime Factorizer & GCD/LCM Tool",
        route: "/prime-factorizer",
        desc: "Break down integers into primes, compute greatest common divisors and least common multiples step by step."
      },
      {
        name: "Modular Arithmetic Helper",
        route: "/modular-arithmetic",
        desc: "Perform modular addition, multiplication, inverses, and solve congruences."
      },
      {
        name: "Combinatorics & Probability",
        route: "/combinatorics-probability",
        desc: "Permutations & combinations calculator, binomial theorem expansion, and basic probability events (independent, conditional)."
      },
    ],

    Calculus: [
      { name: "Derivative Calculator", route: "/derivative", desc: "Compute derivatives of functions step by step." },
      { name: "Integral Calculator", route: "/integral", desc: "Find indefinite and definite integrals easily." },
    ],
  };

  const [search, setSearch] = useState("");

  const filteredCategories = Object.entries(categorizedTools).reduce(
    (acc, [category, tools]) => {
      const filtered = tools.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.desc.toLowerCase().includes(search.toLowerCase())
      );

      if (filtered.length > 0) {
        acc[category as keyof typeof categorizedTools] = filtered;
      }

      return acc;
    },
    {} as Partial<typeof categorizedTools>
  );

  return (
    <main className="min-h-screen bg-[#fdfcf9] px-6 py-12 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Sarva Math Suite
        </h1>
        <p className="text-center text-lg text-gray-600 mb-6">
          A collection of sleek tools to help you explore, calculate, and conquer math.
        </p>

        {/* Search */}
        <div className="mb-10 flex justify-center">
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Tools Grouped by Category */}
        {Object.entries(filteredCategories).map(([category, tools]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">{category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.route}
                  className="rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition duration-200 border border-gray-100 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-500">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
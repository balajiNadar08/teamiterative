"use client";

import { useState } from "react";
import Link from "next/link";
import { docsData } from "@/data/docsData";

// Define the Disease type with the new fields
type Disease = {
  namaste: string;
  name: string;
  description: string;
  icdBiomedicine: string;
  icdTM2: string;
  snomed: string;
  loinc: string;
  aboutDisease: string;
  medicine: string;
  aboutMedicine: string;
  dosage: string;
};

export default function Documentation() {
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(
    docsData[0]
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(docsData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "ayush_diseases_dataset.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Bar */}
      <div className="navbar px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium text-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Demo</Link>
              </li>
              <li>
                <Link href="/translate">Translate</Link>
              </li>
              <li>
                <Link href="/documentation">Documentation</Link>
              </li>
              <li>
                <Link href="/analytics">Analytics</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            NavaSetu
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Demo</Link>
            </li>
            <li>
              <Link href="/translate">Translate</Link>
            </li>
            <li>
              <Link href="/documentation">Documentation</Link>
            </li>
            <li>
              <Link href="/analytics">Analytics</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button
            onClick={exportData}
            className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600 mr-2"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Data
          </button>
          <a className="btn">Login</a>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-20 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              AYUSH Diseases
            </h2>
            <p className="text-sm text-gray-600">
              Click on any NAMASTE code to view details
            </p>
            <div className="text-xs text-gray-500 mt-2">
              Total: {docsData.length} diseases
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-144px)]">
            <div className="p-4">
              {docsData.map((disease) => (
                <button
                  key={disease.namaste}
                  onClick={() => {
                    setSelectedDisease(disease);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded-lg transition-all duration-200 ${
                    selectedDisease?.namaste === disease.namaste
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                      : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                  }`}
                >
                  <div className="font-mono font-bold text-sm">
                    {disease.namaste}
                  </div>
                  <div className="text-xs opacity-80 mt-1 truncate">
                    {disease.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              AYUSH Disease Documentation
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive Database of Traditional Medicine Conditions
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-4"></div>
          </div>

          {/* Disease Details */}
          {selectedDisease ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
              {/* Disease Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-full font-mono font-bold">
                    {selectedDisease.namaste}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ICD-11: {selectedDisease.icdBiomedicine}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    TM2: {selectedDisease.icdTM2}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {selectedDisease.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  {selectedDisease.description}
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Disease Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      About the Disease
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedDisease.aboutDisease}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Medicine Information
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="mb-3">
                        <span className="font-semibold text-green-800">
                          Medicine Name:
                        </span>
                        <span className="ml-2 text-gray-700 font-medium">
                          {selectedDisease.medicine}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="font-semibold text-green-800">
                          About Medicine:
                        </span>
                        <p className="text-gray-700 mt-1">
                          {selectedDisease.aboutMedicine}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-green-800">
                          Dosage:
                        </span>
                        <p className="text-gray-700 mt-1 font-medium">
                          {selectedDisease.dosage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Standards */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      Code Standards
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="font-semibold text-purple-800 mb-2">
                          NAMASTE Code
                        </div>
                        <code className="bg-purple-100 px-3 py-1 rounded text-purple-700 font-mono">
                          {selectedDisease.namaste}
                        </code>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="font-semibold text-blue-800 mb-2">
                          ICD-11 Biomedicine
                        </div>
                        <code className="bg-blue-100 px-3 py-1 rounded text-blue-700 font-mono">
                          {selectedDisease.icdBiomedicine}
                        </code>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-800 mb-2">
                          ICD-11 TM2
                        </div>
                        <code className="bg-green-100 px-3 py-1 rounded text-green-700 font-mono">
                          {selectedDisease.icdTM2}
                        </code>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="font-semibold text-yellow-800 mb-2">
                          SNOMED CT
                        </div>
                        <code className="bg-yellow-100 px-3 py-1 rounded text-yellow-700 font-mono">
                          {selectedDisease.snomed}
                        </code>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="font-semibold text-red-800 mb-2">
                          LOINC
                        </div>
                        <code className="bg-red-100 px-3 py-1 rounded text-red-700 font-mono">
                          {selectedDisease.loinc}
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Quick Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-blue-600">
                          Total Diseases
                        </div>
                        <div className="text-gray-700">{docsData.length}</div>
                      </div>
                      <div className="bg-white p-2 rounded text-center">
                        <div className="font-bold text-green-600">
                          Current Index
                        </div>
                        <div className="text-gray-700">
                          {docsData.findIndex(
                            (d) => d.namaste === selectedDisease.namaste
                          ) + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      const currentIndex = docsData.findIndex(
                        (d) => d.namaste === selectedDisease.namaste
                      );
                      if (currentIndex > 0) {
                        setSelectedDisease(docsData[currentIndex - 1]);
                      }
                    }}
                    disabled={
                      docsData.findIndex(
                        (d) => d.namaste === selectedDisease.namaste
                      ) === 0
                    }
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>

                  <div className="text-sm text-gray-500">
                    {docsData.findIndex(
                      (d) => d.namaste === selectedDisease.namaste
                    ) + 1}{" "}
                    of {docsData.length}
                  </div>

                  <button
                    onClick={() => {
                      const currentIndex = docsData.findIndex(
                        (d) => d.namaste === selectedDisease.namaste
                      );
                      if (currentIndex < docsData.length - 1) {
                        setSelectedDisease(docsData[currentIndex + 1]);
                      }
                    }}
                    disabled={
                      docsData.findIndex(
                        (d) => d.namaste === selectedDisease.namaste
                      ) ===
                      docsData.length - 1
                    }
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Disease Selected
              </h3>
              <p className="text-gray-600">
                Select a NAMASTE code from the sidebar to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

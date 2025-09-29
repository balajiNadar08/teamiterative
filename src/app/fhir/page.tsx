"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

export const dynamic = "force-dynamic";

export default function FHIRPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fhirData, setFhirData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState(false);
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | "checking"
  >("checking");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setFhirData(parsedData);
        validateFHIR(parsedData);
      } catch (err) {
        console.error("Invalid FHIR data", err);
        setValidationStatus("invalid");
      }
    }
  }, [searchParams]);

  const validateFHIR = (data: any) => {
    const hasRequiredFields =
      data.resourceType &&
      data.id &&
      (data.resourceType === "Bundle"
        ? data.entry && data.entry.length > 0
        : true);

    setValidationStatus(hasRequiredFields ? "valid" : "invalid");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(fhirData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(fhirData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fhir-bundle-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderFormattedView = () => {
    if (!fhirData) return null;

    if (fhirData.resourceType === "Bundle") {
      const patient = fhirData.entry?.find(
        (e: any) => e.resource?.resourceType === "Patient"
      )?.resource;
      const condition = fhirData.entry?.find(
        (e: any) => e.resource?.resourceType === "Condition"
      )?.resource;

      return (
        <div className="space-y-6">
          {/* Bundle Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
              FHIR Bundle Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-600">Bundle ID</p>
                <p className="font-mono text-blue-900">{fhirData.id}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Type</p>
                <p className="font-medium text-blue-900">{fhirData.type}</p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Timestamp</p>
                <p className="font-medium text-blue-900">
                  {new Date(fhirData.timestamp).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-600">Resources</p>
                <p className="font-medium text-blue-900">
                  {fhirData.entry?.length || 0} resources
                </p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          {patient && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Patient Information
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-600">Name</p>
                  <p className="font-medium text-gray-600">
                    {patient.name?.[0]?.text || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Gender</p>
                  <p className="font-medium capitalize text-gray-600">
                    {patient.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Date of Birth</p>
                  <p className="font-medium text-gray-600">
                    {patient.birthDate || "Not provided"}
                  </p>
                </div>
                {patient.telecom?.map((telecom: any, index: number) => (
                  <div key={index}>
                    <p className="text-sm text-green-600 capitalize">
                      {telecom.system}
                    </p>
                    <p className="font-medium text-gray-600">{telecom.value}</p>
                  </div>
                ))}
                {patient.address?.[0] && (
                  <div className="md:col-span-3">
                    <p className="text-sm text-green-600">Address</p>
                    <p className="font-medium text-gray-600">
                      {patient.address[0].line?.[0]}, {patient.address[0].city},{" "}
                      {patient.address[0].state} {patient.address[0].postalCode}
                      , {patient.address[0].country}
                    </p>
                  </div>
                )}
                {patient.contact?.[0] && (
                  <div className="md:col-span-3">
                    <p className="text-sm text-green-600">Emergency Contact</p>
                    <p className="font-medium text-gray-600">
                      {patient.contact[0].name?.text} -{" "}
                      {patient.contact[0].telecom?.[0]?.value}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Condition Info */}
          {condition && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">
                Medical Condition
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-orange-600">Condition</p>
                  <p className="font-medium text-gray-600">
                    {condition.code?.text || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Clinical Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {condition.clinicalStatus?.coding?.[0]?.display ||
                      "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Verification Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {condition.verificationStatus?.coding?.[0]?.display ||
                      "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Severity</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {condition.severity?.coding?.[0]?.display ||
                      "Not specified"}
                  </span>
                </div>
              </div>

              {condition.note?.[0]?.text && (
                <div className="mt-4">
                  <p className="text-sm text-orange-600">Clinical Notes</p>
                  <p className="bg-white p-3 rounded border text-gray-700">
                    {condition.note[0].text}
                  </p>
                </div>
              )}

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-orange-600">Onset Date</p>
                  <p className="font-medium text-gray-600">
                    {new Date(condition.onsetDateTime).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Recorded Date</p>
                  <p className="font-medium text-gray-600">
                    {new Date(condition.recordedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {fhirData.resourceType} Resource
        </h3>
        <p className="text-sm text-gray-600">ID: {fhirData.id}</p>
      </div>
    );
  };

  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Form
                  </button>
                  <h1 className="text-3xl font-bold text-gray-800">
                    FHIR R4 Bundle
                  </h1>
                  <p className="text-gray-600">
                    Generated healthcare interoperability data
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {validationStatus === "valid" && (
                      <>
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-600 font-medium">
                          Valid FHIR
                        </span>
                      </>
                    )}
                    {validationStatus === "invalid" && (
                      <>
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-red-600 font-medium">
                          Invalid FHIR
                        </span>
                      </>
                    )}
                    {validationStatus === "checking" && (
                      <>
                        <svg
                          className="w-5 h-5 text-yellow-600 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span className="text-yellow-600 font-medium">
                          Validating...
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!fhirData ? (
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
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    No FHIR Data Found
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Please submit a patient form first to generate FHIR data.
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Patient Form
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewMode("formatted")}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                            viewMode === "formatted"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Formatted View
                        </button>
                        <button
                          onClick={() => setViewMode("raw")}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                            viewMode === "raw"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Raw JSON
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
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
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Copy JSON
                            </>
                          )}
                        </button>

                        <button
                          onClick={downloadJSON}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
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
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg border">
                    {viewMode === "formatted" ? (
                      <div className="p-6">{renderFormattedView()}</div>
                    ) : (
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Raw FHIR R4 JSON
                        </h3>
                        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
                          {JSON.stringify(fhirData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

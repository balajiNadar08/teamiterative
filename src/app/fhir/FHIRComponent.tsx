"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FHIRComponent() {
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
      (data.resourceType === "Bundle" ? data.entry && data.entry.length > 0 : true);
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
                <p className="font-medium text-blue-900">{fhirData.entry?.length || 0} resources</p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          {patient && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Patient Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-600">Name</p>
                  <p className="font-medium text-gray-600">{patient.name?.[0]?.text || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Gender</p>
                  <p className="font-medium capitalize text-gray-600">{patient.gender || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Date of Birth</p>
                  <p className="font-medium text-gray-600">{patient.birthDate || "Not provided"}</p>
                </div>
                {patient.telecom?.map((telecom: any, index: number) => (
                  <div key={index}>
                    <p className="text-sm text-green-600 capitalize">{telecom.system}</p>
                    <p className="font-medium text-gray-600">{telecom.value}</p>
                  </div>
                ))}
                {patient.address?.[0] && (
                  <div className="md:col-span-3">
                    <p className="text-sm text-green-600">Address</p>
                    <p className="font-medium text-gray-600">
                      {patient.address[0].line?.[0]}, {patient.address[0].city}, {patient.address[0].state} {patient.address[0].postalCode}, {patient.address[0].country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Condition Info */}
          {condition && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">Medical Condition</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-orange-600">Condition</p>
                  <p className="font-medium text-gray-600">{condition.code?.text || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Clinical Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {condition.clinicalStatus?.coding?.[0]?.display || "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Verification Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {condition.verificationStatus?.coding?.[0]?.display || "Unknown"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-orange-600">Severity</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {condition.severity?.coding?.[0]?.display || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{fhirData.resourceType} Resource</h3>
        <p className="text-sm text-gray-600">ID: {fhirData.id}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => router.push("/")} className="text-blue-600 hover:text-blue-800 mb-4">
              Back to Form
            </button>
            <h1 className="text-3xl font-bold text-gray-800">FHIR R4 Bundle</h1>
            <p className="text-gray-600">Generated healthcare interoperability data</p>
          </div>
        </div>

        {!fhirData ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No FHIR Data Found</h2>
            <p className="text-gray-500 mb-6">Please submit a patient form first to generate FHIR data.</p>
            <button onClick={() => router.push("/")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Patient Form</button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setViewMode("formatted")} className={`${viewMode === "formatted" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} px-4 py-2 rounded-lg`}>Formatted View</button>
                  <button onClick={() => setViewMode("raw")} className={`${viewMode === "raw" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"} px-4 py-2 rounded-lg`}>Raw JSON</button>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={copyToClipboard} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{copied ? "Copied!" : "Copy JSON"}</button>
                  <button onClick={downloadJSON} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Download</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border p-6">
              {viewMode === "formatted" ? renderFormattedView() : (
                <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
                  {JSON.stringify(fhirData, null, 2)}
                </pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

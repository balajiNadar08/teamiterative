// app/fhir/page.tsx
import { Suspense } from "react";
import FHIRComponent from "./FHIRComponent";

export const dynamic = "force-dynamic"; // ensures client-side rendering

export default function FHIRPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading FHIR data...</div>}>
      <FHIRComponent />
    </Suspense>
  );
}

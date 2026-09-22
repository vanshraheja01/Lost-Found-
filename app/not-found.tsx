import Link from "next/link";
import EmptyState from "@/components/EmptyState";

export default function NotFound() {
  return (
    <main style={{ minHeight: "calc(100vh - 82px)", background: "#07111f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <EmptyState icon="🧭" title="Page not found" description="The page you're looking for doesn't exist." />
        <Link href="/" style={{ color: "#8fc1ff" }}>
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

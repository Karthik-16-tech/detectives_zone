import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsRedirect,
});

function AdminPaymentsRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin/orders" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center font-mono text-xs">
      Redirecting to Orders Desk...
    </div>
  );
}

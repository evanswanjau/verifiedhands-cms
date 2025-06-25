import { useLocation, Navigate } from "react-router-dom";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (location.pathname === "/") {
    return token ? (
      <Navigate to="/hero" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

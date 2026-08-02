import { Navigate } from "react-router-dom";
import { getRole } from "../utils/auth";

function PrivateRoute({ children }) {
  const role = getRole();

  if (!role) return <Navigate to="/student/login" replace />;

  if (role !== "student") return <Navigate to="/admin/login" replace />;

  return children;
}

export default PrivateRoute;

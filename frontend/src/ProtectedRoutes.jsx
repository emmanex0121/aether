import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  if (!localStorage.getItem("***")) {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoutes;

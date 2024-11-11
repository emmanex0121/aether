import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"

const ProtectedRoutes = ({ children }) => {
  if (!localStorage.getItem("***")) {
    return <Navigate to="/signin" />;
  }

  return children;
};

ProtectedRoutes.propTypes = {
    children: PropTypes.node
}

export default ProtectedRoutes;

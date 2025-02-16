import { useLocation, Navigate } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // we will check if the user is in the index ("/") page
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      // if the user is not authenticated, we will redirect the user to the login page
      return <Navigate to="/auth/login" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // if user is not logged in and tries to access any page that is not login or register, they will be redirected to the login page
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  // if user is logged in and tries to access the register or login page, they will be sent back to the
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // if user is logged in but tries to access the admin page when the user is not an admin, this will happen
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // if user is logged in but tries to access the user page when the user is not an user, this will happen
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;

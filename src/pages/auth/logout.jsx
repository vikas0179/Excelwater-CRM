import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const logout = () => {
  const navigate = useNavigate();
  const logoutHandle = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    logoutHandle();
  }, []);
  return <></>;
};

export default logout;

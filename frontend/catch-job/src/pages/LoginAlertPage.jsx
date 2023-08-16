import React, { useEffect } from "react";
import LoginPage from "./LoginPage";

const LoginAlertPage = () => {
  useEffect(() => {
    alert("로그인 해야 접근 가능합니다.");
  }, []);

  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default LoginAlertPage;

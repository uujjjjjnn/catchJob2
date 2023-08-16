import React, { useEffect } from "react";
import PortfolioMainPage from "./PortfolioMainPage";
import { useNavigate } from "react-router-dom";

const SigninAlertPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    alert("이미 로그인 되어있습니다.");
    navigate("/");
  }, [navigate]);
  return (
    <div>
      <PortfolioMainPage />
    </div>
  );
};

export default SigninAlertPage;

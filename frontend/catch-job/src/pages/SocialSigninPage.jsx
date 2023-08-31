import React from "react";
import "../assets/css/member/SocialSignin.css";
import { Link } from "react-router-dom";
import GoogleLoginButton_long from "../components/GoogleLoginButton_long";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SocialSigninPage = () => {
  return (
    <div className="signInPage">
      <div className="signIn">
        {/* <div className="section">
        <div className="entire-box-social"> */}
        <div className="catchJob-social">
          <h1>
            catch<span className="red-letter">J</span>ob
          </h1>
        </div>

        <div className="hi-text">반가워요 👋</div>

        <GoogleOAuthProvider clientId="226990065119-dh4qnntmuprddppr3hoi6umt9k99vkvb.apps.googleusercontent.com">
            <GoogleLoginButton_long />
          </GoogleOAuthProvider>

        <div className="social-buttons-social">
          <Link to={"/signin"} className="button" id="basic-button">
            <div className="button-text">이메일로 가입하기</div>
          </Link>
        </div>

        <div className="log-in">
          <div className="entire-text-social">이미 계정이 있으신가요?</div>
          <Link to="/login" className="log-in-now">
            로그인 하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocialSigninPage;

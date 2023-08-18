import React, { useEffect, useState } from "react";
import "../assets/css/member/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedIn } from "../redux/login";
import { useNavigate } from "react-router-dom";
// import { userLoginMutation } from "../redux/authApi";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoggedIn = useSelector(selectLoggedIn);

  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const userData = {
      email: email,
      pwd: password,
    };

    try {
      const response = await axios.post("http://43.202.98.45:8089/login", userData);
      // const response = await axios.post("http://43.202.98.45:8089/login", userData);
      console.log(response.data);
      console.log(response.data.name);
      const userId = response.data.memberId;
      const token = response.data.token;
      const name = response.data.name;
      const email = response.data.email;
      const profileImg = response.data.mOriginalFileName;
      console.log(token);
      console.log(name);
      console.log(email);
      localStorage.setItem("memId", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("profileImg", profileImg);
      console.log(`로그인여부 :${isLoggedIn}`);
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      if (error.response.status === 400) {
        alert("회원을 찾지 못했습니다.");
      } else if (error.response.status === 500) {
        // 서버 내부 에러 처리
        alert("로그인에 실패했습니다.(서버 에러) ");
      } else {
        // 기타 에러 처리
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="body-login">
      <div className="section-login">
        <div className="entire-box">
          <h1 className="catchJob-login">
            catch<span className="red-letter">J</span>ob
          </h1>
          <div className="input-text">이메일</div>
          <input type="text" className="input-box" tabIndex="1" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="input-text">비밀번호</div>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              className="input-box"
              tabIndex="2"
              value={password}
              onKeyPress={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="eye-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </div>
          </div>

          <button className="login-button" onClick={handleLogin}>
            <div className="login-text">로그인</div>
          </button>

          <div className="entire-text">SNS로 간편하게 시작하기</div>
          <div className="social-buttons">
            <button className="kakao-button"></button>
            <GoogleOAuthProvider clientId="226990065119-dh4qnntmuprddppr3hoi6umt9k99vkvb.apps.googleusercontent.com">
              <GoogleLoginButton />
            </GoogleOAuthProvider>
          </div>

          <div className="sign-in">
            <div className="entire-text">아직 회원이 아니세요?</div>
            <Link to={"/join"} className="sign-in-now">
              회원가입 하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useGoogleLogin } from "@react-oauth/google";
import Style from "../assets/css/GoogleLoginButton_long.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const GoogleLoginButton_long = () => {
  const navigate = useNavigate();

  const googleSocialLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("=========codeResponse=============", codeResponse);
      axios
        .post("http://43.202.98.45:8089/googlelogin", { code: codeResponse.code })
        .then((response) => {
          // 서버 응답 처리
          console.log("============data==========", response.data);
          const token = response.data.jwtToken;
          localStorage.setItem("token", token); // JWT 토큰을 localStorage에 저장
          console.log("aaa --------------------", token);
          console.log("JWT 토큰이 저장되었습니다.");
          navigate("/realmypage");
        })
        .catch((error) => {
          // 오류 처리
          console.error("-----------error------------", error);
        });
    },
    flow: "auth-code",
  });

  return (
    <div className={`${Style.button}`} onClick={() => googleSocialLogin()}>
      <div className={`${Style.buttonIconGoogle}`}></div>
      <div className={`${Style.buttonText}`}>구글 계정으로 가입하기</div>
    </div>
  );
};

export default GoogleLoginButton_long;

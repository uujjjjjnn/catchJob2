import { useGoogleLogin } from "@react-oauth/google";
import Style from "../assets/css/GoogleLoginButton.module.css";
import axios from "axios";

const GoogleLoginButton = () => {
  const googleSocialLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("-----------", codeResponse.code);
      axios
        .post("http://43.202.98.45:8089/googlelogin", null, {
          params: {
            code: codeResponse.code,
            grant_type: "authorization_code",
          },
        })
        .then((response) => {
          const jwtToken = response.data.jwtToken;
          localStorage.setItem("jwtToken", jwtToken); // JWT 토큰을 localStorage에 저장
          console.log("aaa --------------------", jwtToken);
          console.log("JWT 토큰이 저장되었습니다.");
        })
        .catch((error) => {
          console.error(error);
        });
    },
    flow: "auth-code",
  });

  return <div className={`${Style.google_login_box}`} onClick={() => googleSocialLogin()}></div>;
};

export default GoogleLoginButton;

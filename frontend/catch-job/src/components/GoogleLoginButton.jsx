import { useGoogleLogin } from "@react-oauth/google";
import Style from "../assets/css/GoogleLoginButton.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const GoogleLoginButton = () => {
  const navigate = useNavigate();

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
          console.log("============data==========", response.data);
          const token = response.data.token;
          localStorage.setItem("token", token); // JWT 토큰을 localStorage에 저장
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('profileImg',response.data.mOriginalFileName);
          console.log("aaa --------------------", token);
          console.log("JWT 토큰이 저장되었습니다.");
          navigate("/realmypage");
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

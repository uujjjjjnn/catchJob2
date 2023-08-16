import { useGoogleLogin } from "@react-oauth/google";
import Style from "../assets/css/GoogleLoginButton_long.module.css";
import axios from "axios";

const GoogleLoginButton_long = () => {
  const googleSocialLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("=========codeResponse=============", codeResponse);
      axios
        .post("http://43.202.98.45:8089/googlelogin", { code: codeResponse.code })
        .then((response) => {
          // 서버 응답 처리
          console.log("============data==========", response.data);
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

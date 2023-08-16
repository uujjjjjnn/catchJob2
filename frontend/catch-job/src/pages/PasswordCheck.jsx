import React, { useState, useEffect } from "react";
import styles from "../assets/css/member/PasswordCheck.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const PasswordCheck = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleUpdateClick = async () => {
    if (password) {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.post("http://43.202.98.45:8089/memberPwd", { pwd: password }, config);
        console.log(response.data);

        if (response.data === "비밀번호 일치") {
          navigate("/realmypage");
        }
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          setErrorMessage("비밀번호가 일치하지 않습니다. 다시 작성해주세요.");
        } else {
          console.error("Error:", error);
        }
      }
    } else {
      setErrorMessage("비밀번호를 입력해야 회원 정보를 수정할 수 있습니다.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUpdateClick();
    }
  };

  return (
    <div className={`${styles.body_edit}`}>
      <div className={`${styles.section_edit}`}>
        <div className={`${styles.entire_box_edit}`}>
          <h1 className={`${styles.catchJob_edit}`}>
            catch<span className={`${styles.red_letter}`}>J</span>ob
          </h1>
          <h3 className={`${styles.edit_inform}`}>비밀번호 확인</h3>

          <div className={`${styles.input_container_basic}`}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${styles.input_box_basic}`}
              tabIndex="3"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="비밀번호 입력하세요"
            />
            <div className={`${styles.eye_icon_basic}`} onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </div>
            <button className={`${styles.enroll_edit}`} onClick={handleUpdateClick}>
              입력하기
            </button>
          </div>
          <div className={`${styles.errorMent}`}>{errorMessage && <p className={`${styles.error_message}`}>{errorMessage}</p>}</div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCheck;

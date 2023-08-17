import React, { useState, useEffect } from "react";
import "../assets/css/member/BasicSignin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BasicSigninPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState("");
  const [selectedCarrers, setSelectedCarrers] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "name":
        setName(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleJobCheckboxChange = (job) => {
    setSelectedJobs(job);
  };

  const handleCarrerChange = (career) => {
    setSelectedCarrers(career);
  };

  const registerUser = () => {
    if (!email || !name || !password || !confirmPassword || !selectedJobs || !selectedCarrers) {
      return alert("모든 필드를 채워주세요.");
    }

    if (password !== confirmPassword) {
      return alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
    }
    // 회원가입 데이터 생성하기
    const userData = {
      email: email,
      pwd: password,
      name: name,
      job: selectedJobs,
      hasCareer: selectedCarrers,
    };

    console.log(userData);

    // axios
    //   .post("http://43.202.98.45:8089/register", userData, {
    axios
      .post("http://43.202.98.45:8089/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data); // 서버 응답 데이터 출력
        alert("회원가입이 성공적으로 되었습니다!");
        navigate("/login");
      })
      .catch((error) => {
        console.error(error); // 에러 출력
        if (error.response && error.response.status >= 400) {
          // 이미 있는 이메일 확인
          alert("회원가입에 실패했습니다.");
        }
      });
  };

  useEffect(() => {
    console.log(selectedJobs);
  }, [selectedJobs]);

  useEffect(() => {
    console.log(selectedCarrers);
  }, [selectedCarrers]);

  return (
    <div className="body-basic">
      <div className="section-basic">
        <div className="entire-box-basic">
          <h1 className="catchJob-basic">
            catch<span className="red-letter">J</span>ob
          </h1>

          <div className="input-text-basic">이메일</div>
          <input
            type="text"
            className="input-box-basic"
            tabIndex="1"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="이메일을 입력하세요"
          />
          <div className="input-text-basic">이름</div>
          <input
            type="text"
            className="input-box-basic"
            tabIndex="2"
            name="name"
            value={name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
          />
          <div className="input-text-basic">비밀번호</div>
          <div className="input-container-basic">
            <input
              type={showPassword ? "text" : "password"}
              className="input-box-basic"
              tabIndex="3"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="비밀번호 입력하세요"
            />
            <div className="eye-icon-basic" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </div>
          </div>
          <div className="input-text-basic">비밀번호 확인</div>
          <div className="input-container-basic">
            <input
              type={showPassword ? "text" : "password"}
              className="input-box-basic"
              tabIndex="4"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 한 번 입력하세요"
            />
            <div className="eye-icon-basic" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </div>
          </div>

          <div className="input-text-basic">직무</div>
          <div className="choosejob" id="pick">
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("웹디자이너")} />
      <div className="choosejob-text-basic">웹디자이너</div>
    </label>
  </label>
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("웹퍼블리셔")} />
      <div className="choosejob-text-basic">웹퍼블리셔</div>
    </label>
  </label>
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("프론트엔드")} />
      <div className="choosejob-text-basic">프론트엔드</div>
    </label>
  </label>
</div>
<div className="choosejob">
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("백엔드")} />
      <div className="choosejob-text-basic">백엔드</div>
    </label>
  </label>
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("PM")} />
      <div className="choosejob-text-basic">PM</div>
    </label>
  </label>
  <label className="labelOne">
    <label className="choosejobone">
      <input type="radio" className="custom-checkbox" name="job" onChange={() => handleJobCheckboxChange("기타")} />
      <div className="choosejob-text-basic">기타</div>
    </label>
  </label>
</div>


          <div className="input-text-basic">경력 여부</div>
          <div className="choosejob" id="pick">
            <label className="labelOne">
              <div className="choosejobone" id="carrer">
                <input type="radio" className="custom-checkbox" name="career" onChange={() => handleCarrerChange("신입")} />
                <div className="choosejob-text-basic">신입</div>
              </div>
            </label>
            <label className="labelOne">
              <div className="choosejobone" id="carrer">
                <input type="radio" className="custom-checkbox" name="career" onChange={() => handleCarrerChange("경력")} />
                <div className="choosejob-text-basic">경력</div>
              </div>
            </label>
          </div>

          <div className="enrollbutton">
            <button className="cancel-basic">취소</button>
            <button className="enroll-basic" onClick={registerUser}>
              등록
            </button>
          </div>

          <div className="log-in-basic">
            <div className="entire-text-basic">이미 계정이 있으신가요?</div>
            <Link to="/login" className="log-in-now-basic">
              로그인 하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSigninPage;

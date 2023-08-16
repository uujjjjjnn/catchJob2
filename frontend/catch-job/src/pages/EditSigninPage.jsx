import React, { useState, useEffect } from "react";
import EditSignin from "../assets/css/member/EditSignin.css";
import axios from "axios";
import MyPage from "./MyPage";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCommentDots, faHeart, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EditSigninPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedJobs, setSelectedJobs] = useState("");
  const [selectedCarrers, setSelectedCarrers] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get("http://43.202.98.45:8089/memberInfo", axiosConfig);
        setImageFile(response.data.mOriginalFileName);
        setEmail(response.data.email);
        setName(response.data.name);
        setSelectedJobs(response.data.job);
        setSelectedCarrers(response.data.hasCareer);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response.status === 500) {
          // 서버 내부 에러 처리
          alert("정보 조회에 실패했습니다.(서버 에러) ");
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div className="body-edit">
      <div className="section-edit">
        <div className="entire-box-edit">
          <h1 className="catchJob-edit">
            catch<span className="red-letter">J</span>ob
          </h1>
          <h3 className="edit-inform">회원정보조회</h3>

          <div className="profile-image-container">
            <label htmlFor="profile-image-input">
              <img src={imageFile ? `${imageFile}` : "/profile.png"} alt="" className="profile-image" />
            </label>
          </div>

          <div className="personDate">
            <div className="input-text-edit">
              이메일
              <span className="input-box-edit" style={{ color: "#807d7d" }}>
                {email}
              </span>
            </div>
            <div className="input-text-edit">
              이름
              <span className="input-box-edit" style={{ color: "#807d7d" }}>
                {name}
              </span>
            </div>
            <div className="input-text-edit">
              직무
              <span className="input-box-edit" style={{ color: "#807d7d" }}>
                {selectedJobs}
              </span>
            </div>
            <div className="input-text-edit">
              경력 여부
              <span className="input-box-edit" style={{ color: "#807d7d" }}>
                {selectedCarrers}
              </span>
            </div>
          </div>
          <div className="enrollbutton-edit">
            <Link to={"/"} className="cancel-edit">
              메인으로
            </Link>
            <Link to={"/password"} className="enroll-edit">
              수정하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSigninPage;

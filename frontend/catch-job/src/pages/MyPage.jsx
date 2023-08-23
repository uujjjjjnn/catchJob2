import React, { useState, useEffect } from "react";
import styles from "../assets/css/member/Mypage.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [password, setPassword] = useState("");
  const [selectedJobs, setSelectedJobs] = useState("");
  const [selectedCarrers, setSelectedCarrers] = useState("");
  const [imageFile, setImageFile] = useState(localStorage.getItem("profileImg"));
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
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setImageFile(fileURL);
    setImageFileName(file);
  };

  const uploadData = async () => {
    if (password === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("pwd", password);
    formData.append("job", selectedJobs);
    formData.append("hasCareer", selectedCarrers);
    formData.append("mOriginalFileName", imageFileName);

    console.log(formData);

    try {
      const response = await axios.post("http://43.202.98.45:8089/memberUpdate", formData, config);
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        alert("회원정보수정을 성공하였습니다.");
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('profileImg',response.data.mOriginalFileName);
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
      alert("회원정보수정을 실패하였습니다.");
    }
  };

  const handleSelectedJobsChange = (job) => {
    setSelectedJobs(job);
  };

  const handleSelectedCarrersChange = (career) => {
    setSelectedCarrers(career);
  };

  const DeleteMember = () => {
    const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까?");
    const token = localStorage.getItem("token");

    if (confirmDelete) {
      // axios를 사용하여 서버로 DELETE 요청을 보냅니다.
      axios
        .delete("http://43.202.98.45:8089/deleteMember", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("name");
          // 로그인 페이지 또는 메인 페이지 등으로 이동
          window.location.href = "/login";
        })
        .catch((error) => {
          alert("회원 탈퇴에 실패했습니다.");
        });
    }
  };

  return (
    <div className={`${styles.body_edit}`}>
      <div className={`${styles.section_edit}`}>
        <div className={`${styles.entire_box_edit}`}>
          <h1 className={`${styles.catchJob_edit}`}>
            catch<span className={`${styles.red_letter}`}>J</span>ob
          </h1>
          <h3 className={`${styles.edit_inform}`}>회원정보수정</h3>

          <div className={`${styles.profile_image_container}`}>
            <label htmlFor="profile-image-input">
              <img src={imageFile ? `${imageFile}` : "/profile.png"} alt="" className={`${styles.profile_image}`} />
              <div className={`${styles.upload_profile_img}`}>
                <FontAwesomeIcon icon={faPencil} className={`${styles.upload_profile_pencil}`} />
              </div>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
                className={`${styles.profile_image_input}`}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className={`${styles.input_text_edit}`}>이메일</div>
          <input type="text" className={`${styles.input_box_edit}`} tabIndex="1" value={email} readOnly style={{ color: "#807d7d" }} />
          <div className={`${styles.input_text_edit}`}>이름</div>
          <input
            type="text"
            className={`${styles.input_box_edit}`}
            tabIndex="2"
            name="name"
            value={name}
            style={{ color: "#444444" }}
            onChange={handleInputChange}
          />
          <div className={`${styles.input_text_edit}`}>비밀번호 변경</div>
          <input
            type="password"
            className={`${styles.input_box_edit}`}
            tabIndex="3"
            name="password"
            value={password}
            style={{ color: "#444444" }}
            onChange={handleInputChange}
          />

          <div className={`${styles.input_text_edit}`}>직무</div>
          <div className={`${styles.choosejob_edit}`} id="pick-edit">
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "웹디자이너"}
                  onChange={() => handleSelectedJobsChange("웹디자이너")}
                />
                <div className={`${styles.choosejob_text_edit}`}>웹디자이너</div>
              </div>
            </label>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "웹퍼블리셔"}
                  onChange={() => handleSelectedJobsChange("웹퍼블리셔")}
                />
                <div className={`${styles.choosejob_text_edit}`}>웹퍼블리셔</div>
              </div>
            </label>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "프론트엔드"}
                  onChange={() => handleSelectedJobsChange("프론트엔드")}
                />
                <div className={`${styles.choosejob_text_edit}`}>프론트엔드</div>
              </div>
            </label>
          </div>
          <div className={`${styles.choosejob_edit}`}>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "백엔드"}
                  onChange={() => handleSelectedJobsChange("백엔드")}
                />
                <div className={`${styles.choosejob_text_edit}`}>백엔드</div>
              </div>
            </label>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "PM"}
                  onChange={() => handleSelectedJobsChange("PM")}
                />
                <div className={`${styles.choosejob_text_edit}`}>PM</div>
              </div>
            </label>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`}>
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="job-edit"
                  checked={selectedJobs === "기타"}
                  onChange={() => handleSelectedJobsChange("기타")}
                />
                <div className={`${styles.choosejob_text_edit}`}>기타</div>
              </div>
            </label>
          </div>

          <div className={`${styles.input_text_edit}`}>경력 여부</div>
          <div className={`${styles.choosejob_edit}`} id="pick-edit">
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`} id="carrer-edit">
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="career-edit"
                  checked={selectedCarrers === "신입"}
                  onChange={() => handleSelectedCarrersChange("신입")}
                />
                <div className={`${styles.choosejob_text_edit}`}>신입</div>
              </div>
            </label>
            <label className={`${styles.labelOne}`}>
              <div className={`${styles.choosejobone_edit}`} id="carrer-edit">
                <input
                  type="radio"
                  className={`${styles.custom_checkbox_edit}`}
                  name="career-edit"
                  checked={selectedCarrers === "경력"}
                  onChange={() => handleSelectedCarrersChange("경력")}
                />
                <div className={`${styles.choosejob_text_edit}`}>경력</div>
              </div>
            </label>
          </div>

          <div className={`${styles.enrollbutton_edit}`}>
            <Link to={"/"} className={`${styles.cancel_edit}`}>
              메인으로
            </Link>
            <button className={`${styles.enroll_edit}`} onClick={uploadData}>
              저장하기
            </button>
          </div>
          <div className={`${styles.quitIdbox}`}>
            <div className={`${styles.quitIdMent}`}>회원정보를 삭제하시겠어요?</div>
            <div className={`${styles.quitIdButton}`} onClick={DeleteMember}>
              회원 탈퇴하기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

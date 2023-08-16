import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/study/BuildStudy.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail } from "../../redux/login";
import { useLocation, useNavigate } from "react-router-dom";
import { stopLoading } from "../../redux/store";

const useQuery = () => new URLSearchParams(useLocation().search);
const BuildStudyPage = (title) => {
  const [isFetched, setIsFetched] = useState(false);
  const [titleState, setTitleState] = useState("");
  const [detailState, setDetailState] = useState("");
  const [data, setData] = useState([]);
  const [bType, setBType] = useState("project");
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState("온라인");
  const [crewCounts, setCrewCounts] = useState({
    webDesigner: 0,
    webPublisher: 0,
    frontend: 0,
    backend: 0,
    PM: 0,
    others: 0,
    studyCrew: 0,
  });
  const [crewCount, setCrewCount] = useState(0);
  const titleRef = useRef();
  const detail = useRef();
  const dispatch = useDispatch();
  const query = useQuery();
  const id = query.get("id");

  let buildData = {};

  const navigate = useNavigate();

  // const userEmail = localStorage.getItem("email");
  const userEmail = useSelector(selectEmail);

  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://43.202.98.45:8089/studyDetail/${id}`, {
        headers,
      });
      console.log(response.data);
      setData(response.data);

      if (response.data.type === "project") {
        setBType("project");
      } else if (response.data.type === "study") {
        setBType("study");
      }

      if (response.data.title) {
        setTitleState(response.data.title);
      }

      if (response.data.field) {
        setSelectedField(response.data.field);
      }

      if (response.data.term) {
        setSelectedTerm(response.data.term);
      }

      if (response.data.loc) {
        console.log(response.data.loc);
        setSelectedLoc(response.data.loc);
      }

      if (response.data.platforms) {
        for (let i = 0; i < response.data.platforms.length; i++) {
          setSelectedPlatforms([...selectedPlatforms, response.data.platforms[i]]);
        }
      }

      if (response.data.detail) {
        setDetailState(response.data.detail);
      }

      setIsFetched(true);
    } catch (error) {
      if (error.message.toLowerCase() === "Network Error".toLowerCase()) {
        alert("네트워크 에러입니다. 서버가 꺼져있을 수 있습니다.");
        console.error(error);
        return;
      } else {
        alert("에러가 발생했습니다.");
        console.error(error);
      }
      dispatch(stopLoading());
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    if (id !== null) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    console.log(bType);
  }, [bType]);

  const alertMaxTitleLength = (e) => {
    console.log(e.target.value.length);
    if (e.target.value.length === 30) {
      alert("제목의 최대 글자 수는 30자 입니다.");
    }
    setTitleState(e.target.value);
  };

  const detailChange = (e) => {
    setDetailState(e.target.value);
  };

  const changeTypeToProject = () => {
    setBType("project");
  };

  const changeTypeToStudy = () => {
    setBType("study");
  };

  const handleFieldChange = (option) => {
    setSelectedField(option);
  };

  const handleTermChange = (option) => {
    setSelectedTerm(option);
  };

  const handlePlatformsChange = (option) => {
    if (selectedPlatforms.includes(option)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== option));
    } else {
      setSelectedPlatforms([...selectedPlatforms, option]);
    }
  };

  const handleLocChange = (event) => {
    const { value } = event.target;
    console.log(value);
    setSelectedLoc(value);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const isValidInput = /^\d{0,2}$/.test(inputValue); // 숫자 0~2개인지 확인

    if (!isValidInput) {
      event.target.value = inputValue.slice(0, 2); // 입력값을 최대 2자리까지만 유지
    }

    const { name, value } = event.target;
    setCrewCounts({ ...crewCounts, [name]: parseInt(value, 10) });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    window.location.href = "/study";
  };

  const handleStudyCrewCount = (e) => {
    setCrewCount(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    console.log(crewCount);
  }, [crewCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(bType);
    const titleValue = titleRef.current.value;
    const detailValue = detail.current.value;
    if (bType === "project") {
      const crewCountsArray = Object.values(crewCounts);
      const sumCrewCounts = crewCountsArray.reduce((a, b) => a + b, 0);

      if (!titleValue || !selectedField || !selectedTerm || !selectedPlatforms || !selectedLoc || sumCrewCounts === 0 || !detailValue) {
        alert("모든 필드를 올바르게 입력해주세요.");
        return;
      }
      buildData = {
        type: bType,
        title: titleValue,
        field: selectedField,
        term: selectedTerm,
        platforms: selectedPlatforms,
        loc: selectedLoc,
        crew: crewCounts,
        detail: detailValue,
        email: userEmail,
      };

      if (isFetched) {
        try {
          const response = await axios.put(`http://43.202.98.45:8089/studyDetail/edit/${id}`, buildData);
          if (response && response.status >= 200 && response.status < 300) {
            alert("성공적으로 수정되었습니다.");
            navigate(-1);
          }
        } catch (error) {
          // 에러가 발생한 경우
          console.error("에러가 발생했습니다.", error);
        }
      } else {
        try {
          // const response = await axios.post(`http://43.202.98.45:8089/buildproject`, buildData); // JSON 데이터를 보내는 경우 'Content-Type': 'application/json' 헤더를 추가해야 합니다.
          const response = await axios.post(`http://43.202.98.45:8089/buildproject`, buildData); // JSON 데이터를 보내는 경우 'Content-Type': 'application/json' 헤더를 추가해야 합니다.
          console.log(response);
          if (response && response.status >= 200 && response.status < 300) {
            alert("성공적으로 등록되었습니다.");
            navigate(-1);
          }
        } catch (error) {
          // 에러가 발생한 경우
          console.error("에러가 발생했습니다.", error);
        }
      }
    } else {
      if (!titleValue || !selectedField || !selectedTerm || !selectedLoc || crewCounts.studyCrew === 0 || !detailValue) {
        alert("모든 필드를 올바르게 입력해주세요.");
        return;
      }
      buildData = {
        type: bType,
        title: titleValue,
        field: selectedField,
        term: selectedTerm,
        loc: selectedLoc,
        crew: crewCounts,
        detail: detailValue,
        email: userEmail,
      };

      if (isFetched) {
        try {
          const response = await axios.put(`http://43.202.98.45:8089/studyDetail/edit/${id}`, buildData);
          if (response && response.status >= 200 && response.status < 300) {
            alert("성공적으로 수정되었습니다.");
            navigate(-1);
          }
        } catch (error) {
          // 에러가 발생한 경우
          console.error("에러가 발생했습니다.", error);
        }
      } else {
        try {
          // const response = await axios.post(`http://43.202.98.45:8089/buildproject`, buildData); // JSON 데이터를 보내는 경우 'Content-Type': 'application/json' 헤더를 추가해야 합니다.
          const response = await axios.post(`http://43.202.98.45:8089/buildproject`, buildData); // JSON 데이터를 보내는 경우 'Content-Type': 'application/json' 헤더를 추가해야 합니다.
          console.log(response);
          if (response && response.status >= 200 && response.status < 300) {
            alert("성공적으로 등록되었습니다.");
            navigate(-1);
          }
        } catch (error) {
          // 에러가 발생한 경우
          console.error("에러가 발생했습니다.", error);
        }
      }
    }
  };

  return (
    <div className={styles.buildPage}>
      {/* <form method="post" action="http://43.202.98.45:8089/buildstudy" onSubmit={handleSubmit}> */}
      <div className={styles.buildType}>
        <div className={`${styles.type} ${bType === "project" && styles.active}`} onClick={changeTypeToProject}>
          프로젝트
        </div>
        <div className={` ${styles.type} ${bType === "study" && styles.active}`} onClick={changeTypeToStudy}>
          스터디
        </div>
      </div>

      {/* =====================프로젝트 명======================= */}
      <div className={styles.wrapper}>
        {bType === "project" ? <div className={styles.title}>프로젝트 명</div> : <div className={styles.title}>스터디 명</div>}
        <input
          type="text"
          name="title"
          placeholder={data ? data.title : "제목"}
          className={styles.titleInput}
          ref={titleRef}
          maxLength="30"
          onChange={alertMaxTitleLength}
          value={titleState}
        />
      </div>

      {/* =====================프로젝트 분야======================= */}
      <div className={styles.wrapper}>
        {bType === "project" ? <div className={styles.title}>프로젝트 분야</div> : <div className={styles.title}>스터디 분야</div>}
        {bType === "project" ? (
          <ul className={styles.items}>
            <li>
              <input
                type="radio"
                name="field"
                id="fashion"
                value="패션"
                checked={selectedField === "패션"}
                onChange={() => handleFieldChange("패션")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="fashion">
                <div className={`${styles.select} ${selectedField === "패션" && styles.active} `}>패션</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="financial"
                value="금융"
                checked={selectedField === "금융"}
                onChange={() => handleFieldChange("금융")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="financial">
                <div className={`${styles.select} ${selectedField === "금융" && styles.active} `}>금융</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="sports"
                value="스포츠"
                checked={selectedField === "스포츠"}
                onChange={() => handleFieldChange("스포츠")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="sports">
                <div className={`${styles.select} ${selectedField === "스포츠" && styles.active} `}>스포츠</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="travel"
                value="여행"
                checked={selectedField === "여행"}
                onChange={() => handleFieldChange("여행")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="travel">
                <div className={`${styles.select} ${selectedField === "여행" && styles.active} `}>여행</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="others"
                value="기타"
                checked={selectedField === "기타"}
                onChange={() => handleFieldChange("기타")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="others">
                <div className={`${styles.select} ${selectedField === "기타" && styles.active} `}>기타</div>
              </label>
            </li>
          </ul>
        ) : (
          <ul className={styles.items}>
            <li>
              <input
                type="radio"
                name="field"
                id="webDesign"
                value="웹디자인"
                checked={selectedField === "웹디자인"}
                onChange={() => handleFieldChange("웹디자인")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="webDesign">
                <div className={`${styles.select} ${selectedField === "웹디자인" && styles.active} `}>웹디자인</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="programming"
                value="프로그래밍"
                checked={selectedField === "프로그래밍"}
                onChange={() => handleFieldChange("프로그래밍")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="programming">
                <div className={`${styles.select} ${selectedField === "프로그래밍" && styles.active} `}>프로그래밍</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="hired"
                value="취업"
                checked={selectedField === "취업"}
                onChange={() => handleFieldChange("취업")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="hired">
                <div className={`${styles.select} ${selectedField === "취업" && styles.active} `}>취업</div>
              </label>
            </li>
            <li>
              <input
                type="radio"
                name="field"
                id="others"
                value="기타"
                checked={selectedField === "기타"}
                onChange={() => handleFieldChange("기타")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="others">
                <div className={`${styles.select} ${selectedField === "기타" && styles.active} `}>기타</div>
              </label>
            </li>
          </ul>
        )}
      </div>

      {/* =====================프로젝트 기간======================= */}
      <div className={styles.wrapper}>
        {bType === "project" ? <div className={styles.title}>프로젝트 기간</div> : <div className={styles.title}>스터디 기간</div>}
        <ul className={styles.items}>
          <li>
            <input
              type="radio"
              name="term"
              id="1"
              value="1개월"
              checked={selectedField === "1개월"}
              onChange={() => handleTermChange("1개월")}
              className={styles.radioBtn}
            />
            <label className={styles.termSelect} htmlFor="1">
              <div className={`${styles.select} ${selectedTerm === "1개월" && styles.active} `}>1개월</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="term"
              id="2"
              value="2개월"
              checked={selectedField === "2개월"}
              onChange={() => handleTermChange("2개월")}
              className={styles.radioBtn}
            />
            <label className={styles.termSelect} htmlFor="2">
              <div className={`${styles.select} ${selectedTerm === "2개월" && styles.active} `}>2개월</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="term"
              id="3"
              value="3개월"
              checked={selectedField === "3개월"}
              onChange={() => handleTermChange("3개월")}
              className={styles.radioBtn}
            />
            <label className={styles.termSelect} htmlFor="3">
              <div className={`${styles.select} ${selectedTerm === "3개월" && styles.active} `}>3개월</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="term"
              id="6"
              value="6개월"
              checked={selectedField === "6개월"}
              onChange={() => handleTermChange("6개월")}
              className={styles.radioBtn}
            />
            <label className={styles.termSelect} htmlFor="6">
              <div className={`${styles.select} ${selectedTerm === "6개월" && styles.active} `}>6개월</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              name="term"
              id="12"
              value="1년 이상"
              checked={selectedField === "1년 이상"}
              onChange={() => handleTermChange("1년 이상")}
              className={styles.radioBtn}
            />
            <label className={styles.termSelect} htmlFor="12">
              <div className={`${styles.select} ${selectedTerm === "1년 이상" && styles.active} `}>1년 이상</div>
            </label>
          </li>
        </ul>
      </div>

      {/* ===================== 지역 ======================= */}
      <div className={styles.wrapper}>
        <div className={styles.title}>지역</div>
        <ul className={styles.items}>
          <li>
            <input
              type="radio"
              name="loc"
              id="online"
              value="온라인"
              checked={selectedLoc === "온라인"}
              onChange={handleLocChange}
              className={styles.radioBtn}
            />
            <label className={styles.locSelect} htmlFor="online">
              <div className={`${styles.select} ${selectedLoc === "온라인" && styles.active} `}>온라인</div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              // name="loc"
              id="seoul"
              value="서울"
              checked={selectedLoc === "서울"}
              onChange={handleLocChange}
              className={styles.radioBtn}
            />
            <label className={styles.locSelect} htmlFor="seoul">
              <div className={`${styles.select} ${selectedLoc !== "온라인" && styles.active} `}>오프라인</div>
            </label>
          </li>
          {selectedLoc !== "온라인" && (
            <select name="loc" className={styles.selects} onChange={handleLocChange} value={selectedLoc}>
              <option value="서울">서울특별시</option>
              <option value="경기">경기도</option>
              <option value="부산">부산광역시</option>
              <option value="인천">인천광역시</option>
              <option value="대구">대구광역시</option>
              <option value="충청">충청도</option>
              <option value="경상">경상도</option>
              <option value="강원">강원도</option>
              <option value="전라">전라도</option>
              <option value="제주">제주도</option>
            </select>
          )}
        </ul>
      </div>

      {/* =====================모집인원======================= */}
      <div className={styles.wrapper}>
        <div className={styles.title}>모집인원</div>
        {bType === "project" ? (
          <ul className={styles.crewList}>
            <li className={styles.crewType}>
              <span className={styles.typeName}>웹디자인 : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input
                    type="number"
                    onChange={handleInputChange}
                    name="webDesigner"
                    defaultValue={0}
                    onFocus={(e) => e.target.select()}
                  />
                  <span>명</span>
                </div>
              </div>
            </li>
            <li className={styles.crewType}>
              <span className={styles.typeName}>웹퍼블리셔 : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input
                    type="number"
                    onChange={handleInputChange}
                    name="webPublisher"
                    defaultValue={0}
                    onFocus={(e) => e.target.select()}
                  />
                  <span>명</span>
                </div>
              </div>
            </li>
            <li className={styles.crewType}>
              <span className={styles.typeName}>프론트엔드 : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input type="number" onChange={handleInputChange} name="frontend" defaultValue={0} onFocus={(e) => e.target.select()} />
                  <span>명</span>
                </div>
              </div>
            </li>
            <li className={styles.crewType}>
              <span className={styles.typeName}>백엔드 : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input type="number" onChange={handleInputChange} name="backend" defaultValue={0} onFocus={(e) => e.target.select()} />
                  <span>명</span>
                </div>
              </div>
            </li>
            <li className={styles.crewType}>
              <span className={styles.typeName}>PM : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input type="number" onChange={handleInputChange} name="PM" defaultValue={0} onFocus={(e) => e.target.select()} />
                  <span>명</span>
                </div>
              </div>
            </li>
            <li className={styles.crewType}>
              <span className={styles.typeName}>기타 : </span>
              <div className={styles.plusMinusBtn}>
                <div className={styles.countNum}>
                  <input type="number" onChange={handleInputChange} name="others" defaultValue={0} onFocus={(e) => e.target.select()} />
                  <span>명</span>
                </div>
              </div>
            </li>
          </ul>
        ) : (
          <ul className={styles.items}>
            <div className={styles.countNum}>
              <input
                type="number"
                name="studyCrew"
                // id="web"
                defaultValue={0}
                onChange={handleInputChange}
                onFocus={(e) => e.target.select()}
              />
              <span>명</span>
            </div>
          </ul>
        )}
      </div>

      {/* =====================출시 플랫폼======================= */}
      {bType === "project" && (
        <div className={styles.wrapper}>
          <div className={styles.title}>출시 플랫폼</div>
          <ul className={styles.items}>
            <li>
              <input
                type="checkbox"
                name="platforms"
                id="web"
                value="웹"
                checked={selectedPlatforms.includes("웹")}
                onChange={() => handlePlatformsChange("웹")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="web">
                <div className={`${styles.select} ${selectedPlatforms.includes("웹") && styles.active} `}>웹</div>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                name="platforms"
                id="android"
                value="안드로이드 앱"
                checked={selectedPlatforms.includes("안드로이드 앱")}
                onChange={() => handlePlatformsChange("안드로이드 앱")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="android">
                <div className={`${styles.select} ${selectedPlatforms.includes("안드로이드 앱") && styles.active} `}>안드로이드 앱</div>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                name="platforms"
                id="ios"
                value="ios 앱"
                checked={selectedPlatforms.includes("ios 앱")}
                onChange={() => handlePlatformsChange("ios 앱")}
                className={styles.radioBtn}
              />
              <label className={styles.fieldSelect} htmlFor="ios">
                <div className={`${styles.select} ${selectedPlatforms.includes("ios 앱") && styles.active} `}>ios 앱</div>
              </label>
            </li>
          </ul>
        </div>
      )}

      {/* =====================프로젝트 설명======================= */}
      <div className={styles.wrapper}>
        <div className={styles.title}>프로젝트 설명</div>
        <textarea
          name="projectDetail"
          id=""
          cols="100"
          rows="10"
          placeholder="내용을 입력하세요."
          className={styles.projectTextarea}
          ref={detail}
          value={detailState}
          onChange={detailChange}
          spellcheck="false"
        ></textarea>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.submitForm}>
          <button className={styles.back} onClick={handleCancel}>
            뒤로 가기
          </button>
          <button className={styles.submit} onClick={handleSubmit}>
            {isFetched ? <span>수정</span> : <span>등록</span>}
          </button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

export default BuildStudyPage;

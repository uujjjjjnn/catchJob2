import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import styles from "../../assets/css/study/Study.module.css";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../redux/store";
import Select from "react-select";
import { type } from "@testing-library/user-event/dist/type";

const StudyPage = () => {
  const [data, setData] = useState([]);
  const [sortedOption, setSortedOption] = useState("all");
  const [sortedLocOption, setSortedLocOption] = useState("all");
  const [sortOption, setSortOption] = useState("popular");
  const [searchParams, setSearchParams] = useSearchParams();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const typeParam = searchParams.get("type");
  const typeLocParam = searchParams.get("loc");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sortByLikes = (a, b) => {
    return b.pLike - a.pLike;
  };

  const sortByDate = (a, b) => {
    return new Date(b.pDate) - new Date(a.pDate);
  };

  const getFilteredData = () => {
    let filteredData = [...data];
    console.log(filteredData);

    if (sortOption === "popular") {
      filteredData = filteredData.sort(sortByLikes);
    } else if (sortOption === "latest") {
      filteredData = filteredData.sort(sortByDate);
    } else if (sortOption === "like") {
      filteredData = filteredData.filter((v) => v.isLike === true);
    } else if (sortOption === "online") {
      filteredData = filteredData.filter((v) => v.loc === "online");
    }

    return filteredData;
  };

  // const filterData = useCallback(
  //   (responseData) => {
  //     let filteredData = responseData;

  //     if (typeParam !== "all") {
  //       filteredData = filteredData.filter((list) => list.type === typeParam);
  //     }

  //     if (typeLocParam !== "all") {
  //       filteredData = filteredData.filter((list) => list.loc === typeLocParam);
  //     }

  //     setData(filteredData.reverse());
  //   },
  //   [typeParam, typeLocParam]
  // );

  const fetchData = async () => {
    console.log(typeParam);
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await axios.get(`http://43.202.98.45:8089/project`, {
        headers,
      });
      console.log(response.data);

      let filteredData = response.data;

      if (typeParam === "all") {
        filteredData = filteredData.filter((list) => list.type === typeParam);
        setData(response.data.reverse());
        return;
      }

      // if (typeLocParam === "all") {
      //   filteredData = filteredData.filter((list) => list.loc === typeLocParam);
      // }

      setData(filteredData.reverse());

      const newProducts = response.data.filter((list) => list.type === typeParam);
      console.log(typeParam);
      setData(newProducts);

      if (typeParam === "like") {
        const likeProducts = response.data.filter((list) => list.isLike === true);
        console.log(response.data.filter((list) => list.isLike === true));
        likeProducts.length !== 0 && setData(likeProducts);
      }

      if (typeParam === "online") {
        const onlineProducts = response.data.filter((list) => list.loc === "온라인");
        setData(onlineProducts);
      }

      console.log(response.data);
      // filterData(response.data);
    } catch (error) {
      if (error.message.toLowerCase() === "Network Error".toLowerCase()) {
        alert("네트워크 에러입니다. 서버가 꺼져있을 수 있습니다.");
      }
      alert("에러가 발생했습니다.");
      dispatch(stopLoading());
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    fetchData().then(() => {
      dispatch(stopLoading());
    });
  }, [dispatch, typeParam]);

  const addHeart = async (event, id) => {
    event.stopPropagation();
    try {
      const response = await axios.post(`http://43.202.98.45:8089/studyDetail/like/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const options = [
    { value: "all", label: "전체" },
    { value: "study", label: "스터디" },
    { value: "project", label: "프로젝트" },
    { value: "like", label: "좋아요" },
    { value: "online", label: "온라인" },
  ];

  const handleOptionChange = (option) => {
    setSortedOption(option.value);
    searchParams.set("type", option.value);
    setSearchParams(searchParams);
    fetchData();
  };

  useEffect(() => {
    console.log(sortedOption);
  }, [sortedOption]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.studyWrapper}>
          <div className={styles.studyPage}>
            <div className={styles.top}>
              <div className={styles.studySort}>
                <FontAwesomeIcon icon={faCheck} className={`${styles.checkIcon} ${sortOption === "latest" && styles.invisible}`} />
                <span className={`${styles.popular} ${styles.btn}`} onClick={() => setSortOption("popular")}>
                  인기순
                </span>
                <FontAwesomeIcon icon={faCheck} className={`${styles.checkIcon} ${sortOption === "popular" && styles.invisible}`} />
                <span className={styles.new} onClick={() => setSortOption("latest")}>
                  최신순
                </span>
              </div>
              <div className={styles.showSelected}>
                {/* <select value={selectedOption} onChange={handleOptionSelect} className={styles.selected}>
                  <option value="">전체</option>
                  <option value="study">스터디</option>
                  <option value="project">프로젝트</option>
                  <option value="like">좋아요</option>
                </select> */}
                {/* <Select
                  onChange={(option) => handleLocOptionChange(option)}
                  defaultValue={locOptions.filter((option) => option.value === typeLocParam)}
                  key={locOptions.filter((option) => option.value === typeLocParam)}
                  isClearable={false}
                  isSearchable={false}
                  options={locOptions}
                /> */}
                <Select
                  onChange={(option) => handleOptionChange(option)}
                  defaultValue={options.filter((option) => option.value === typeParam)}
                  key={options.filter((option) => option.value === typeParam).label}
                  isClearable={false}
                  isSearchable={false}
                  options={options}
                />
              </div>
            </div>
            <div className={styles.gridViewWrapper}>
              <div className={styles.studyGridView}>
                {/* key db id로 변경해야함 */}
                {console.log(getFilteredData())}
                {getFilteredData().map((v) => {
                  return (
                    <div
                      key={v.projectId}
                      className={styles.studyGridElement}
                      onClick={() =>
                        v.type === "project" ? navigate(`/projectDetail?id=${v.projectId}`) : navigate(`/studyDetail?id=${v.projectId}`)
                      }
                    >
                      <div className={styles.type}>
                        {v.type === "study" && (
                          <>
                            <div className={styles.typeWord}>S</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                              <rect x="2.01416" width="25.0439" height="18" fill="#F9DBA1" />
                              <path d="M14.5361 30L1.95669 18H27.1155L14.5361 30Z" fill="#F9DBA1" />
                            </svg>
                          </>
                        )}
                        {v.type === "project" && (
                          <>
                            <div className={styles.typeWord}>P</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                              <rect x="2.01416" width="25.0439" height="18" fill="#D3B4F2" />
                              <path d="M14.5361 30L1.95669 18H27.1155L14.5361 30Z" fill="#D3B4F2" />
                            </svg>
                          </>
                        )}
                      </div>
                      {true && (
                        <div className={styles.heart} onClick={(event) => addHeart(event, v.projectId)}>
                          {console.log(v.isLike)}
                          {v.isLike === false ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path
                                d="M11.4081 1.47208C11.9976 1.16786 12.6398 1.00685 13.2911 1.00003C13.8378 0.997993 14.3792 1.1156 14.8839 1.34599C15.3891 1.57661 15.8474 1.91559 16.2318 2.34308C16.6163 2.77057 16.9191 3.27798 17.1226 3.83558C17.3262 4.39317 17.4263 4.98975 17.4171 5.59037L17.417 5.60167C17.417 7.19425 16.7779 8.69082 15.5313 10.3853C14.2776 12.0894 12.4729 13.9114 10.2387 16.1668L10.2378 16.1678L9.40592 17L8.57001 16.1547C6.33556 13.903 4.5297 12.0819 3.27586 10.3793C2.02923 8.68644 1.39031 7.19132 1.39031 5.60167L1.39022 5.59037C1.38109 4.98975 1.48122 4.39317 1.68475 3.83558C1.88828 3.27798 2.19112 2.77057 2.57553 2.34308C2.95994 1.91559 3.41819 1.57661 3.92344 1.34599C4.42817 1.1156 4.96968 0.997993 5.51629 1.00003C6.16756 1.00685 6.80981 1.16786 7.39923 1.47208C7.98913 1.77657 8.51219 2.21732 8.93262 2.7642L9.40368 3.37694L9.87476 2.7642C10.2952 2.21732 10.8182 1.77657 11.4081 1.47208Z"
                                fill="#C4C4C4"
                                fillOpacity="0.4"
                                stroke="#B2B2B2"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              className={styles.heartActive}
                            >
                              <path
                                d="M11.4081 1.47208C11.9976 1.16786 12.6398 1.00685 13.2911 1.00003C13.8378 0.997993 14.3792 1.1156 14.8839 1.34599C15.3891 1.57661 15.8474 1.91559 16.2318 2.34308C16.6163 2.77057 16.9191 3.27798 17.1226 3.83558C17.3262 4.39317 17.4263 4.98975 17.4171 5.59037L17.417 5.60167C17.417 7.19425 16.7779 8.69082 15.5313 10.3853C14.2776 12.0894 12.4729 13.9114 10.2387 16.1668L10.2378 16.1678L9.40592 17L8.57001 16.1547C6.33556 13.903 4.5297 12.0819 3.27586 10.3793C2.02923 8.68644 1.39031 7.19132 1.39031 5.60167L1.39022 5.59037C1.38109 4.98975 1.48122 4.39317 1.68475 3.83558C1.88828 3.27798 2.19112 2.77057 2.57553 2.34308C2.95994 1.91559 3.41819 1.57661 3.92344 1.34599C4.42817 1.1156 4.96968 0.997993 5.51629 1.00003C6.16756 1.00685 6.80981 1.16786 7.39923 1.47208C7.98913 1.77657 8.51219 2.21732 8.93262 2.7642L9.40368 3.37694L9.87476 2.7642C10.2952 2.21732 10.8182 1.77657 11.4081 1.47208Z"
                                fill="#e2432e"
                                fillOpacity="0.4"
                                stroke="#B2B2B2"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                      <div className={styles.subject}>
                        <h2>{v.title}</h2>
                      </div>
                      <div className={styles.tagsWrap}>
                        <div className={`${styles.tag} ${styles.tag1}`}>{v.loc}</div>
                        <div className={`${styles.tag} ${styles.tag2}`}>{v.field}</div>
                        <div className={`${styles.tag} ${styles.tag3}`}>{v.term}</div>
                      </div>
                      <div className={styles.countHeart}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M6.78256 1.39588C7.15094 1.20574 7.55235 1.10511 7.95942 1.10085C8.30106 1.09958 8.63947 1.17308 8.95492 1.31707C9.27068 1.46121 9.55708 1.67307 9.79733 1.94026C10.0377 2.20744 10.2269 2.52457 10.3541 2.87307C10.4813 3.22156 10.5439 3.59442 10.5382 3.96981L10.5381 3.97687C10.5381 4.97224 10.1387 5.9076 9.35952 6.96663C8.57598 8.03173 7.448 9.17043 6.05165 10.5801C6.05146 10.5803 6.05127 10.5804 6.05107 10.5807L5.53117 11.1008L5.00872 10.5725C3.61219 9.16518 2.48353 8.02703 1.69988 6.96288C0.920733 5.90485 0.521407 4.9704 0.521407 3.97687L0.521354 3.96981C0.515646 3.59442 0.578228 3.22156 0.705436 2.87307C0.832643 2.52457 1.02192 2.20744 1.26217 1.94026C1.50243 1.67307 1.78884 1.46121 2.10462 1.31707C2.42007 1.17308 2.75852 1.09958 3.10015 1.10085C3.50719 1.10511 3.9086 1.20574 4.27698 1.39588C4.64568 1.58618 4.97258 1.86166 5.23535 2.20345L5.52977 2.58642L5.82419 2.20345C6.08696 1.86166 6.41387 1.58618 6.78256 1.39588Z"
                            fill="#C4C4C4"
                            fillOpacity="0.4"
                            stroke="white"
                          />
                        </svg>
                        <span className={styles.heartRate}>{v.pLike}</span>
                      </div>
                      <div className={styles.people}>
                        <div>{v.end ? <span>모집 완료</span> : <span>모집 중</span>}</div>
                        <div>
                          <span>조회수 </span>
                          <span> {v.pCnt}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.makeProjectBtnWrapper}>
                <Link to={"/study/build"} className={styles.makeProject}>
                  <FontAwesomeIcon icon={faPencil} />
                  <div>글 쓰기</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudyPage;

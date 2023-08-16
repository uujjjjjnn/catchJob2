import { React, useEffect, useState } from "react";
import styles from "../assets/css/PortfolioMain.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCommentDots, faHeart, faCheck, faPencil } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
// import PortfolioModal from "../../components/PortfolioModal";
import PortfolioModal from "../components/PortfolioModal";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import Select from "react-select";
import { type } from "@testing-library/user-event/dist/type";

const PortfolioMainPage = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const queryParam = new URLSearchParams(useLocation().search);
  const itemFromURL = queryParam.get("boardId");
  const [sortedOption, setSortedOption] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") || "all";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortOption, setSortOption] = useState("popular");

  const sortByLikes = (a, b) => {
    return b.bLike - a.bLike;
  };

  const sortByDate = (a, b) => {
    return new Date(b.bDate) - new Date(a.bDate);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (itemFromURL) {
      setSelectedItemId(parseInt(itemFromURL));
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [itemFromURL]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    axios
      .get("http://43.202.98.45:8089/", {
        headers: headers,
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("데이터 가져오기 에러:", error);
      });
  }, []);

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  const handleElementClick = async (board_id) => {
    setSelectedItemId(board_id);
    setIsModalOpen(true);
    try {
      await axios.post(`http://43.202.98.45:8089/portfolio/${board_id}`, { board_id });
      console.log("조회수 증가 성공");
    } catch (error) {
      console.error("error", error);
    }
  };
  //조회수 증가 코드

  const options = [
    { value: "all", label: "전체" },
    { value: "heart", label: "좋아요" },
  ];

  const handleOptionChange = (option) => {
    setSortedOption(option.value);
    searchParams.set("type", option.value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    console.log(sortedOption);
  }, [sortedOption]);

  const getFilteredData = () => {
    let filteredData = [...data];

    if (sortedOption === "heart") {
      filteredData = filteredData.filter((item) => item.isLike);
    }

    if (sortOption === "popular") {
      filteredData.sort(sortByLikes);
    } else if (sortOption === "latest") {
      filteredData.sort(sortByDate);
    }

    return filteredData;
  };

  const getClassName = (option) => {
    return sortOption === option ? styles.port_checkIcon : styles.port_invisible;
  };

  return (
    <div className={`${styles.port_wrapper}`}>
      <div className={styles.port_page}>
        <div className={styles.top}>
          <div className={`${styles.port_sort}`}>
            <FontAwesomeIcon icon={faCheck} className={`${getClassName("popular")}`} />
            <span className={`${styles.port_topRated} ${styles.port_btn}`} onClick={() => setSortOption("popular")}>
              인기순
            </span>
            <FontAwesomeIcon icon={faCheck} className={`${getClassName("latest")}`} />
            <span className={`${styles.port_new} ${styles.port_btn}`} onClick={() => setSortOption("latest")}>
              최신순
            </span>
          </div>
          {isLoggedIn ? (
            <div className={styles.showSelected}>
              <Select
                onChange={(option) => handleOptionChange(option)}
                defaultValue={options.filter((option) => option.value === typeParam)}
                key={options.filter((option) => option.value === typeParam)}
                isClearable={false}
                isSearchable={false}
                options={options}
              />
            </div>
          ) : null}
        </div>
        <div className={`${styles.port_GridView}`}>
          {getFilteredData().map((item) => (
            <div key={item.boardId} className={`${styles.element}`} onClick={() => handleElementClick(item.boardId)}>
              <img className={`${styles.img}`} src={item.bCoverFileName} alt="img" />
              <div className={`${styles.info}`}>
                <img className={`${styles.user_img}`} src={item.member.mOriginalFileName} alt="img" />
                <div className={`${styles.info_left}`}>{item.member.name}</div>
                <div className={`${styles.info_right}`}>
                  <FontAwesomeIcon icon={faCommentDots} className={`${styles.faIcon}`} />
                  <span className={`${styles.num}`}>{item.bComment}</span>
                  <FontAwesomeIcon icon={faEye} className={`${styles.faIcon}`} />
                  <span className={`${styles.num}`}>{item.bCnt}</span>
                  <FontAwesomeIcon icon={faHeart} className={`${styles.faIcon}`} />
                  <span className={`${styles.num}`}>{item.bLike}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.makeProjectBtnWrapper}>
          <Link to={"/portfolio/build"} className={styles.makeProject}>
            <FontAwesomeIcon icon={faPencil} />
            <div>글 쓰기</div>
          </Link>
        </div>
      </div>
      {isModalOpen && <PortfolioModal item={data.find((item) => item.boardId === selectedItemId)} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PortfolioMainPage;

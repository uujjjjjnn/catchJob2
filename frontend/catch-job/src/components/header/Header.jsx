import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectEmail, selectLoggedIn, selectName } from "../../redux/login";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const [searchWord, setSearchWord] = useState("");
  const dispatch = useDispatch();
  const uName = useSelector(selectName);
  const uEmail = useSelector(selectEmail);
  const isLoggedIn = useSelector(selectLoggedIn);
  const [username, setUsername] = useState("");

  console.log(uName);
  console.log(uEmail);
  console.log(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      setUsername(localStorage.getItem("name"));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleUpdateProfile = () => {
      setUsername(localStorage.getItem("name"));
    };

    window.addEventListener("updateProfile", handleUpdateProfile);
    return () => {
      window.removeEventListener("updateProfile", handleUpdateProfile);
    };
  }, []);

  const logOutBtn = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    dispatch(logOut());
    <Navigate to="/" />;
  };

  const handleSearch = async () => {
    if (searchWord.length === 0) {
      alert("검색어를 입력하세요");
      return;
    }
    window.location.href = `/search?w=${searchWord}`;
    setSearchWord("");
  };

  return (
    <>
      <div className="header">
        <div className="header-nav">
          <div className="logo">
            <Link to={"/"} className="link">
              catch<span id="logo-j">J</span>ob
            </Link>
          </div>
          <div className="nav">
            <ul className="nav-lists">
              <Link to={"/"} className="link">
                <li className="nav-list">포트폴리오</li>
              </Link>
              <Link to={"/news"} className="link">
                <li className="nav-list">뉴스</li>
              </Link>
              <Link to={"/study?type=all&loc=all"} className="link">
                <li className="nav-list">스터디</li>
              </Link>
              <Link to={"/community"} className="link">
                <li className="nav-list">커뮤니티</li>
              </Link>
              <Link to={"/map"} className="link">
                <li className="nav-list">맵</li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="nav-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="search-box"
              required
              name="search"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            {/* <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /> */}
            {/* <Link to={`/search?w=${searchWord}`}> */}
            <div className="submit-btn" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-bar-icon" />
            </div>
            {/* </Link> */}
          </div>
          <div className="login-wrap">
            {/* 로그인 안했을 경우 */}
            {!isLoggedIn && (
              <div className="joinAndLogin">
                <Link to="/login" className="link login">
                  로그인
                </Link>
                <Link to="/join" className="link join">
                  회원가입
                </Link>
              </div>
            )}
            {/* 로그인 했을 경우 */}
            {isLoggedIn && (
              <div className="header-user-info">
                <Link to="/mypage" className="header-username">
                  <img src={localStorage.getItem("profileImg")} alt="프로필사진" className="header-profile-img" />
                  <div className="header-usernameName">{username} 님</div>
                </Link>
                <div className="header-logout-btn" onClick={logOutBtn}>
                  로그아웃
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="header-height"></div>
    </>
  );
};

export default Header;

import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <Outlet />
      <div className={styles.Footer}>
        <div className={styles.FooterLeft}>
          <Link to={"/"} className={`${styles.FooterLogo} ${styles.Link}`}>
            catch<span className={styles.LogoJ}>J</span>ob
          </Link>
        </div>
        <div className={styles.FooterRight}>
          <ul className={styles.Shortcut}>
            <li className={styles.Title}>바로가기</li>
            <li>
              <Link to={"/"}>포트폴리오</Link>
            </li>
            <li>
              <Link to={"news"}>뉴스</Link>
            </li>
            <li>
              <Link to={"/study"}>스터디</Link>
            </li>
            <li>
              <Link to={"/community"}>커뮤니티</Link>
            </li>
          </ul>
          <ul className={styles.RecruitSites}>
            <li className={styles.Title}>채용 사이트</li>
            <li>
              <Link to={"https://www.saramin.co.kr"} target="_blank" rel="noopener noreferrer">
                사람인
              </Link>
            </li>
            <li>
              <Link to={"https://www.jobkorea.co.kr"} target="_blank" rel="noopener noreferrer">
                잡코리아
              </Link>
            </li>
            <li>
              <Link to={"https://www.work.go.kr"} target="_blank" rel="noopener noreferrer">
                워크넷
              </Link>
            </li>
            <li>
              <Link to={"https://www.wanted.co.kr"} target="_blank" rel="noopener noreferrer">
                원티드
              </Link>
            </li>
          </ul>
          <ul className={styles.MadeBy}>
            <li className={styles.Title}>만든사람들</li>
            <li>
              <Link to={"https://github.com/uujjjjjnn"} target="_blank" rel="noopener noreferrer">
                권유진
              </Link>
            </li>
            <li>
              <Link to={"https://github.com/sangwon976"} target="_blank" rel="noopener noreferrer">
                김상원
              </Link>
            </li>
            <li>
              <Link to={"https://github.com/kjm541006"} target="_blank" rel="noopener noreferrer">
                김주민
              </Link>
            </li>
            <li>
              <Link to={"https://github.com/choigukhee"} target="_blank" rel="noopener noreferrer">
                최국희
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Footer;

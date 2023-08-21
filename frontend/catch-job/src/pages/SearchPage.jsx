import React, { useEffect, useCallback, useState } from "react";
import styles from "../assets/css/Search.module.css";
import axios from "axios";
import he from "he";
import { Link, useLocation, useNavigate } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [portData, setPortData] = useState([]);
  const [studyData, setStudyData] = useState([]);
  const navigate = useNavigate();
  const query = useQuery();
  const searchWord = query.get("w");
  console.log(searchWord);

  function removeDuplicates(data) {
    const uniqueIds = new Set();
    const uniqueData = [];

    for (const item of data) {
      if (item.hasOwnProperty("boardId")) {
        if (!uniqueIds.has(item.boardId)) {
          uniqueIds.add(item.boardId);
          uniqueData.push(item);
        }
      } else if (item.hasOwnProperty("projectId")) {
        if (!uniqueIds.has(item.projectId)) {
          uniqueIds.add(item.projectId);
          uniqueData.push(item);
        }
      }
    }

    return uniqueData;
  }

  const fetchData = useCallback(async () => {
    if (searchWord.length === 0) {
      alert("검색어를 입력하세요");
      return;
    }
    try {
      const response = await axios.get(`http://43.202.98.45:8089/search?keyword=${searchWord}`);
      console.log(response.data);
      const resData = response.data;

      setData(resData);

      const uniqueData = removeDuplicates(resData);

      setPortData(uniqueData.filter((x) => x.hasOwnProperty("boardId")));
      console.log(uniqueData.filter((x) => x.hasOwnProperty("boardId")));

      setStudyData(uniqueData.filter((x) => x.hasOwnProperty("studyId") || x.hasOwnProperty("projectId")));
    } catch (err) {
      console.error(err);
    }
  }, [searchWord]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function stripHTMLTags(str) {
    return str.replace(/<[^>]*>?/gm, "");
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchResultMsg}>
        <h1>검색 결과</h1>
      </div>
      {data.length === 0 ? (
        <div className={styles.none}>
          <h1>검색 결과가 없습니다</h1>
        </div>
      ) : (
        <>
          {portData.length !== 0 && (
            <div className={styles.portfolioWrapper}>
              <div className={styles.portfolioTitle}>
                <h3>
                  포트폴리오 <span className={styles.searchNum}>{data && portData.length}</span> 건
                </h3>
              </div>
              <div className={styles.portfolioSearchResults}>
                {data &&
                  portData.map((x) => (
                    <div className={styles.boardItem} key={x.boardId} onClick={() => navigate(`/?boardId=${x.boardId}`)}>
                      <div className={styles.coverImg}>
                        <img src={x.bCoverFileName} alt="커버이미지" />
                      </div>
                      <div className={styles.boardElement}>
                        <h2>{x.bTitle}</h2>
                        <p>{stripHTMLTags(he.decode(x.bContents))}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {studyData.length !== 0 && (
            <div className={styles.portfolioWrapper}>
              <div className={styles.portfolioTitle}>
                <h3>
                  스터디 <span className={styles.searchNum}>{data && studyData.length}</span> 건
                </h3>
              </div>
              <div className={styles.portfolioSearchResults}>
                {data &&
                  studyData.map((x) => (
                    <div
                      className={styles.studyItem}
                      key={x.studyId ? x.studyId : x.projectId}
                      onClick={() =>
                        x.studyId ? navigate(`/studyDetail?id=${x.projectId}`) : navigate(`/projectDetail?id=${x.projectId}`)
                      }
                    >
                      <div className={styles.itemElement}>
                        <div className={styles.itemEleTitle}>
                          <h2>{x.title}</h2>
                        </div>
                        <p>{stripHTMLTags(he.decode(x.detail))}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;



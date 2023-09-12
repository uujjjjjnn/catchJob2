import React, { useEffect, useState } from "react";
import he from "he";
import axios from "axios";
import styles from "../assets/css/NewsPage.module.css";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { stopLoading } from "../redux/store";
function NewsPage() {
  const [data, setData] = useState({ items: [] });
  const [searchWord, setSearchWord] = useState("it");
  const isLoading = useSelector((state) => state.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchData("it"); // 기본 검색어 설정
      dispatch(stopLoading());
    };
  
    loadInitialData();
    setSearchWord("");
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchWord(e.target.value);
  };
  
  const fetchData = useCallback(async (word) => { // word 파라미터 추가
    try {
      const ID_KEY = "SjdmQwORYjXNJ5U5iLor";
      // const ID_KEY = "Nr8FKE9N4Eqe8gY5XxvD";
      const SECRET_KEY = "vFq0fB_Zlt";
      // const SECRET_KEY = "Q7YFNvGmGv";
      const response = await axios.get(`/api/v1/search/news.json?query=${searchWord.trim()}&display=100&sort=sim`, {
        headers: {
          "X-Naver-Client-Id": ID_KEY,
          "X-Naver-Client-Secret": SECRET_KEY,
        },
      });

      console.log(response.data);
      setData(response.data);
      dispatch(stopLoading());
    } catch (e) {
      console.log(e);
      dispatch(stopLoading());
    } finally {
      console.log(`===========` + data.items);
      
      dispatch(stopLoading());
    }
  };

  const onClick = async () => {
    fetchData(searchWord); // searchWord 전달
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      onClick();
    }
  };

  const removeHTMLTags = (str) => {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const moveToOriginalNews = (link) => {
    const newWindow = window.open(link, "_blank", "noopener,noreferrer");
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const areNewsSimilar = (news1, news2, threshold = 0.8) => {
    const title1 = news1.title.toLowerCase();
    const title2 = news2.title.toLowerCase();

    const words1 = title1.split(" ");
    const words2 = title2.split(" ");

    const commonWordsCount = words1.filter((word) => words2.includes(word)).length;
    const totalWordsCount = Math.max(words1.length, words2.length);

    const similarity = commonWordsCount / totalWordsCount;

    return similarity >= threshold;
  };

  const removeDuplicateNews = (newsList, similarityThreshold = 0.3) => {
    return newsList.reduce((filteredNews, currentNews) => {
      const isSimilarToAny = filteredNews.some((news) => areNewsSimilar(news, currentNews, similarityThreshold));
      if (!isSimilarToAny) {
        filteredNews.push(currentNews);
      }
      return filteredNews;
    }, []);
  };
  const uniqueNewsList = removeDuplicateNews(data.items || []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.news}>
          <div className={styles.searchContainer}>
            <h1>최신 뉴스 키워드를 검색해보세요.</h1>
            <div className={styles.searchBar}>
              <input type="text" value={searchWord} onChange={handleSearch} onKeyDown={handleEnter} placeholder="IT" />
              <button onClick={onClick}>검색</button>
            </div>
          </div>
          {/* {data && <textarea rows={10} value={JSON.stringify(data, null, 2)} readOnly={true} />} */}
          {data &&
            data.items &&
            uniqueNewsList.map((v, i) => {
              return (
                <div className={styles.newsContainer} key={i}>
                  <h1 onClick={() => moveToOriginalNews(v.originallink ? v.originallink : v.link)}>{removeHTMLTags(he.decode(v.title))}</h1>
                  <div onClick={() => moveToOriginalNews(v.originallink ? v.originallink : v.link)}>
                    {removeHTMLTags(he.decode(v.description))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

export default NewsPage;
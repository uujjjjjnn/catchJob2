import React, { useEffect, useRef, useState } from "react";
import styles from "../../assets/css/study/StudyDetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClipboard, faClipboardCheck, faEye, faHeart, faShareNodes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { stopLoading } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import StudyModal from "./StudyModal";
import { selectLoggedIn } from "../../redux/login";

const useQuery = () => new URLSearchParams(useLocation().search);
const StudyDetailPage = () => {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [isOpen, setIsOpen] = useState(null);
  const [liked, setLiked] = useState(false);
  const [viewCount, setViewCount] = useState(null);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const commentRef = useRef();
  const isLoggedIn = useSelector(selectLoggedIn);
  const userEmail = localStorage.getItem("email");
  const userId = localStorage.getItem("memId");
  const navigate = useNavigate();
  console.log(`로그인 여부: ${isLoggedIn}`);
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let commentData = {};

  const query = useQuery();
  const id = query.get("id");
  console.log(id);

  const loginAlert = () => {
    alert("로그인 후 가능합니다.");
    window.location.href = "/login";
  };

  const cancelApply = async (pMemId) => {
    try {
      const response = await axios.delete(`http://43.202.98.45:8089/studyDetail/cancel/${pMemId}`);
      if (response.status === 200) {
        alert("삭제되었습니다.");
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://43.202.98.45:8089/studyDetail/${id}`, {
        headers,
      });
      setData({ ...data, comments: response.data.comments });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://43.202.98.45:8089/studyDetail/${id}`, {
        headers,
      });

      if (viewCount === null) {
        setViewCount(response.data.pCnt);
      }

      if (response.status === 500) {
        window.location.href = "/study";
      }

      const comments = response.data.comments;
      setData({
        ...response.data,
        viewCount,
        comments: comments, // 응답에서 받은 댓글 데이터를 저장합니다.
      });

      if (response.data.isLike === true) {
        setLiked(true);
      } else {
        setLiked(false);
      }
      console.log(response.data);
      console.log(viewCount);
    } catch (error) {
      if (error.message.toLowerCase() === "Network Error".toLowerCase()) {
        alert("네트워크 에러입니다. 서버가 꺼져있을 수 있습니다.");
        return;
      }

      if (error.message.toLowerCase() === "Request failed with status code 500".toLocaleLowerCase()) {
        console.log(error);
        alert("글을 찾을 수 없습니다.");
        window.location.href = "/study?type=all";
        return;
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
  }, [dispatch, id]);

  const copyUrl = () => {
    let currentUrl = window.document.location.href;

    let t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = currentUrl;
    t.select();
    document.execCommand("copy");
    document.body.removeChild(t);
    setCopied(true);

    // alert("url이 복사되었습니다");
  };

  const handleOpenModal = (key) => {
    setIsOpen(key);
    setModalType("participant");
  };

  const handleCloseModal = () => {
    setIsOpen(null);
    fetchData();
  };

  const handleOpenModalForWriter = (key) => {
    setIsOpen(key);
    setModalType("writer");
  };

  const submitComment = async () => {
    if (!commentRef.current.value) {
      alert("댓글을 입력해주세요.");
      return;
    }

    commentData = {
      projectId: id,
      commentContent: commentRef.current.value,
    };

    try {
      const response = await axios.post(`http://43.202.98.45:8089/studyDetail/comment/${id}`, commentData);
      if (response.status === 200) {
        console.log("등록완료");
      }
      fetchComments();
      commentRef.current.value = "";
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  const handleLikeBtn = async () => {
    try {
      const response = await axios.post(`http://43.202.98.45:8089/studyDetail/like/${id}`);
      // if (response.data.isLike === true) {
      //   console.log(response.data.isLike);
      //   setLiked(() => true);
      // }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async () => {
    try {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        const response = await axios.delete(`http://43.202.98.45:8089/studyDetail/delete/${id}`, id);
        if (response.status === 200) {
          console.log("삭제완료");
        }
        alert("삭제가 완료되었습니다.");
        navigate(-1);
      } else {
        console.log("삭제 취소");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const finishProject = async () => {
    try {
      const response = await axios.put(`http://43.202.98.45:8089/studyDetail/done/${id}`);
      if (response.status === 200) {
        console.log("모집 전송 성공");
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://43.202.98.45:8089/studyDetail/comment/delete/${commentId}`);
      if (response.status === 200) {
        console.log("댓글 삭제 성공");
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateProject = async () => {
    // try {
    //   const response = await axios.put(`http://43.202.98.45:8089/studyDetail/edit/${id}`);

    // } catch (err) {
    //   console.error(err);
    // }
    window.location.href = `/study/build?id=${id}`;
  };

  return (
    // <div className={styles.studyDetailWrapper}>
    <main>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.studyDetailHeader}>
            <div className={styles.studyDetailTypeWrapper}>
              <div className={styles.studyDetailType}>
                <h2>{data.type === "project" ? "프로젝트" : "스터디"}</h2>
              </div>
            </div>
            <div className={styles.studyDetailTitle}>
              <h2 className={styles.title}>{data.title}</h2>
              <div className={styles.studyInfo}>
                <div className={styles.studyTypeWrapper}>
                  <span className={styles.studyTypeTitle}>{data.type === "project" ? "프로젝트 분야" : "스터디 분야"}</span>
                  <span className={styles.studyTypeContent}>{data.field}</span>
                </div>
                <div className={styles.studyTypeWrapper}>
                  <span className={styles.studyTypeTitle}>{data.type === "project" ? "프로젝트 기간" : "스터디 기간"}</span>
                  <span className={styles.studyTypeContent}>{data.term}</span>
                </div>
                <div className={styles.studyTypeWrapper}>
                  <span className={styles.studyTypeTitle}>{data.type === "project" ? "프로젝트 지역" : "스터디 지역"}</span>
                  <span className={styles.studyTypeContent}>{data.loc}</span>
                </div>
              </div>
            </div>

            <div className={styles.studyDetailTags}>
              {data.end === true ? (
                <span className={styles.studyDetailTag}>모집 완료</span>
              ) : (
                <span className={styles.studyDetailTag}>모집 중</span>
              )}
              {/* <span className={styles.studyDetailTag}>1 / 3</span> */}
            </div>
          </div>
          <section>
            <div className={styles.studyDetailPage}>
              <div className={styles.left}>
                {/* <div className={styles.leftContainer}>
                  <div className={styles.leftTitle}>
                    <h3>기술/언어</h3>
                  </div>
                  <div className={styles.languages}>
                    <div className={styles.language}>Javascript</div>
                    <div className={styles.language}>Java</div>
                    <div className={styles.language}>C</div>
                  </div>
                </div> */}
                <div className={styles.leftContainer}>
                  <div className={styles.leftTitle}>
                    <h3>설명</h3>
                  </div>
                  <div className={styles.detail} style={{ whiteSpace: "pre-wrap" }}>
                    {data.detail}
                  </div>
                </div>
                {data && data.type === "project" && (
                  <div className={styles.leftContainer}>
                    <div className={styles.leftTitle}>
                      <h3>출시 플랫폼</h3>
                    </div>
                    <div className={styles.languages}>
                      {data &&
                        data.platforms.map((v, i) => {
                          console.log(v[0]);
                          return (
                            <div className={styles.language} key={i}>
                              {v}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className={styles.leftContainer}>
                  <div className={styles.leftTitle}>
                    <h3>모집 인원</h3>
                  </div>
                  <div className={styles.crewContainer}>
                    {data.crew &&
                      Object.entries(data.crew)
                        .filter(([, memNum]) => memNum > 0)
                        .map((x) => {
                          return (
                            <div className={data.type === "study" ? `${styles.crewsStudy}` : `${styles.crews}`} key={x[0]}>
                              {x[0] !== "studyCrew" ? <div>{x[0]}</div> : null}
                              <div>
                                <span className={styles.crewNum}>
                                  {data.applicants.filter((k) => k.projectJob === x[0]).length} / {x[1]}
                                </span>{" "}
                              </div>
                              {/* 1. 작성자가 아닐경우 */}
                              {data && data.member && data.member.email !== localStorage.getItem("email") && (
                                <>
                                  {isLoggedIn &&
                                  data &&
                                  data.applicants
                                    .filter((k) => k.projectJob === x[0])
                                    .map((x) => {
                                      return x.memberEmail;
                                    })
                                    .includes(userEmail) ? (
                                    <div
                                      className={styles.crewProgress}
                                      onClick={() =>
                                        cancelApply(
                                          isLoggedIn &&
                                            data &&
                                            data.applicants
                                              .filter((k) => k.projectJob === x[0])
                                              .map((x) => {
                                                return x.projectMemberId;
                                              })
                                              .join()
                                        )
                                      }
                                    >
                                      <span>지원취소</span>
                                    </div>
                                  ) : (
                                    <div
                                      className={styles.crewProgress}
                                      onClick={
                                        data.end ? () => alert("모집이 끝났습니다.") : isLoggedIn ? () => handleOpenModal(x[0]) : loginAlert
                                      }
                                    >
                                      <span>지원</span>
                                    </div>
                                  )}
                                </>
                              )}

                              {/* 2. 작성자일 경우 */}
                              {data && data.member && data.member.email === localStorage.getItem("email") && (
                                <div
                                  className={styles.crewProgress}
                                  onClick={isLoggedIn ? () => handleOpenModalForWriter(x[0]) : loginAlert}
                                >
                                  지원자 확인
                                </div>
                              )}
                              {/* {data ? <span>지원자 수: {data.applicants.filter((k) => k.projectJob === x[0]).length}</span> : 0} */}
                              <StudyModal
                                isOpen={isOpen === x[0]}
                                onClose={handleCloseModal}
                                applyType={x[0]}
                                modalType={modalType}
                                data={data.applicants}
                              />
                            </div>
                          );
                        })}
                  </div>
                </div>
                <div className={styles.leftContainer}>
                  <div className={styles.leftTitle}>
                    <h3>Comments</h3>
                  </div>
                  <div className={styles.commentsWrapper}>
                    <div className={styles.registerComment}>
                      {/* <div className={styles.registerCommentProfileImg}>
                        <img src={localStorage.getItem("profileImg")} alt="프로필사진" />
                      </div> */}
                      <div className={styles.registerCommentProfileImg}>
                        {localStorage.getItem("profileImg") ? (
                          <img src={localStorage.getItem("profileImg")} alt="프로필사진" />
                        ) : (
                          <img src="http://43.202.98.45:8089/upload/profile.png" alt="프로필사진" />
                        )}
                      </div>
                      <div className={styles.comment}>
                        <textarea
                          spellCheck="false"
                          rows="4"
                          maxLength={200}
                          placeholder="댓글을 입력하세요."
                          className={styles.commentTextarea}
                          ref={commentRef}
                          onKeyPress={handleKeyPress}
                        ></textarea>
                      </div>
                      <div className={styles.commentBtn} onClick={isLoggedIn ? submitComment : loginAlert}>
                        댓글 등록
                      </div>
                    </div>
                    {data &&
                      data.comments &&
                      data.comments.reverse().map((commentData, i) => {
                        return (
                          <div className={styles.commentArea} key={commentData.commentId}>
                            <div className={styles.commentUserInfo}>
                              <div className={styles.registerCommentProfileImg}>
                                <img src={commentData.memberProfile} alt="프로필사진" />
                              </div>
                              <div className={styles.commentUserDetail}>
                                <div>
                                  <span className={styles.userName}>{commentData.memberName}</span>
                                  {data.member.email === commentData.memberEmail && <span>(작성자)</span>}
                                </div>
                                <span className={styles.time}>{commentData.commentDate.replace("T", " ")}</span>
                              </div>
                            </div>
                            <div className={styles.commentListComment}>
                              <span style={{ whiteSpace: "pre-wrap" }}>{commentData.commentContent}</span>
                              {commentData.memberEmail === userEmail && (
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className={styles.deleteCommentBtn}
                                  onClick={() => deleteComment(commentData.commentId)}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {/* <div className={styles.commentArea}>
                      <div className={styles.commentUserInfo}>
                        <div className={styles.registerCommentProfileImg}>
                          <img src="/profile.png" alt="프로필사진" />
                        </div>
                        <div className={styles.commentUserDetail}>
                          <span className={styles.userName}>도비</span>
                          <span className={styles.time}>2023-06-27 16:04:11</span>
                        </div>
                      </div>
                      <div className={styles.commentListComment}>
                        <span>메일 드렸어요 확인해주세요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* ========================= 오른쪽 ============================= */}
              <div className={styles.right}>
                <div className={styles.leaderInfo}>
                  <div className={styles.leaderInfoTop}>
                    <h2>리더 정보</h2>
                  </div>
                  <div className={styles.leaderInfoMiddle}>
                    <div className={styles.leaderProfileImg}>
                      {data && data.member && data.member.mOriginalFileName && <img src={data.member.mOriginalFileName} alt="프로필사진" />}
                    </div>
                    <div className={styles.leaderProfileName}>
                      <h2>{data && data.member && data.member.name}</h2>
                      <span>
                        ({data && data.member && data.member.job}) {data && data.member && data.member.hasCareer}
                      </span>
                    </div>
                  </div>
                  <div className={styles.viewInfo}>
                    <div className={styles.view}>
                      <FontAwesomeIcon icon={faEye} />
                      <span className={styles.num}>{viewCount}</span>
                    </div>
                    <div className={styles.heart}>
                      <FontAwesomeIcon icon={faHeart} />
                      {data && <span className={styles.num}>{data.pLike}</span>}
                    </div>
                    <div className={styles.heart}>
                      <FontAwesomeIcon icon={faShareNodes} />
                      <span className={styles.num} onClick={copyUrl}>
                        공유하기
                      </span>
                      {!copied ? (
                        <FontAwesomeIcon icon={faClipboard} onClick={copyUrl} className={styles.copyIcon} />
                      ) : (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </div>
                  </div>
                  <div className={styles.likeBtnWrapper}>
                    <div className={`${styles.likeBtn} ${liked && styles.likeActive}`} onClick={isLoggedIn ? handleLikeBtn : loginAlert}>
                      {/* <FontAwesomeIcon icon={faHeart} className={styles.likeProject} /> */}
                      {liked && (
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={styles.likeProject}>
                          <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                        </svg>
                      )}

                      {liked ? <span>좋아요!!</span> : <span>좋아요 누르기</span>}
                    </div>
                  </div>
                  {/* 작성자가 접근했을 경우 보이는 레이아웃 */}
                  {data && data.member && userEmail === data.member.email && (
                    <>
                      <div className={styles.updateDeleteWrapper}>
                        <div className={styles.update} onClick={isLoggedIn ? updateProject : loginAlert}>
                          수정
                        </div>
                        <div className={styles.delete} onClick={isLoggedIn ? deleteProject : loginAlert}>
                          삭제
                        </div>
                      </div>
                      {!data.end ? (
                        <div className={styles.finishedWrapper} onClick={finishProject}>
                          <span className={styles.finished}>모집 완료하기</span>
                        </div>
                      ) : (
                        <div className={styles.finishedWrapper} onClick={finishProject}>
                          <span className={styles.finished}>다시 모집하기</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
    // </div>
  );
};

export default StudyDetailPage;

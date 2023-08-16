import React, { useState, useRef, useEffect } from "react";
import styles from "../assets/css/PortfolioModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faPenToSquare, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ShareModal from "../components/ShareModal";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const PortfolioModal = ({ item, onClose }) => {
  const token = localStorage.getItem("token");
  const writerName = localStorage.getItem("name");
  const writerEmail = localStorage.getItem("email");

  const contentCommentRef = useRef(null);
  const [isLiked, setIsLiked] = useState(item && item.isLike);
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState((item && item.comments) || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const [firstModalUrl, setFirstModalUrl] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [editableCommentId, setEditableCommentId] = useState(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (item) {
      const newModalUrl = window.location.origin + location.pathname + "?boardId=" + item.boardId;
      setFirstModalUrl(newModalUrl);
    }
  }, [item, location.pathname]);

  if (!item) {
    return null;
  }

  const handleLike = async (event) => {
    event.stopPropagation();

    if (!token) {
      alert("'좋아요'를 하기 위해서는 로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션 (적절한 경로로 변경해야 함)
      return;
    } else {
      try {
        const response = await axios.post(`http://43.202.98.45:8089/like/${item.boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("좋아요 처리 완료");
          setIsLiked((prevIsLiked) => !prevIsLiked);
        } else {
          console.log("좋아요 처리 실패");
        }
      } catch (error) {
        console.log("좋아요 처리 중 오류 발생:", error);
      }
    }
  };

  const handleComment = (event) => {
    event.stopPropagation();
    contentCommentRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = (event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    navigate("/portfolio/build", { state: { boardId: item.boardId } });
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    const response = await axios.delete(`http://43.202.98.45:8089/portfolio/delete/${item.boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("게시물이 삭제되었습니다.");
      onClose();
      window.location.reload();
    } else {
      console.log("게시물 삭제에 실패하였습니다.");
    }
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(
      2,
      "0"
    )}`;
    return formatDate;
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleEditCommentChange = (e) => {
    setEditComment(e.target.value);
  };

  const toggleCommentEdit = (commentId) => {
    setEditableCommentId(commentId === editableCommentId ? null : commentId);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      submitComment();
    }
  };

  const submitComment = async () => {
    //새로운 댓글 전송 부분

    if (!token) {
      alert("댓글 작성을 위해 로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션 (적절한 경로로 변경해야 함)
      return;
    } else {
      if (comment) {
        const response = await axios.post(
          `http://43.202.98.45:8089/portfolio/comment/${item.boardId}`,
          {
            memberName: writerName,
            memberEmail: writerEmail,
            commentContent: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const commentDateFromServer = response.data.commentDate;

          console.log("댓글 전송 성공");
          console.log(token);
          console.log(writerName);
          console.log(writerEmail);
          console.log(comment);

          setCommentList([
            {
              commentContent: comment,
              commentDate: commentDateFromServer,
              memberName: writerName,
              memberEmail: writerEmail,
            },
            ...commentList,
          ]);

          setComment("");
        } else {
          console.log("댓글 전송 실패", Error);
        }
      } else {
        setErrorMessage("내용을 작성해야 댓글 등록이 가능합니다.");
      }
    }
  };

  const handleSubmitEditedComment = async (commentId) => {
    //댓글 수정 전송 부분
    if (!editComment) {
      // editComment 값이 비어있을 때 기존 댓글 내용 그대로 유지
      setEditableCommentId(null);
      return;
    }

    const response = await axios.put(
      `http://43.202.98.45:8089/portfolio/comment/edit/${commentId}`,
      {
        commentContent: editComment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      // 댓글 수정 성공
      const newCommentList = commentList.map((comment) => {
        if (comment.commentId === commentId) {
          return {
            ...comment,
            commentContent: editComment,
          };
        }
        return comment;
      });
      setCommentList(newCommentList);
      setEditableCommentId(null);
      console.log("댓글 수정 성공");
    } else {
      console.log("댓글 수정 실패", Error);
    }
  };

  const handleDeleteEditedComment = async (commentId) => {
    const response = await axios.delete(`http://43.202.98.45:8089/portfolio/comment/delete/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log("댓글이 삭제되었습니다.");
      const newCommentList = commentList.filter((comment) => comment.commentId !== commentId);
      setCommentList(newCommentList);
    } else {
      console.log("댓글 삭제에 실패하였습니다.");
    }
  };

  return (
    <>
      <div className={`${styles.modalBackdrop}`} onClick={onClose}>
        <div className={`${styles.modalContent}`} onClick={(e) => e.stopPropagation()}>
          <div className={`${styles.contentInfo}`}>
            <img className={`${styles.user_img}`} src={item.member.mOriginalFileName} alt="img" />
            <div className={`${styles.contentUser}`}>
              <div className={`${styles.contentUser_title}`}>{item.bTitle}</div>
              <div className={`${styles.contentUser_info}`}>
                {item.member.name} ({item.member.email})
              </div>
            </div>
          </div>
          <div className={`${styles.realContent}`} dangerouslySetInnerHTML={{ __html: item.bContents }}></div>
          <div className={`${styles.tagList}`}>
            {item.tags[0] && <div className={`${styles.tagElement}`}>{item.tags[0]}</div>}
            {item.tags[1] && <div className={`${styles.tagElement}`}>{item.tags[1]}</div>}
            {item.tags[2] && <div className={`${styles.tagElement}`}>{item.tags[2]}</div>}
          </div>
          {item.bFileName && item.bFileName !== "http://43.202.98.45:8089/upload/null" &&(
            <div className={`${styles.contentFile}`}>
              첨부파일:{" "}
              <a href={item.bFileName} download target="_blank" rel="noopener noreferrer">
              <span className={`${styles.contentFileName}`}>{item.bFileName.split('/').pop()}</span>
              </a>
            </div>
          )}

          <div className={`${styles.contentComment}`} ref={contentCommentRef}>
            <div className={`${styles.comments}`}>Comments</div>
            <textarea
              className={`${styles.commentBox}`}
              placeholder={errorMessage ? errorMessage : "댓글을 작성하세요.(최대 작성 가능한 글자 수는 100자입니다.)"}
              maxlength="100"
              value={comment}
              onChange={handleCommentChange}
              onKeyPress={handleKeyPress}
            ></textarea>
            <button className={`${styles.commentEnter}`} onClick={submitComment}>
              등록
            </button>
          </div>
          <div className={`${styles.readComment}`}>
            {commentList.map((comment) => (
              <div className={`${styles.readCommentItem}`}>
                <div key={comment.commentDate} className={`${styles.contentUser}`}>
                  <div className={`${styles.contentUser_title}`}>
                    {comment.memberName} ({comment.memberEmail})
                  </div>
                  <div className={`${styles.contentUser_info}`} style={{ color: "#9F9F9F" }}>
                    {formatCommentDate(comment.commentDate)}
                  </div>
                </div>
                <div className={`${styles.commentContent}`}>
                  {editableCommentId === comment.commentId ? (
                    <textarea
                      className={`${styles.editCommentText}`}
                      value={editComment || comment.commentContent}
                      maxlength="100"
                      onChange={handleEditCommentChange}
                    />
                  ) : (
                    <div>{comment.commentContent}</div>
                  )}
                  {comment.memberEmail === writerEmail && (
                    <div className={`${styles.commentEdit}`}>
                      {editableCommentId === comment.commentId ? (
                        <button className={`${styles.commentEditButton}`} onClick={() => handleSubmitEditedComment(comment.commentId)}>
                          수정 완료
                        </button>
                      ) : (
                        <button className={`${styles.commentEditButton}`} onClick={() => toggleCommentEdit(comment.commentId)}>
                          수정
                        </button>
                      )}
                      <button className={`${styles.commentEditButton}`} onClick={() => handleDeleteEditedComment(comment.commentId)}>
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                <div className={`${styles.commentBar}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {item && (
        <div className={`${styles.entireButtonSet}`}>
          <div className={`${styles.buttonSet}`}>
            <button className={`${styles.modalButton}`} style={{ backgroundColor: "#E2432E" }} onClick={handleLike}>
              <FontAwesomeIcon icon={faHeart} className={`${styles.faIcon}`} style={{ color: isLiked ? "#ffb5b5" : "#ffffff" }} />
            </button>
            <div className={`${styles.buttonMent}`}>좋아요</div>
          </div>
          <div className={`${styles.buttonSet}`} onClick={handleComment}>
            <button className={`${styles.modalButton}`}>
              <FontAwesomeIcon icon={faComment} className={`${styles.faIcon}`} />
            </button>
            <div className={`${styles.buttonMent}`}>댓글</div>
          </div>
          <div className={`${styles.buttonSet}`} onClick={handleShare}>
            <button className={`${styles.modalButton}`}>
              <FontAwesomeIcon icon={faShare} className={`${styles.faIcon}`} />
            </button>
            <div className={`${styles.buttonMent}`}>공유하기</div>
          </div>
          {item.member.email === writerEmail && (
            <>
              <div className={`${styles.buttonSet}`} onClick={handleEdit}>
                <button className={`${styles.modalButton}`}>
                  <FontAwesomeIcon icon={faPenToSquare} className={`${styles.faIcon}`} />
                </button>
                <div className={`${styles.buttonMent}`}>수정하기</div>
              </div>
              <div className={`${styles.buttonSet}`} onClick={handleDelete}>
                <button className={`${styles.modalButton}`}>
                  <FontAwesomeIcon icon={faTrash} className={`${styles.faIcon}`} />
                </button>
                <div className={`${styles.buttonMent}`}>삭제하기</div>
              </div>
            </>
          )}
        </div>
      )}
      {isModalOpen && <ShareModal item={item} onClose={() => setIsModalOpen(false)} modalUrl={firstModalUrl} />}
    </>
  );
};

export default PortfolioModal;

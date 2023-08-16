import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectEmail } from "../../redux/login";

const CommunityComment = (props) => {
  const [comments, setComments] = useState([]);
  const [commentVal, setCommentVal] = useState();
  const [editMode, setEditMode] = useState(false); // New state variable for edit mode
  const [editedCommentVal, setEditedCommentVal] = useState("");
  const userEmail = useSelector(selectEmail);

  const getComments = async () => {
    try {
      await axios
        .get("http://43.202.98.45:8089/community/comment/list", {
          params: {
            communityId: props.communityId,
          },
        })
        .then((response) => {
          console.log(response.data);
          setComments(response.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (commentVal.trim() === "") {
      alert("댓글을 입력해주세요.");

      return;
    }

    const newComment = {
      communityId: props.communityId,
      cComcontent: commentVal,
      //email: userEmail,
    };
    try {
      await axios.post(`http://43.202.98.45:8089/community/comment/insert`, newComment).then((response) => {
        console.log(response.data);

        setCommentVal("");
        getComments();
      });
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  useEffect(() => {
    if (props.open) getComments();
  }, [props.open]);

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
  const handleCommentChange = (event, i) => {
    setCommentVal(event.target.value);
  };

  const handleEditComment = (commentId) => {
    // 수정 기능을 구현하는 로직을 작성합니다.
    // commentId를 기반으로 해당 댓글을 수정하는 작업을 수행합니다.
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://43.202.98.45:8089/community/comment/delete?commentId=${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };
  return (
    <>
      <div className="modal">
        <div className="mentment">
          <textarea
            className="mentmentment"
            maxLength={1000}
            placeholder="댓글을 입력해주세요."
            style={{ height: 20 }}
            value={commentVal}
            onChange={handleCommentChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              fontWeight: "700",
              fontSize: "11px",
              color: "white",
              backgroundColor: "#555",
              border: 0,
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={handleSubmit}
          >
            댓글 등록
          </button>
        </div>
      </div>

      <div className="commentsContainer">
        {comments &&
          comments.map((comment) => (
            <div key={comment.communityId} className="commentment">
              <div className="commentmentuser">
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <div>
                    <img className="commentmprofile" src={comment.memberProfile} alt="프로필" />
                  </div>
                  <div>
                    <div style={{ alignItems: "center", display: "flex", gap: "4px" }}>
                      <div style={{ fontWeight: "550" }}>{comment.memberName}</div>
                      <span>({comment.memberEmail})</span>
                    </div>

                    <div>
                      <span className="datecomment">{formatCommentDate(comment.commentDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="commenteditBtn">
                  {comment.memberEmail === userEmail && (
                    <>
                      <span style={{ color: "#E2432E" }} onClick={() => handleDeleteComment(comment.commentId)}>
                        삭제
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="commentmentment">
                <p>{comment.cComcontent}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CommunityComment;

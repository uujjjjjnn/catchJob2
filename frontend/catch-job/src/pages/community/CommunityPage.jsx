import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/CommunityPage.css";
import PostModal from "./CommunityPostModal";
import "../../assets/css/CommunityPostModal.css";
import Heart from "../../assets/img/heart.svg";
import Noheart from "../../assets/img/noheart.svg";
import { useSelector } from "react-redux";
import { selectEmail } from "../../redux/login";
import axios from "axios";
import CommunityComment from "./CommunityComment";

function Card(props) {
  const [commentModalOpen, setCommentModalOpen] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);

  const [expanded, setExpanded] = useState([]);

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [showComments, setShowComments] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [communityData, setCommunityData] = useState([]);
  const userEmail = useSelector(selectEmail);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const toggleEditModal = (post) => {
    setEditModalOpen(!editModalOpen);
    setEditPost(post);
  };

  // Function to fetch community data from the server
  const fetchCommunityData = async () => {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await axios.get("http://43.202.98.45:8089/community", { headers });
      const updatedData = response.data.map((post) => ({ ...post, likeCount: post.cLike || 0 }));
      console.log(response.data);
      setCommunityData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };
  //글목록
  useEffect(() => {
    fetchCommunityData();
  }, []);

  // Effect to fetch community data on component mount
  // useEffect(() => {
  //   // Check if communityData is stored in local storage
  //   const storedCommunityData = localStorage.getItem("communityData");
  //   if (storedCommunityData) {
  //     setCommunityData(JSON.parse(storedCommunityData));
  //   } else {
  //     fetchCommunityData();
  //   }
  // }, []);

  // Function to save community data to local storage
  const saveCommunityDataToLocalStorage = () => {
    // localStorage.setItem("communityData", JSON.stringify(communityData));
  };

  const handleChangeLike = () => {
    fetchCommunityData();
  };

  const toggleCommentModal = (communityId) => {
    setCommentModalOpen((prevCommentModalOpen) => {
      const newCommentModalOpen = [...prevCommentModalOpen];
      newCommentModalOpen[communityId] = !newCommentModalOpen[communityId];
      return newCommentModalOpen;
    });
    setShowComments((prevShowComments) => {
      const newShowComments = [...prevShowComments];
      newShowComments[communityId] = !newShowComments[communityId];
      return newShowComments;
    });
  };

  const toggleExpanded = (i) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[i] = !newExpanded[i];
      return newExpanded;
    });
  };

  const handleCommentChange = (event, i) => {
    const newComments = [...comments];
    newComments[i] = event.target.value;
    setComments(newComments);
  };

  const handleSubmitComment = async (newPost) => {};

  const togglePostModal = () => {
    setPostModalOpen(!postModalOpen);
  };

  const handlePostSubmit = async (newPost) => {};

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredData = selectedCategory === "전체" ? communityData : communityData.filter((post) => post.cType === selectedCategory);

  const truncateContent = (content, maxLines) => {
    const lines = content.split("\n");

    if (lines.length <= maxLines) {
      return content;
    }

    return lines.slice(0, maxLines).join("\n") + "\n...";
  };

  const renderContent = (content, expanded, i) => {
    if (!content) return null;

    const lines = content.split("\n");
    const truncatedContent = truncateContent(content, 3);

    if (expanded[i] || lines.length <= 3) {
      return lines.map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
    } else {
      return truncatedContent.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
    }
  };

  const handleLike = async (community_id) => {
    try {
      const response = await axios.post(`http://43.202.98.45:8089/community/like?communityId=${community_id}`);
      if (response.status === 200) {
        fetchCommunityData();
        saveCommunityDataToLocalStorage();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handlePostEdit = async (editedPost) => {};

  const handleDeletePost = async (community_id) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    try {
      await axios.delete(`http://43.202.98.45:8089/community/delete?communityId=${community_id}`, { headers });
      setCommunityData((prevData) => prevData.filter((post) => post.communityId !== community_id));
      saveCommunityDataToLocalStorage();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="communityCenter">
      <div className="communitySection">
        {console.log(filteredData)}
        {filteredData.map((post, i) => (
          <div key={post.communityId} className="communityCard">
            <div className="userSection">
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div>
                  <img className="communitymprofile" src={post.member.mOriginalFileName} alt="프로필" />
                </div>
                <div>
                  <div style={{ alignItems: "center", display: "flex", gap: "4px" }}>
                    <div style={{ fontWeight: "700" }}>{post.member.name}</div>
                    <span>({post.member.email})</span>
                  </div>

                  <div className="postcdate">
                    <span>{post.cDate}</span>
                  </div>
                </div>
                {userEmail === post.member.email && (
                  <div className="cpostedit">
                    <button className="cposteditupdate" onClick={() => toggleEditModal(post)}>
                      수정
                    </button>
                    <button className="cposteditdelete" onClick={() => handleDeletePost(post.communityId)}>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="cardContentsComponents">
              <div className="cardContentsComponents_Title">
                <span className="contentpostCategory">{post.cType}</span>
                <h3>{post.cTitle}</h3>
              </div>

              <div>
                <div className={`cardContentsComponents_TextArea ${expanded[i] ? "expanded" : ""}`}>
                  <p style={{ lineHeight: 1.6 }}>{post && post.cContents ? renderContent(post.cContents, expanded, i) : null}</p>
                </div>

                {post.cContents && post.cContents.split("\n").length > 3 && (
                  <div className="cardContentsComponents_morebutton">
                    <span className="moreButton" onClick={() => toggleExpanded(i)}>
                      {expanded[i] ? "닫기" : "펼치기"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="cardContentsComponents_bottom">
                <div
                  className="heart_img "
                  style={{ display: "flex", gap: "10px", alignItems: "center", color: "#B2B2B2", fontSize: "13px" }}
                  onClick={() => handleLike(post.communityId)}
                >
                  <div onClick={handleChangeLike}>
                    {/*{post.isLike ? <img src={Heart} alt="하트" /> : <img src={Noheart} alt="빈하트" />}*/}
                    {post.isLike ? <img src={Heart} alt="하트" /> : <img src={Noheart} alt="빈하트" />}
                  </div>
                  <div>
                    <span>{post.cLike}</span>
                  </div>
                </div>

                <span className="ment" onClick={() => toggleCommentModal(i)}>
                  {showComments[i] ? "댓글 닫기" : `댓글 ${post.cComment}`}
                  {/* {showComments[i] ? "댓글 닫기" : "댓글"} */}
                </span>
              </div>
              {commentModalOpen[i] && (
                <>
                  <div className="commentContainer">
                    <CommunityComment communityId={post.communityId} open={commentModalOpen[i]} />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="jacksung">
        <div>
          <button className="writeButton" onClick={togglePostModal}>
            글작성하기
          </button>

          <div className="ccategory">
            <div>
              <div className="ccategoryimg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5 6.5C5 5.94772 4.55228 5.5 4 5.5C3.44772 5.5 3 5.94772 3 6.5C3 7.05228 3.44772 7.5 4 7.5C4.55228 7.5 5 7.05228 5 6.5ZM21 6.5C21 5.94772 20.5523 5.5 20 5.5H8C7.44772 5.5 7 5.94772 7 6.5C7 7.05228 7.44772 7.5 8 7.5H20C20.5523 7.5 21 7.05228 21 6.5ZM21 12.5C21 11.9477 20.5523 11.5 20 11.5H8C7.44772 11.5 7 11.9477 7 12.5C7 13.0523 7.44772 13.5 8 13.5H20C20.5523 13.5 21 13.0523 21 12.5ZM7 18.5C7 17.9477 7.44772 17.5 8 17.5H20C20.5523 17.5 21 17.9477 21 18.5C21 19.0523 20.5523 19.5 20 19.5H8C7.44772 19.5 7 19.0523 7 18.5ZM3 12.5C3 11.9477 3.44772 11.5 4 11.5C4.55228 11.5 5 11.9477 5 12.5C5 13.0523 4.55228 13.5 4 13.5C3.44772 13.5 3 13.0523 3 12.5ZM5 18.5C5 17.9477 4.55228 17.5 4 17.5C3.44772 17.5 3 17.9477 3 18.5C3 19.0523 3.44772 19.5 4 19.5C4.55228 19.5 5 19.0523 5 18.5Z"
                    fill="#94A3B8"
                  />
                </svg>{" "}
                <span
                  style={{ fontSize: 24 }}
                  onClick={() => handleCategoryClick("전체")}
                  className={selectedCategory === "전체" ? "active" : ""}
                >
                  전체
                </span>
              </div>
            </div>
            <div className="ccategoryimg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.87868 3.37868C3.44129 2.81607 4.20435 2.5 5 2.5H19C19.7957 2.5 20.5587 2.81607 21.1213 3.37868C21.6839 3.94129 22 4.70435 22 5.5V15.5C22 16.2957 21.6839 17.0587 21.1213 17.6213C20.5587 18.1839 19.7957 18.5 19 18.5H15.5308L15.903 19.9888L16.7071 20.7929C16.9931 21.0789 17.0787 21.509 16.9239 21.8827C16.7691 22.2564 16.4045 22.5 16 22.5H8C7.59554 22.5 7.2309 22.2564 7.07612 21.8827C6.92134 21.509 7.0069 21.0789 7.29289 20.7929L8.09704 19.9888L8.46922 18.5H5C4.20435 18.5 3.44129 18.1839 2.87868 17.6213C2.31607 17.0587 2 16.2956 2 15.5V5.5C2 4.70435 2.31607 3.94129 2.87868 3.37868ZM4 14.5V15.5C4 15.7652 4.10536 16.0196 4.29289 16.2071C4.48043 16.3946 4.73478 16.5 5 16.5H19C19.2652 16.5 19.5196 16.3946 19.7071 16.2071C19.8946 16.0196 20 15.7652 20 15.5V14.5H4ZM20 12.5H4V5.5C4 5.23478 4.10536 4.98043 4.29289 4.79289C4.48043 4.60536 4.73478 4.5 5 4.5H19C19.2652 4.5 19.5196 4.60536 19.7071 4.79289C19.8946 4.98043 20 5.23478 20 5.5V12.5ZM10.5308 18.5L10.0308 20.5H13.9692L13.4692 18.5H10.5308Z"
                  fill="#CBD5E1"
                />
              </svg>
              <span onClick={() => handleCategoryClick("기술 질문")} className={selectedCategory === "기술 질문" ? "active" : ""}>
                기술 질문
              </span>
            </div>
            <div className="ccategoryimg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  d="M9 11.5C8.44772 11.5 8 11.9477 8 12.5C8 13.0523 8.44772 13.5 9 13.5H9.01C9.56228 13.5 10.01 13.0523 10.01 12.5C10.01 11.9477 9.56228 11.5 9.01 11.5H9Z"
                  fill="#CBD5E1"
                />
                <path
                  d="M12 11.5C11.4477 11.5 11 11.9477 11 12.5C11 13.0523 11.4477 13.5 12 13.5H15C15.5523 13.5 16 13.0523 16 12.5C16 11.9477 15.5523 11.5 15 11.5H12Z"
                  fill="#CBD5E1"
                />
                <path
                  d="M9 15.5C8.44772 15.5 8 15.9477 8 16.5C8 17.0523 8.44772 17.5 9 17.5H9.01C9.56228 17.5 10.01 17.0523 10.01 16.5C10.01 15.9477 9.56228 15.5 9.01 15.5H9Z"
                  fill="#CBD5E1"
                />
                <path
                  d="M12 15.5C11.4477 15.5 11 15.9477 11 16.5C11 17.0523 11.4477 17.5 12 17.5H15C15.5523 17.5 16 17.0523 16 16.5C16 15.9477 15.5523 15.5 15 15.5H12Z"
                  fill="#CBD5E1"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 2.5C10.2044 2.5 9.44129 2.81607 8.87868 3.37868C8.55928 3.69808 8.31933 4.0821 8.17157 4.5H7C6.20435 4.5 5.44129 4.81607 4.87868 5.37868C4.31607 5.94129 4 6.70435 4 7.5V19.5C4 20.2957 4.31607 21.0587 4.87868 21.6213C5.44129 22.1839 6.20435 22.5 7 22.5H17C17.7957 22.5 18.5587 22.1839 19.1213 21.6213C19.6839 21.0587 20 20.2957 20 19.5V7.5C20 6.70435 19.6839 5.94129 19.1213 5.37868C18.5587 4.81607 17.7956 4.5 17 4.5H15.8284C15.6807 4.0821 15.4407 3.69808 15.1213 3.37868C14.5587 2.81607 13.7956 2.5 13 2.5H11ZM10.2929 4.79289C10.4804 4.60536 10.7348 4.5 11 4.5H13C13.2652 4.5 13.5196 4.60536 13.7071 4.79289C13.8946 4.98043 14 5.23478 14 5.5C14 5.76522 13.8946 6.01957 13.7071 6.20711C13.5196 6.39464 13.2652 6.5 13 6.5H11C10.7348 6.5 10.4804 6.39464 10.2929 6.20711C10.1054 6.01957 10 5.76522 10 5.5C10 5.23478 10.1054 4.98043 10.2929 4.79289ZM7 6.5H8.17157C8.31933 6.9179 8.55928 7.30192 8.87868 7.62132C9.44129 8.18393 10.2044 8.5 11 8.5H13C13.7956 8.5 14.5587 8.18393 15.1213 7.62132C15.4407 7.30192 15.6807 6.9179 15.8284 6.5H17C17.2652 6.5 17.5196 6.60536 17.7071 6.79289C17.8946 6.98043 18 7.23478 18 7.5V19.5C18 19.7652 17.8946 20.0196 17.7071 20.2071C17.5196 20.3946 17.2652 20.5 17 20.5H7C6.73478 20.5 6.48043 20.3946 6.29289 20.2071C6.10536 20.0196 6 19.7652 6 19.5V7.5C6 7.23478 6.10536 6.98043 6.29289 6.79289C6.48043 6.60536 6.73478 6.5 7 6.5Z"
                  fill="#CBD5E1"
                />
              </svg>
              <span onClick={() => handleCategoryClick("취업 고민")} className={selectedCategory === "취업 고민" ? "active" : ""}>
                취업 고민
              </span>
            </div>
            <div className="ccategoryimg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.3362 2.55826C13.7343 2.70035 14 3.07738 14 3.50005V9.50005H20C20.3864 9.50005 20.7382 9.72265 20.9037 10.0718C21.0691 10.421 21.0186 10.8342 20.774 11.1333L11.774 22.1333C11.5063 22.4604 11.0619 22.5839 10.6638 22.4418C10.2658 22.2998 10 21.9227 10 21.5001V15.5001H4.00001C3.61362 15.5001 3.2618 15.2775 3.09634 14.9283C2.93088 14.5791 2.98138 14.1659 3.22605 13.8668L12.2261 2.86682C12.4937 2.53969 12.9381 2.41616 13.3362 2.55826ZM6.11025 13.5001H11C11.5523 13.5001 12 13.9478 12 14.5001V18.6986L17.8898 11.5001H13C12.4477 11.5001 12 11.0523 12 10.5001V6.30146L6.11025 13.5001Z"
                  fill="#CBD5E1"
                />
              </svg>
              <span onClick={() => handleCategoryClick("기타")} className={selectedCategory === "기타" ? "active" : ""}>
                기타
              </span>
            </div>
          </div>
        </div>
      </div>

      {postModalOpen && <PostModal onPostSubmit={handlePostSubmit} onCancel={togglePostModal} />}
      {editModalOpen && <PostModal onPostSubmit={handlePostEdit} onCancel={toggleEditModal} post={editPost} />}
    </div>
  );
}

export default Card;

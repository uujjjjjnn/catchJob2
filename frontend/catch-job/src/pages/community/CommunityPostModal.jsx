import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectEmail } from "../../redux/login";

function PostModal({ onPostSubmit, onCancel, post }) {
  const [loading, setLoading] = useState(false);
  // const [postTitle, setPostTitle] = useState("");
  // const [postContent, setPostContent] = useState("");
  // const [postCategory, setPostCategory] = useState("");
  const [postTitle, setPostTitle] = useState(post ? post.cTitle : "");
  const [postContent, setPostContent] = useState(post ? post.cContents : "");
  const [postCategory, setPostCategory] = useState(post ? post.cType : "");

  const userEmail = useSelector(selectEmail);

  //  useEffect(() => {
  //    console.log("postTitle:", postTitle);
  //    console.log("postContent:", postContent);
  //    console.log("postCategory:", postCategory);
  //  }, [postTitle, postContent, postCategory]);

  const handlePostTitleChange = (event) => {
    setPostTitle(event.target.value);
  };

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handlePostCategoryChange = (event) => {
    setPostCategory(event.target.value);
  };

  const handleSave = async (communityId) => {
    setLoading(true);
    if (postTitle.trim() === "" || postContent.trim() === "" || postCategory === "") {
      alert("모든 필드를 입력해주세요.");
      setLoading(false);
      return;
    }

    // const newPost = {
    //   cContents: postContent,
    //   cTitle: postTitle,
    //   cType: postCategory,
    //   email: userEmail,
    // };
    const editedPost = {
      cContents: postContent,
      cTitle: postTitle,
      cType: postCategory,
      email: userEmail,
    };

    //   try {
    //     const response = await axios.post("http://43.202.98.45:8089/community", newPost);
    //     // const response = await axios.post("http://localhost:8089/community", newPost);
    //     setLoading(false);

    //     setPostCategory("");
    //     setPostTitle("");
    //     setPostContent("");
    //     onCancel();
    //     window.location.reload();
    //   } catch (error) {
    //     setLoading(false);
    //     console.error("Error submitting post:", error);
    //   }
    // };
    try {
      if (post) {
        // Editing an existing post
        const response = await axios.put(`http://43.202.98.45:8089/community/edit?communityId=${post.communityId}`, editedPost);
        if (response.status === 200) {
          // Update the post data in the parent component's state or other logic as needed
          onPostSubmit(editedPost);
          setLoading(false);
          onCancel();
          window.location.reload();
        }
      } else {
        // Creating a new post
        const response = await axios.post("http://43.202.98.45:8089/community", editedPost);
        if (response.status === 200) {
          setLoading(false);
          setPostCategory("");
          setPostTitle("");
          setPostContent("");
          onCancel();
          window.location.reload();
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting post:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="overlay">
      <div className="postmodal">
        <div className="catchJobletter">
          catch<span className="red-letter">J</span>ob
        </div>
        <div>
          <select className="postcategory" value={postCategory} onChange={handlePostCategoryChange}>
            <option selected disabled hidden value="">
              카테고리
            </option>
            <option value="기술 질문">기술 질문</option>
            <option value="취업 고민">취업 고민</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="postTitle">
          <input placeholder="제목" type="text" className="postTitleform" value={postTitle} onChange={handlePostTitleChange} />
        </div>
        <textarea className="postText" value={postContent} onChange={handlePostContentChange} />
        <div className="postButton">
          <button className="postButton1" onClick={handleCancel}>
            취소
          </button>
          {/* <button className="postButton2" onClick={handleSave}>
            등록
          </button> */}
          <button className="postButton2" onClick={handleSave}>
            {post ? "수정" : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostModal;

import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // 테마 스타일 가져오기
import styles from "../assets/css/BuildPortfolio.module.css";
import DetailModal from "../components/DetailModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ImageResize from "quill-image-resize";
Quill.register({
  "modules/ImageResize": ImageResize,
});
const BuildPortfolioPage = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bCoverFileName, setBCoverFileName] = useState("");
  const [tags, setTags] = useState([]);
  const [prevCover, setPrevCover] = useState("");
  const [prevTags, setPrevTags] = useState([]);
  const [prevCoverURL, setPrevCoverURL] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const boardId = location.state?.boardId || "";

  useEffect(() => {
    const ifHaveId = async () => {
      try {
        const response = await axios.get(`http://43.202.98.45:8089/${boardId}`); // 수정 엔드포인트에 맞춰서 쓰기

        setTitle(response.data.bTitle);
        setValue(response.data.bContents);
        setUploadedFile(new File([], response.data.bFileName));
        setPrevCoverURL(response.data.bCoverFileName);
        setPrevTags(response.data.tags);
        setPrevCover(response.data.bCoverFileName);

        console.log(response.data.bTitle);
        console.log(response.data.bContents);
        console.log(response.data.bFileName);
        console.log(response.data.bCoverFileName);
        console.log(response.data.tags);
        console.log("-------");
      } catch (error) {
        console.log(error);
      }
    };

    if (boardId === "") {
      return;
    } else {
      ifHaveId();
    }
  }, [boardId]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleChange = (content) => {
    setValue(content);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleDetailSave = (cover, coverURL, tags) => {
    setBCoverFileName(cover);
    setTags(tags);
    setPrevCover(cover);
    setPrevTags(tags);
    setPrevCoverURL(coverURL);
  };

  const handleSaveContent = async () => {
    const token = localStorage.getItem("token");

    if (!bCoverFileName) {
      alert("게시물을 저장하려면 커버 사진을 올려주세요.");
      return;
    }

    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const bContents = value
      .replace(/<p>/g, "<br>")
      .replace(/<\/p>/g, "<br>")
      .replace(/<img/g, "<p><br><img")
      .replace(/<\/img>/g, "</img></p></br>")
      .replace(/<\/p>\s*<p>/g, "<br>")
      .replace(/<img[^>]+?>/g, "<br>$&<br>");

    const formData = new FormData();
    formData.append("bTitle", title);
    formData.append("bContents", bContents);
    formData.append("tags", JSON.stringify(tags));
    formData.append("bFileName", uploadedFile);
    formData.append("bCoverFileName", bCoverFileName);

    try {
      if (!boardId) {
        const response = await axios.post("http://43.202.98.45:8089/buildportfolio", formData, axiosConfig);
        console.log(response.data);
        console.log("새로운 게시글 작성 성공");
      } else {
        const response = await axios.post(`http://43.202.98.45:8089/portfolio/edit/${boardId}`, formData, axiosConfig);
        console.log(response.data);
        console.log("게시글 수정 성공");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    navigate("/");
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["image"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ],
    ImageResize: {
      parchment: Quill.import("parchment"),
    },
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <div className={`${styles.wrapper}`}>
        <input
          type="text"
          tabIndex="1"
          name="email"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요"
          className={`${styles.realEditorTitle}`}
        ></input>
        <div className={`${styles.realEditor}`} tabIndex="2" style={{ width: "1200px", height: "800px" }}>
          <style>{`.ql-container.ql-snow .ql-editor {font-size: 16px;}`}</style>
          <ReactQuill value={value} onChange={handleChange} modules={modules} theme="snow" className={`${styles.customQuillEditor}`} />
        </div>
        <div className={`${styles.fileName}`}>
  {uploadedFile && uploadedFile.name !== "http://43.202.98.45:8089/upload/null" && (
    <>
      <span>{uploadedFile.name.split("/").pop()}</span>
      <span className={`${styles.removeBtn}`} onClick={() => setUploadedFile("")}>
        X
      </span>
    </>
  )}
</div>

      </div>
      <div className={`${styles.addThings}`}>
        <input type="file" id="fileUpload" style={{ display: "none" }} onChange={handleFileUpload} />
        <button className={`${styles.addButtons}`} onClick={() => document.getElementById("fileUpload").click()}>
          파일 업로드
        </button>
        <button to={"/detail"} className={`${styles.addButtons}`} onClick={() => setShowModal(true)}>
          세부 사항 설정
        </button>
        <button className={`${styles.saveContent}`} onClick={handleSaveContent}>
          저<span style={{ marginLeft: "20px" }}></span>장
        </button>
      </div>
      {showModal && (
        <DetailModal
          setShowModal={setShowModal}
          onSave={handleDetailSave}
          prevCover={prevCover}
          prevCoverURL={prevCoverURL}
          prevTags={prevTags}
        />
      )}
    </>
  );
};

export default BuildPortfolioPage;

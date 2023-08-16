import axios from "axios";
import React, { useRef, useState } from "react";
import styles from "../../assets/css/study/StudyModal.module.css";
import { useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);
const StudyModal = ({ isOpen, onClose, applyType, modalType, data }) => {
  const [expanded, setExpanded] = useState([]);
  const modalRef = useRef(null);
  const applyRef = useRef();
  const query = useQuery();
  const id = query.get("id");

  const toggleExpanded = (index, event) => {
    event.stopPropagation();
    console.log("click");
    if (expanded.includes(index)) {
      setExpanded(expanded.filter((i) => i !== index));
    } else {
      setExpanded([...expanded, index]);
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && modalRef.current.contains(e.target)) {
      return;
    }
    onClose();
  };
  const handleSubmit = async () => {
    let applyData = {
      projectReason: applyRef.current.value,
    };
    try {
      const response = await axios.post(`http://43.202.98.45:8089/studyDetail/apply/${id}?job=${applyType}`, applyData);
      if (response.status === 200) {
        alert("신청되었습니다.");
        onClose();
      } else {
        alert("오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("에러 발생", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={handleClickOutside}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalContentWrapper}>
          <h2 className={styles.modalHeader}>
            catch<span style={{ color: "#e2432e" }}>J</span>ob
          </h2>
          {modalType === "participant" && (
            <>
              <h3>프로젝트 지원하기 ({applyType})</h3>
              <textarea
                name=""
                id=""
                cols="70"
                rows="10"
                placeholder="지원 사유를 입력하세요. (최대 150자까지 작성 가능)"
                maxLength={150}
                className={styles.modalTextArea}
                ref={applyRef}
              ></textarea>
              <div className={styles.modalBtnWrapper}>
                <button onClick={onClose}>취소</button>
                <button onClick={handleSubmit}>지원</button>
              </div>
            </>
          )}
          {modalType === "writer" && (
            <>
              <h3>{applyType}</h3>
              <div className={styles.applyListWrapper}>
                {console.log(data.filter((x) => x.projectJob === applyType))}
                {data &&
                  data
                    .filter((x) => x.projectJob === applyType)
                    .map((x, i) => {
                      const isExpanded = expanded.includes(i);
                      return (
                        <div className={styles.applyList} key={i}>
                          <div className={styles.applyLeft}>
                            <div className={styles.applyName}>지원자: {x.memberName}</div>
                            <div className={styles.applyEmail}>이메일: {x.memberEmail}</div>
                          </div>
                          <div className={styles.reasonWrapper}>
                            <p className={`${styles.applyReason} ${isExpanded ? styles.applyReasonExpanded : ""}`}>{x.projectReason}</p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyModal;

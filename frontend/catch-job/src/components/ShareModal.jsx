import React, { useRef } from 'react';
import styles from "../assets/css/ShareModal.module.css";

const ShareModal = ({ item,onClose, modalUrl }) => {

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(modalUrl);
      alert("URL이 복사되었습니다.");
    } catch (err) {
      console.error("URL을 복사하는데 실패했습니다.", err);
    }
  }

  if (!item) {
    return null;
  }

  return (
    <div className={`${styles.modalBackdrop}`}>
      <div className={`${styles.modalContent}`}>
        <button className={`${styles.closeButton}`} onClick={onClose}>x</button>
        <h1 className={`${styles.catch}`}>
            catch<span className={`${styles.catchJ}`}>J</span>ob
        </h1>
        <div className={`${styles.title}`}>프로젝트 공유하기</div>
        <div className={`${styles.contentInfo}`}>
          <img className={`${styles.shareTitleImg}`} src={item.bCoverFileName} alt="img" />
          <div className={`${styles.contentUser}`}>
            <div className={`${styles.shareTitleName}`}>{item.bTitle}</div>
          </div>
        </div>
        <div className={`${styles.shareLinkBox}`}>
          <div className={`${styles.shareLink}`}>{modalUrl}
            <button className={`${styles.shareLinkButton}`} onClick={handleCopyURL}>URL 복사</button>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default ShareModal;
import React, { useState } from "react";

import styles from "../../";

const BuildStudyType = () => {
  const [selectedField, setSelectedField] = useState(null);

  const handleFieldChange = (option) => {
    setSelectedField(option);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>프로젝트 분야</div>
      <ul className={styles.items}>
        <li>
          <input
            type="radio"
            name="field"
            id="fashion"
            value="패션"
            checked={selectedField === "패션"}
            onChange={() => handleFieldChange("패션")}
            className={styles.radioBtn}
          />
          <label className={styles.fieldSelect} htmlFor="fashion">
            <div className={`${styles.select} ${selectedField === "패션" && styles.active} `}>패션</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="field"
            id="financial"
            value="금융"
            checked={selectedField === "금융"}
            onChange={() => handleFieldChange("금융")}
            className={styles.radioBtn}
          />
          <label className={styles.fieldSelect} htmlFor="financial">
            <div className={`${styles.select} ${selectedField === "금융" && styles.active} `}>금융</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="field"
            id="sports"
            value="스포츠"
            checked={selectedField === "스포츠"}
            onChange={() => handleFieldChange("스포츠")}
            className={styles.radioBtn}
          />
          <label className={styles.fieldSelect} htmlFor="sports">
            <div className={`${styles.select} ${selectedField === "스포츠" && styles.active} `}>스포츠</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="field"
            id="travel"
            value="여행"
            checked={selectedField === "여행"}
            onChange={() => handleFieldChange("여행")}
            className={styles.radioBtn}
          />
          <label className={styles.fieldSelect} htmlFor="travel">
            <div className={`${styles.select} ${selectedField === "여행" && styles.active} `}>여행</div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            name="field"
            id="others"
            value="기타"
            checked={selectedField === "기타"}
            onChange={() => handleFieldChange("기타")}
            className={styles.radioBtn}
          />
          <label className={styles.fieldSelect} htmlFor="others">
            <div className={`${styles.select} ${selectedField === "기타" && styles.active} `}>기타</div>
          </label>
        </li>
      </ul>
    </div>
  );
};

export default BuildStudyType;

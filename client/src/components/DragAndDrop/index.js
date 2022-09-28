import { Text } from "@nextui-org/react";
import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.css";

function FileDragAndDrop({ onUpload, children, count, formats }) {
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState({
    show: false,
    text: null,
    type: null,
  });
  const drop = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);

    return () => {
      drop.current.removeEventListener("dragover", handleDragOver);
      drop.current.removeEventListener("drop", handleDrop);
      drop.current.removeEventListener("dragenter", handleDragEnter);
      drop.current.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragging(false);

    const files = [...e.dataTransfer.files];

    // Check file limit
    if (count && count < files.length) {
      showMessage(
        `You can only upload ${count} file${count !== 1 ? "s" : ""} at a time`,
        "error",
        2000
      );
      return;
    }

    // Check if uploaded file is not allowed
    if (
      formats &&
      files.some(
        (file) =>
          !formats.some((format) =>
            file.name.toLowerCase().endsWith(format.toLowerCase())
          )
      )
    ) {
      showMessage(
        `Only following file formats are acceptable: ${formats.join(", ")}`,
        "error",
        2000
      );
      return;
    }

    if (files && files.length) {
      showMessage(
        `Files uploaded!`,
        "success",
        1000
      );
      onUpload(files);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target !== drag.current) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  const showMessage = (text, type, timeout) => {
    setMessage({ show: true, text, type });

    setTimeout(
      () => setMessage({ show: false, text: null, type: null }),
      timeout
    );
  };

  return (
    <div ref={drop} className="FilesDaD__area">
      {message.show && (
        <div
          className={classNames(
            "FilesDaD__placeholder",
            `FilesDaD__placeholder--${message.type}`
          )}
        >
          <Text color={message.type}>{message.text}</Text>
        </div>
      )}
      {dragging && <div ref={drag} className="FilesDaD__placeholder"></div>}
      {children}
    </div>
  );
}

FileDragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
  children: PropTypes.any,
  count: PropTypes.number,
  format: PropTypes.arrayOf(PropTypes.string),
};

export default FileDragAndDrop;

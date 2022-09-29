import { Text } from "@nextui-org/react";
import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.css";

function Image({ src, width, height, style, alt, isNSFW, isFiltered }) {
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="ImageContainer">
      {isNSFW ? (
        <Text
          color="error"
          size={20}
          weight="bold"
          style={{
            position: "absolute",
            left: 20,
            top: 10,
            zIndex: "9999",
          }}
        >
          R-18
        </Text>
      ) : null}
      <img
        className={`${isFiltered ? "Image__nsfw" : "Image__image"}`}
        src={src}
        width={width}
        height={height}
        alt={alt}
        style={style}
      />
    </div>
  );
}

Image.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  isNSFW: PropTypes.bool,
  isFiltered: PropTypes.bool,
};

export default Image;

import React, { useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import "./Gallery.css";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function Gallery() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [files, SetFiles] = useState([]);

  useEffect(() => {
    if (searchParams.getAll("tags").length > 0) {
      const params = [];

      for (let entry of searchParams.entries()) {
        params.push(entry);
      }

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/images?tags=${params[0][1]}`)
        .then((res) => {
          SetFiles(res.data);
        })
        .catch((err) => {
          console.log("ERR", err);
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/images`)
        .then((res) => {
          SetFiles(res.data);
        })
        .catch((err) => {
          console.log("ERR", err);
        });
    }

    return () => {};
  }, []);

  return (
    <div className="Gallery">
      {files.map((file) => {
        return (
          <Link to={`/post/${file._id}`} key={file._id}>
            <Image
              width={300}
              height={300}
              src={`${process.env.REACT_APP_BACKEND_URL}/${file.name}`}
              alt={file.name}
              showSkeleton
              objectFit="scale-down"
              style={{margin: "10px"}}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default Gallery;

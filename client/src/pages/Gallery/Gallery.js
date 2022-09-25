import React, { useState, useEffect } from "react";
import { Button, Text, Input, Image } from "@nextui-org/react";
import { SendButton } from "../../components/SendButton";
import { SendIcon } from "../../components/SendIcon";
import "./Gallery.css";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function Gallery({ Component }) {
  let [searchParams, setSearchParams] = useSearchParams();
  const [files, SetFiles] = useState([]);

  useEffect(() => {
    if (searchParams.getAll("tags").length > 0) {
      const params = [];

      for (let entry of searchParams.entries()) {
        params.push(entry);
      }

      axios
        .get(`http://localhost:5000/images?tags=${params[0][1]}`)
        .then((res) => {
          SetFiles(res.data);
        })
        .catch((err) => {
          console.log("ERR", err);
        });
    } else {
      axios
        .get("http://localhost:5000/images")
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
              width={320}
              height={180}
              src={`http://localhost:5000/${file.name}`}
              alt={file.name}
              showSkeleton
              objectFit="scale-down"
            />
          </Link>
        );
      })}
    </div>
  );
}

export default Gallery;

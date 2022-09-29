import React, { useState, useEffect } from "react";
import Image from "../../components/Image";
import "./Gallery.css";
import axios from "../../utils/axios.config";
import { Link, useSearchParams } from "react-router-dom";

function Gallery() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [files, SetFiles] = useState([]);

  useEffect(() => {
    const tagParams = [];
    const artistParams = [];
    let urlStr = "/images";

    if (searchParams.getAll("artists").length > 0) {
      for (let entry of searchParams.entries()) {
        artistParams.push(entry);
      }
    } 
    if (searchParams.getAll("tags").length > 0) {
      for (let entry of searchParams.entries()) {
        tagParams.push(entry);
      }
    }

    if (tagParams.length > 0 && artistParams.length > 0) {
      urlStr = `/images?tags=${tagParams[0][1]}&artists=${artistParams[0[1]]}`
    } else if (tagParams.length > 0 && artistParams.length <= 0) {
      urlStr = `/images?tags=${tagParams[0][1]}`
    } else if (tagParams.length <= 0 && artistParams.length > 0) {
      urlStr = `/images?artists=${artistParams[0][1]}`
    }

    axios
        .get(urlStr)
        .then((res) => {
          SetFiles(res.data);
        })
        .catch((err) => {
          console.error(err);
        });

    return () => {};
  }, [searchParams]);

  return (
    <div className="Gallery">
      {files.map((file) => {
        return (
          <Link to={`/post/${file._id}`} key={file._id}>
            <Image
              width={250}
              height={250}
              src={`${process.env.REACT_APP_BACKEND_URL}/${file.name}`}
              alt={file.name}
              style={{
                margin: "10px",
                objectFit: "cover",
                borderRadius: "20px",
              }}
              isNSFW={file.nsfw}
              isFiltered={file.nsfw}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default Gallery;

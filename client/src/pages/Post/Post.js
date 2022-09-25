import React, { useState, useEffect } from "react";
import { Text, Image } from "@nextui-org/react";
import "./Post.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Post() {
  const params = useParams();
  const [files, SetFiles] = useState([]);
  const [isFullSize, SetIsFullSize] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/post?post_id=${params.post_id}`)
      .then((res) => {
        console.log(res.data);
        SetFiles(res.data);
        SetIsFullSize(false);
      })
      .catch((err) => {
        console.log("ERR", err);
      });

    return () => {};
  }, []);

  return (
    <div className="Post">
      <div style={{width: 200, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <Text h2>Tags</Text>
        <div style={{display: "flex", flexDirection: "column"}}>
        {
          files[0] ? files[0].tags.map((tag, index) => {
            return (<Link to={`/gallery?tags=${tag}`}><Text key={index}>{tag}</Text></Link>)
          }) : (<div></div>)
        }
        </div>
      </div>
      {files.map((file) => (
        <Image
          // style={{border: "2px solid red"}}
          width={file.width}
          height={file.height}
          key={file._id}
          src={`${process.env.REACT_APP_BACKEND_URL}/${file.name}`}
          alt={file.name}
          showSkeleton
          onClick={() => SetIsFullSize(!isFullSize)}
        />
      ))}
    </div>
  );
}

export default Post;

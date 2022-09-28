import React, { useState, useEffect } from "react";
import { Text, Image } from "@nextui-org/react";
import "./Post.css";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Post() {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);
  const [isFullSize, setIsFullSize] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/post?post_id=${params.post_id}`
      )
      .then((res) => {
        setFiles(res.data.post);
        setTags(res.data.tags);
        setArtists(res.data.artists);
        setIsFullSize(false);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {};
  }, []);

  return (
    <div className="Post">
      <div
        style={{
          width: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: 30,
          paddingTop: 20,
        }}
      >
        <Text h2>Artists</Text>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {artists.length > 0 ? (
            artists.map((artist, index) => {
              return (
                <Link
                  to={`/gallery?artists=${artist.name}`}
                  style={{ display: "flex" }}
                  key={index}
                >
                  <Text style={{ marginRight: "10px" }}>{artist.name}</Text>
                  <Text color="primary">{artist.count}</Text>
                </Link>
              );
            })
          ) : (
            <div></div>
          )}
        </div>
        <Text h2>Tags</Text>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {tags.length > 0 ? (
            tags.map((tag, index) => {
              return (
                <Link
                  to={`/gallery?tags=${tag.name}`}
                  style={{ display: "flex" }}
                  key={index}
                >
                  <Text style={{ marginRight: "10px" }}>{tag.name}</Text>
                  <Text color="primary">{tag.count}</Text>
                </Link>
              );
            })
          ) : (
            <div></div>
          )}
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
          onClick={() => setIsFullSize(!isFullSize)}
          style={{ marginTop: "20px" }}
        />
      ))}
    </div>
  );
}

export default Post;

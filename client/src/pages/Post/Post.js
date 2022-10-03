import React, { useState, useEffect } from "react";
import { Text, Badge } from "@nextui-org/react";
import Image from "../../components/Image";
import "./Post.css";
import axios from "../../utils/axios.config";
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
        `/posts?post_id=${params.post_id}`
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

  const randomColor = () => {
    const colors = ["default", "primary", "secondary", "success", "warning", "error"]
    const index = Math.floor(Math.random() * colors.length);
    return `${colors[index]}`;
  }

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
                  <Badge variant="flat" disableOutline color={randomColor()} style={{marginBottom: "10px"}}>
                    {artist.name} *{artist.count}
                  </Badge>
                  {/* <Text style={{ marginRight: "10px" }}>{artist.name}</Text>
                  <Text color="primary">{artist.count}</Text> */}
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
                  <Badge variant="flat"  disableOutline color={randomColor()} style={{marginBottom: "10px"}}>
                    {tag.name} *{tag.count}
                  </Badge>
                  {/* <Text style={{ marginRight: "10px" }}>{tag.name}</Text>
                  <Text color="primary">{tag.count}</Text> */}
                </Link>
              );
            })
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {files.map((file) => (
        <div key={file._id} style={{marginTop: "20px", paddingLeft: 20, display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
          <Text size="$sm">
            Image at reduced size. <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BACKEND_URL}/${file.name}` }>View Original</a>
          </Text>
          <Image
            src={`${process.env.REACT_APP_BACKEND_URL}/${file.name}`}
            noHover
            style={{ padding: "0 20px" }}
          />
        </div>
      ))}
    </div>
  );
}

export default Post;

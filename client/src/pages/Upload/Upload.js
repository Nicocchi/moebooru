import React, { useState } from "react";
import { Button, Text, Input } from "@nextui-org/react";
import { SendButton } from "../../components/SendButton";
import { SendIcon } from "../../components/SendIcon";
import "./Upload.css";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState([]);
  const [source, setSource] = useState([]);
  const changeHandler = (ev) => {
    if (!ev.target.files[0]) return;
    setSelectedFile(ev.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("tags", tags);
    formData.append("author", author);
    formData.append("source", source);
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}`, formData, options)
      .then((res) => {
        setSelectedFile(null);
        setIsFilePicked(false);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const handleTags = (ev) => {
    if (ev.key === "Enter") {
      let tgs = tags.map((tag) => tag);
      tgs.push(ev.target.value);
      setTags(tgs);
    }
  };

  const handleAuthor = (ev) => {
    if (ev.key === "Enter") {
      setAuthor(ev.target.value);
    }
  };

  const handleSrc = (ev) => {
    if (ev.key === "Enter") {
      setSource(ev.target.value);
    }
  };

  return (
    <div className="Home">
      <Text h1>Upload</Text>
      <Input
        color="primary"
        type="file"
        name="file"
        aria-label="image upload"
        contentRightStyling={false}
        placeholder="Upload image"
        onChange={changeHandler}
        contentRight={
          <Button disabled={!isFilePicked} onPress={handleSubmission}>
            <SendIcon disabled={!isFilePicked} />
          </Button>
        }
      />
      <div>
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
            <p>
              lastModifiedDate:{" "}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </p>
            <Input placeholder="Tags" onKeyDown={handleTags} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <Text style={{ marginRight: "10px" }}>{tag}</Text>
              ))}
            </div>
            <Input placeholder="Author" onKeyDown={handleAuthor} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {<Text style={{ marginRight: "10px" }}>{author}</Text>}
            </div>
            <Input placeholder="Source" onKeyDown={handleSrc} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {<Text style={{ marginRight: "10px" }}>{source}</Text>}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Home;

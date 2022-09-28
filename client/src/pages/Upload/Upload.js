import React, { useState } from "react";
import { Button, Text, Input, Image, Switch, Tooltip } from "@nextui-org/react";
import { SendButton } from "../../components/SendButton";
import { SendIcon } from "../../components/SendIcon";
import FileDragAndDrop from "../../components/DragAndDrop";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, OnChangeValue } from "react-select";

import "./Upload.css";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);
  const [source, setSource] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedTagOption, setSelectedTagOption] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [selectedArtistOption, setSelectedArtistOption] = useState(null);
  const [nsfwToggle, setNSFWToggle] = useState(false);
  const [hiddenToggle, setHiddenToggle] = useState(false);
  const [anonymousToggle, setAnonymousToggle] = useState(false);

  const changeHandler = (ev) => {
    if (!ev.target.files[0]) return;
    setSelectedFile(ev.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("tags", tags);
    // formData.append("author", author);
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
      // setAuthor(ev.target.value);
    }
  };

  const handleSrc = (ev) => {
    if (ev.key === "Enter") {
      setSource(ev.target.value);
    }
  };

  const onUpload = (files) => {
    console.log(files);
    setFiles(files);
    setIsFilePicked(true);
  };

  const handleTagSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/tag?tag=${value}`)
      .then((res) => {
        if (res.data) {
          setTagOptions(res.data);
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const handleSelectTagSearch = (ev) => {
    if (ev.key === "Enter") {
      const selectedTags = selectedTagOption.map((opt) => opt.label);
      console.log("SELECTED TAGS ", selectedTags);
    }
  };

  const handleArtistSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/artist?artist=${value}`)
      .then((res) => {
        if (res.data) {
          setArtistOptions(res.data);
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const handleSelectArtistSearch = (ev) => {
    if (ev.key === "Enter") {
      const selectedTags = selectedArtistOption.map((opt) => opt.label);
      console.log("SELECTED TAGS ", selectedTags);
    }
  };

  const handleTagOnChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setTags(newValue.map((tag) => tag.label));
  };

  const handleArtistOnChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    setArtists(newValue.map((art) => art.label));
  };

  const onFileUpload = (e) => {
    // console.log("Artist", selectedArtistOption);
    // console.log("Tags", selectedTagOption);

    console.log("TAGS", tags);
    console.log("ARTIST", artists);

    const formData = new FormData();
    formData.append("image", files[0]);
    formData.append("tags", tags);
    formData.append("artists", artists);
    formData.append("source", source);
    formData.append("nsfw", nsfwToggle);
    formData.append("hidden", hiddenToggle);
    formData.append("anonymous", anonymousToggle);

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}`, formData, options)
      .then((res) => {
        setFiles(null);
        setTags(null);
        setArtists(null);
        setSource(null);
        setIsFilePicked(false);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: "1px dotted pink",
      // color: state.selectProps.menuColor,
      color: "white",
      backgroundColor: "#16181a",
      // padding: 20,
    }),

    control: (_, { selectProps: { width } }) => ({
      display: "flex",
      width: width,
      height: "40px",
      color: "white",
      backgroundColor: "#16181a",
      borderRadius: "10px",
      marginBottom: "20px",
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  return (
    <div className="Home">
      <Text h1>Upload</Text>
      {/* <Input
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
      /> */}
      <FileDragAndDrop
        count={1}
        formats={[
          "jpg",
          "jpeg",
          "bmp",
          "png",
          "gif",
          "tiff",
          "webp",
          "svg",
          "avif",
          "raw",
          "mp4",
          "mkv",
          "avi",
        ]}
        onUpload={onUpload}
      >
        {/* <span role="img" aria-label="emoji" className="area__icon">
          &#128526;
        </span> */}
        <Text h3>Upload or drop a file right here</Text>
      </FileDragAndDrop>
      {files && files.length > 0 ? (
        <div style={{ marginTop: "30px" }}>
          <Button onPress={onFileUpload}>Upload All</Button>
        </div>
      ) : (
        <div></div>
      )}
      <div style={{ marginTop: "30px", width: "100%" }}>
        {files && files.length > 0 ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {files.map((file, index) => (
              <div key={`${file.name}_${index}`} style={{ display: "flex" }}>
                <img
                  aria-label={file.name}
                  src={URL.createObjectURL(file)}
                  width={400}
                  height={250}
                  style={{ objectFit: "contain" }}
                />
                <div style={{ marginLeft: "20px" }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", marginRight: "30px" }}>
                      <Text style={{ marginRight: "10px" }}>
                        {nsfwToggle ? "NSFW" : "SFW"}
                      </Text>
                      <Switch
                        checked={nsfwToggle}
                        onChange={() => setNSFWToggle(!nsfwToggle)}
                      />
                    </div>
                    <div style={{ display: "flex", marginRight: "30px" }}>
                      <Tooltip content={"Only display this image to you"}>
                        <Text style={{ marginRight: "10px" }}>
                          {hiddenToggle ? "Hidden" : "Public"}
                        </Text>
                        <Switch
                          checked={hiddenToggle}
                          onChange={() => setHiddenToggle(!hiddenToggle)}
                        />
                      </Tooltip>
                    </div>
                    <div style={{ display: "flex" }}>
                      <Tooltip content={"Don't associate your username to the image"}>
                        <Text style={{ marginRight: "10px" }}>
                          {anonymousToggle ? "Anonymous" : "Display"}
                        </Text>
                        <Switch
                          checked={anonymousToggle}
                          onChange={() => setAnonymousToggle(!anonymousToggle)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <Text style={{ marginBottom: "10px" }}>{file.name}</Text>
                  {/* <Input placeholder="Tags" onKeyDown={handleTags} /> */}
                  <Text style={{ marginRight: "10px" }}>Tags</Text>
                  <CreatableSelect
                    onChange={handleTagOnChange}
                    onInputChange={handleTagSearch}
                    isSearchable
                    isMulti
                    placeholder="Search tags"
                    options={tagOptions.map((opt) => ({
                      label: opt.name,
                      value: opt.name,
                    }))}
                    styles={customStyles}
                    width="400px"
                    aria-label="tag select"
                  />

                  {/* end of tags */}
                  <Text style={{ marginRight: "10px" }}>Artist</Text>
                  <CreatableSelect
                    onChange={handleArtistOnChange}
                    onInputChange={handleArtistSearch}
                    isSearchable
                    isMulti
                    placeholder="Search artists"
                    options={artistOptions.map((opt) => ({
                      label: opt.name,
                      value: opt.name,
                    }))}
                    styles={customStyles}
                    width="400px"
                    aria-label="artist select"
                  />
                  {/* end of author */}
                  <Text style={{ marginRight: "10px" }}>Source</Text>
                  <Input
                    placeholder="Source"
                    onKeyDown={handleSrc}
                    style={{ width: "400px" }}
                    aria-label="source provider"
                  />
                  {/* end of source */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Home;

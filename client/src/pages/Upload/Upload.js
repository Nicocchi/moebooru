import React, { useState } from "react";
import { Button, Text, Input, Switch, Tooltip, Progress } from "@nextui-org/react";
import FileDragAndDrop from "../../components/DragAndDrop";
import CreatableSelect from "react-select/creatable";
import customStyles from "../../components/ReactSelect/SelectStyle";
import { FaTrash } from "react-icons/fa";

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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSrc = (ev) => {
    if (ev.key === "Enter") {
      setSource(ev.target.value);
    }
  };

  const onUpload = (files) => {
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
        console.error(err);
      });
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
        console.error(err);
      });
  };

  const handleTagOnChange = (newValue, actionMeta) => {
    setTags(newValue.map((tag) => tag.label));
  };

  const handleArtistOnChange = (newValue, actionMeta) => {
    setArtists(newValue.map((art) => art.label));
  };

  const deleteFile = () => {
    setFiles([]);
    setIsFilePicked(false);
  }

  const onFileUpload = (e) => {
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
      onUploadProgress: progressEv => {
        const progress = Math.round(100 * (progressEv.loaded / progressEv.total))
        setUploadProgress(progress);
      }
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
        console.error(err);
      });
  };

  return (
    <div className="Home">
      <Text h1>Upload</Text>
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
        <Text h3>Upload or drop a file right here</Text>
      </FileDragAndDrop>
      {files && files.length > 0 ? (
        <div style={{ marginTop: "30px" }}>
          <Button onPress={onFileUpload}>Upload All</Button>
          <Progress color="primary" value={uploadProgress} style={{marginTop: "30px"}} />
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
                    <div style={{ display: "flex", marginRight: "30px" }}>
                      <Tooltip
                        content={"Don't associate your username to the image"}
                      >
                        <Text style={{ marginRight: "10px" }}>
                          {anonymousToggle ? "Anonymous" : "Display"}
                        </Text>
                        <Switch
                          checked={anonymousToggle}
                          onChange={() => setAnonymousToggle(!anonymousToggle)}
                        />
                      </Tooltip>
                    </div>
                    <div>
                      <Button
                        auto
                        color="error"
                        icon={<FaTrash fill="currentColor" filled />}
                        onPress={deleteFile}
                      />
                    </div>
                  </div>

                  <Text style={{ marginBottom: "10px" }}>{file.name}</Text>
                  {/* end of top */}
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
                  {/* end of artist */}
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

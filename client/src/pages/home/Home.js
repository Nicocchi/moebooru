import React, { useState } from "react";
import { Button, Text, Input } from "@nextui-org/react";
import { SendButton } from "../../components/SendButton";
import { SendIcon } from "../../components/SendIcon";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Home.css";
import axios from "axios";

function Home({ Component }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState([]);
  const [source, setSource] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const changeHandler = (ev) => {
    if (!ev.target.files[0]) return;
    setSelectedFile(ev.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    console.log(selectedFile);
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
      .post("http://localhost:5000", formData, options)
      .then((res) => {
        setSelectedFile(null);
        setIsFilePicked(false);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const handleSearch = (value) => {
    axios
      .get(`http://localhost:5000/tag?tag_name=${value}`)
      .then((res) => {
        if (res.data) {
          setTagOptions(res.data)
        }
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  };

  const handleSelectSearch = (ev) => {
    if (ev.key === "Enter") {
      const selectedTags = selectedOption.map((opt) => opt.label);
      console.log("SELECTED TAGS ", selectedTags);
      navigate(`/gallery?tags=${selectedOption.map((opt) => opt.label)}`)
    }
    
    // axios
    //   .get(`http://localhost:5000/tag?tag_name=${value}`)
    //   .then((res) => {
    //     if (res.data) {
    //       setTagOptions(res.data)
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("ERR", err);
    //   });
  }

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

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: '1px dotted pink',
      // color: state.selectProps.menuColor,
      color: "white",
      backgroundColor: "#16181a",
      // padding: 20,
    }),
  
    control: (_, { selectProps: { width }}) => ({
      display: "flex",
      width: width,
      height: "40px",
      color: "white",
      backgroundColor: "#16181a",
      borderRadius: "10px"
    }),
  
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

  return (
    <div className="Home">
      <Text h1>Moebooru</Text>
      {/* <Select options={aquaticCreatures} onChange={handleSearch} /> */}
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        onInputChange={handleSearch}
        isSearchable
        isMulti
        placeholder="Search tags"
        options={tagOptions.map(opt => ({label: opt.name, value: opt.name}))}
        onKeyDown={handleSelectSearch}
        styles={customStyles}
        width="200px"
      />
      {/* <Input
        color="primary"
        name="search"
        aria-label="search-image"
        contentRightStyling={false}
        placeholder="Search image"
        onChange={handleSearch}
        // contentRight={
        //   <Button disabled={!isFilePicked} onPress={handleSubmission}>
        //     <SendIcon disabled={!isFilePicked} />
        //   </Button>
        // }
      /> */}
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

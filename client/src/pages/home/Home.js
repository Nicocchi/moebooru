import React, { useState } from "react";
import { Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Home.css";
import axios from "axios";
import {RabbitLogo} from "../../components/Logo/Rabbit";

function Home() {
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const handleSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/tag?tag_name=${value}`)
      .then((res) => {
        if (res.data) {
          setTagOptions(res.data)
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectSearch = (ev) => {
    if (ev.key === "Enter") {
      navigate(`/gallery?tags=${selectedOption.map((opt) => opt.label)}`)
    }
  }

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
      <div style={{display: "flex", alignItems: "center", marginBottom: "20px", paddingLeft: "20px", width: "400px"}}>
      <RabbitLogo fill="#ff557f" width={100} height={100}/>
      <Text h1>Moebooru</Text>
      </div>
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
        width="400px"
      />
    </div>
  );
}

export default Home;

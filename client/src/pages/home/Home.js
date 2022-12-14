import React, { useState } from "react";
import { Text } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Home.css";
import axios from "../../utils/axios.config";
import {RabbitLogo} from "../../components/Logo/Rabbit";
import customStyles from "../../components/ReactSelect/SelectStyle";

function Home() {
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const handleSearch = (value) => {
    axios
      .get(`/tags?tags=${value}`)
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
      navigate(`/browse?tags=${selectedOption.map((opt) => opt.label)}`)
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

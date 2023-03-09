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
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

module.exports = customStyles;
// CategoryTabs.js
import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CategoryTabs = () => {
  const ecommerceurl = "http://localhost:8080/api/products/categories";
  const [options, setOptions] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the backend
    axios
      .get(ecommerceurl)
      .then((response) => {
        console.log(response.data);
        var x = ["all", ...response.data];
        console.log(x);
        const formattedOptions = x.map((item) => ({
          value: item,
          label: item,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    // Set initial value to the first option once options are fetched
    if (options.length > 0) {
      setSelectedButton(options[0].value);
    }
  }, [options]);

  const handleButtonChange = (event, newButtonValue) => {
    //alert(newButtonValue);
    setSelectedButton(newButtonValue);
    if (newButtonValue !== null) {
      navigate("/category/" + newButtonValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedButton}
      onChange={handleButtonChange}
      exclusive
    >
      {options.map((option, index) => (
        <ToggleButton key={index} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default CategoryTabs;

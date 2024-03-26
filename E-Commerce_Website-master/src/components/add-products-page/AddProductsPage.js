import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Creatable from "react-select/creatable";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import "./AddProductsPage.css";

function AddProductsPage({ isModifyPage }) {
  const ecommerceurl = "/api/products";
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);

  const [setData, setSetData] = useState(new Set());

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    manufacturer: "",
    availableItems: "",
    price: "",
    imageUrl: "",
    description: "",
  });
  const { id } = useParams();
  console.log("11");
  console.log("productId==" + id);
  console.log("isModifyPage==" + isModifyPage);

  useEffect(() => {
    axios
      .get(ecommerceurl + "/categories")
      .then((response) => {
        // Assuming your server returns data in an array format
        // Modify this according to your actual API response structure
        const formattedOptions = response.data.map((item) => ({
          value: item,
          label: item,
        }));
        console.log(formattedOptions);
        setOptions(formattedOptions);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures useEffect only runs once on component mount

  const handleCategory = (newValue, actionMeta) => {
    setSelectedOption(newValue);
    console.log("Option selected:", newValue);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOption = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setOptions([...options, newOption]); // Update options state with new option
    setSelectedOption(newOption); // Optionally select the newly created option
    console.log("Option created:", newOption);
  };

  useEffect(() => {
    if (id != null && isModifyPage == true) {
      console.log("22");
      axios.get(ecommerceurl + "/" + id).then((response) => {
        console.log("33");
        const productDetails = response.data;
        console.log(productDetails);
        //setFormData("name",productDetails.name);
        setFormData({
          ["id"]: productDetails.id,
          ["name"]: productDetails.name,

          ["manufacturer"]: productDetails.manufacturer,
          ["availableItems"]: productDetails.availableItems,
          ["price"]: productDetails.price,
          ["imageUrl"]: productDetails.imageUrl,
          ["description"]: productDetails.description,
        });
        console.log(productDetails.category);
        //setIsLoading(true);

        const newOption = {
          value: productDetails.category,
          label: productDetails.category,
        };

        setSelectedOption(newOption);

        console.log(selectedOption);
      });
    }
  }, []);

  const validateForm = () => {
    if(formData.name.trim() === "") {
      alert("Enter Product Name");
      //document.getElementById("username").focus(); 
      return false;
    }
    if(selectedOption === null || selectedOption.value==="") {
      alert("Select Category");
      //document.getElementById("username").focus(); 
      return false;
    }
    if(formData.manufacturer=== "") {
        alert("Enter Manufacturer Name");
        //document.getElementById("username").focus(); 
        return false;
    }
    if(formData.availableItems=== "") {
      alert("Enter Available Quantity");
      //document.getElementById("username").focus(); 
      return false;
    }
    if(formData.price=== "") {
      alert("Enter Price");
      //document.getElementById("username").focus(); 
      return false;
    }
    return true;
  }

  const handleModifyProduct = async () => {
    try {
      if(!validateForm()) {
        return ;
      }
      const response = await fetch(ecommerceurl + "/" + formData.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("USERTOKEN"),
        },
        body: JSON.stringify({
          name: formData.name,
          category: selectedOption.value,
          manufacturer: formData.manufacturer,
          availableItems: parseInt(formData.availableItems),
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          description: formData.description,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      //const data = await response.json();
      setSuccessMessage(
        `Product ${formData.name} ${
          isModifyPage ? "modified" : "added"
        } successfully`
      );
    } catch (error) {
      alert(error);
    }
  };

  {
    /* Modify Success Message */
  }
  {
    successMessage && (
      <Snackbar
        className="delete-success-message"
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => successMessage("")}
      >
        <Alert onClose={() => successMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    );
  }

  const handleAddProduct = async () => {
    try {
      if(!validateForm()) {
        return ;
      }
      const response = await fetch(ecommerceurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("USERTOKEN"),
        },
        body: JSON.stringify({
          name: formData.name,
          category: selectedOption.value,
          manufacturer: formData.manufacturer,
          availableItems: parseInt(formData.availableItems),
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          description: formData.description,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      //const data = await response.json();
      setSuccessMessage(
        `Product ${formData.name} ${
          isModifyPage ? "modified" : "added"
        } successfully`
      );
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
    <div className="add-products-container">
      <div className="heading-container">
        <h1>{isModifyPage ? "Modify Product" : "Add Product"}</h1>
      </div>

      <form id="productform">
        <div className="form-container">
          <div className="name-field">
            <span>Product Name *</span>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="select-category">
            <span>Select Category *</span>
            <Creatable
              name="category"
              options={options}
              isLoading={isLoading}
              value={selectedOption}
              onChange={handleCategory}
              onCreateOption={handleCreateOption}
            />
          </div>
          <br />
          <div className="manufacturer-field">
            <span>Manufacturer *</span>
            <input
              type="text"
              name="manufacturer"
              required
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </div>
          <div className="available-items-field">
            <span>Available Quantity *</span>
            <input
              type="number"
              name="availableItems"
              min={1}
              required
              value={formData.availableItems}
              onChange={handleChange}
            />
          </div>
          <div className="price-field">
            <span>Price *</span>
            <input
              type="number"
              name="price"
              min={0}
              required
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="image-url-field">
            {isModifyPage && <span>Image URL</span>}
            <input
              type="text"
              name="imageUrl"
              placeholder={!isModifyPage && "Image URL"}
              required
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="description-field">
            {isModifyPage && <span>Discription</span>}
            <input
              type="text"
              name="description"
              placeholder={!isModifyPage && "Discription"}
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {!isModifyPage && (
            <>
              <button type="button" onClick={handleAddProduct}>
                {"SAVE PRODUCT"}
              </button>
            </>
          )}
          {isModifyPage && (
            <>
              <button type="button" onClick={handleModifyProduct}>
                {"MODIFY PRODUCT"}
              </button>
            </>
          )}
        </div>
      </form>

      {successMessage && (
        // <div className="success-message">{successMessage}</div>
        <Snackbar
          className="add-modify-success-message"
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
    </>
  );
}

export default AddProductsPage;

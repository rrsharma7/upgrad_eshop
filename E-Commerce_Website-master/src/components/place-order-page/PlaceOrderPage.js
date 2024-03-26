import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PlaceOrderPage.css";
import { useAuth } from "../../contexts/AuthContext";

function OrderDetails({ selectedAddress }) {
  const navigate = useNavigate();
  const { productid, quantity, addressid } = useParams();
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    console.log("Fetching product details...");
    console.log(productid);
    fetch(`/api/products/${productid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received product data:", data);
        setProduct(data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, []);

  useEffect(() => {
    fetchAddressDetails();
  }, []);

  const { authUser, isLoggedIn, isAdmin } = useAuth();
  const fetchAddressDetails = async () => {
    console.log(1);
    try {
      const response = await fetch(`/api/addresses/${addressid}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": localStorage.getItem("USERTOKEN"),
        },
      });
      console.log(3);
      if (response.ok) {
        console.log(4);
        const data = await response.json();
        setAddress(data);
        console.log(data);
      } else {
        console.error("Failed to fetch address");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {

      console.log("Quantity "+ quantity);
      console.log("\nUser Id "+ localStorage.getItem("USERID"));
      console.log("\nProduct Id "+ productid);
      console.log("\nAddress Id "+ addressid);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          'X-Auth-Token':     localStorage.getItem("USERTOKEN"),


        },
        body: JSON.stringify({
          quantity: parseInt(quantity),
          user:localStorage.getItem("USERID") ,
          product: productid,
          address: addressid
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add order");
      }

      //const data = await response.json();
      setSuccessMessage(
        'Order placed successfully'
      );
    } catch (error) {
      alert(error);
    }
    navigate("/home", { state: { successMessage: "Order placed successfully" } });


    
  };

  return (
    <>
      <div className="U-section">
        <i
          className="fa-solid fa-circle-check"
          style={{ color: "#3f51b5", fontSize: "20px" }}
        ></i>
        <span>Items</span>
        <div>
          <hr />
        </div>
        <i
          className="fa-solid fa-circle-check"
          style={{ color: "#3f51b5", fontSize: "20px" }}
        ></i>
        <span>Select Address</span>
        <div className="1">
          <hr />
        </div>
        <span
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            padding: "0.5px",
            height: "20px",
            width: "20px",
            borderRadius: "50%",
            textAlign: "center",
          }}
        >
          3
        </span>
        <span>Confirm Order</span>
      </div>
      <div className="order-details-container">
        <div className="L-section">
          {product !== null && (
            <>
              <h2>
                {product.name}
              </h2>
              <p>
                Quantity:        
                <b> {quantity}</b>
              </p>
              <p>
                Category: 
                <b> {product.category}</b>
              </p>
              <p>
                {product.description}
              </p>
              <h3 style={{color:"red"}}>
                Total Price : ₹ {product.price * quantity}
              </h3>
            </>
          )}
        </div>
        <div className="R-section">
          <h2>Address Details :</h2>
          {address !== null && (
            <>
              <p>{address.name}</p>
              <p>Contact Number: {address.contactNumber}</p>
              <p>{address.street}, {address.city}</p>
              <p>{address.state}</p>
              <p>{address.zipcode}</p>
            </>
          )}
        </div>
      </div>
      <div className="place-order-buttons">
        <button style={{ backgroundColor: "white", color: "black" }}>
          BACK
        </button>
        <button onClick={handleConfirmOrder}>PLACE ORDER</button>
      </div>
    </>
  );
}

export default OrderDetails;

// ProductDetailsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./ProductDetailPage.css"
import CategoryTabs from '../category-tabs/CategoryTabs';

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    console.log('Fetching product details...');
    console.log(id);
    fetch(`/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Received product data:', data);
        setProduct(data);
      })
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);
  
  const navigate = useNavigate();

  const handleOrder = () => {
    if(quantity==="") {
      alert("Enter Quantity");
      return;
    }
    navigate('/address-page/' + id + "/" + quantity);
    // Handle placing order with selected quantity
    // console.log(`Ordered ${quantity} units of ${product.name}`);
  };
  

  return (
    <div>
      <div className="category">
        <CategoryTabs/>
      </div>
      {product ? (
        <div className="product-details-container">
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <div className="product-info-container">
            <div className="name-quantity">
            <h1>{product.name}</h1>
            <span>Available Quantity: {product.availableItems}</span>
            </div>
            <p>Category: <b>{product.category}</b></p>
            <p>Description: {product.description}</p>
            <p style={{color:"red",fontSize:"20px"}}>₹ {product.price}</p>
            <div className="input-quantity">
            <span>Enter Quantity</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
              max={product.quantity} // Set maximum quantity as available quantity
              required
            />
            </div>
            <br />
            <button className="place-order-button" onClick={handleOrder}>PLACE ORDER</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProductDetailsPage;

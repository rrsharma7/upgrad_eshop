import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation,useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CategoryTabs from '../category-tabs/CategoryTabs';
import ProductCard from '../product-card/ProductCard';
import SortingDropdown from '../sorting-dropdown/SortingDropdown';
import './Home.css';

const Home = () => {
  const location = useLocation();
  // Access URL parameters using useParams
  const { name } = useParams();
  const { isAdmin } = useAuth();
  const ecommerceurl = "/api/products";

  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  
  const [sortingOption, setSortingOption] = useState('default');
  const [filterTerm, setFilterTerm] = useState('');

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if state parameter exists
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  const navigate = useNavigate();
  const fetchDataAndContinue = async () => {
    console.log('Before fetching data');
    //await fetchProducts(); // Wait for fetchProducts to complete
    try {
      const response = await fetch(ecommerceurl);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        console.log('After fetching data');
    // Code here will be executed after fetchProducts() completes
    console.log("Length of all products " + data.length);
    setDisplayProducts(data);
    console.log("Length of display products ====" + displayProducts.length);
  
    // Additional logic based on location.pathname
    if (location.pathname.startsWith("/category")) {
      let category = name;
      console.log("Category name====" + name);
      if (category !== "all") {
        const filteredProducts1 = products.filter(product => product.category === category);
        setDisplayProducts(filteredProducts1);
      }
    }
    if (location.pathname.startsWith("/search")) {
      // let searchquery = name;
      const filteredProducts = products.filter(product => product.name === name);
      setDisplayProducts(filteredProducts);
    }
    console.log(data);
  } else {
    console.error('Failed to fetch products');
  }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  useEffect(() => {
    fetchDataAndContinue();
  }, [navigate, location]);

  const handleSortingChange = (newSortBy) => {
    if(newSortBy === "priceHighToLow" ) {
      const sortedItems = [...displayProducts].sort((a, b) => b.price - a.price);
      setDisplayProducts(sortedItems);

    }
    if(newSortBy === "priceLowToHigh" ) {
      const sortedItems = [...displayProducts].sort((a, b) => a.price - b.price);
      setDisplayProducts(sortedItems);
    } 
    if(newSortBy === "newest" ) {
      const sortedItems = [...displayProducts].sort((a, b) => b.productId - b.productId);
      setDisplayProducts(sortedItems);
    } 
    //setSortingOption(newSortBy);
  };

  const handleDeleteProduct = (productId) => {
    // Remove the deleted product from the products array
    setProducts(products.filter(product => product.id !== productId));
  };

  

  return (
    <div className="container">
      <div className="category">
        <CategoryTabs/>
      </div>
      <br />
      <div className="sort">
        <span id="sorting-dropdown-label">Sort By:</span>
        <SortingDropdown onSortChange={handleSortingChange} />
      </div>
      <div className="product-cards">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={isAdmin}
            onDeleteProduct={handleDeleteProduct} // Pass the delete function
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

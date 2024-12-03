import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios"; 
 
function App() {
  const [productDetails, setProductDetails] = useState([]);
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    getProductDetails();
  }, []);
  
  const getProductDetails = async () => {
    try {
      setStatus("loading");
      const result = await axios.get("http://localhost:4001/products");
      setProductDetails(result.data.data); 
      setStatus("complete");
    } catch (error) {
      console.error("Error fetching product details:", error);
      setStatus("failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      setStatus("loading");
      await axios.delete(`http://localhost:4001/products/${id}`); 
      const updatedProducts = productDetails.filter((product) => product.id !== id); 
      setProductDetails(updatedProducts); 
      setStatus("complete");
    } catch (error) {
      console.error("Error deleting product:", error);
      setStatus("failed");
    }
  };

  const resetProducts = async () => {
    try {
      setStatus("loading");
      const result = await axios.post("http://localhost:4001/reset-products"); // เรียก API เพื่อรีเซ็ต
      setProductDetails(result.data.data); 
      setStatus("complete");
    } catch (error) {
      console.error("Error resetting products:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="App">
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        {/* ปุ่มดึงข้อมูลใหม่ */}
        <button onClick={resetProducts} className="refresh-button">
          Refresh Products
        </button>
      </div>
      {/* แสดงสถานะ Loading หรือ Error */}
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Fetching Error...</p>}
      {status === "complete" && (
      <div className="product-list">
        {Array.isArray(productDetails) && productDetails.map((product) => (
        <div className="product" key={product.id}>
          <div className="product-preview">
            <img
              src={product.image}
              alt={product.name}
              width="350"
              height="350"
            />
          </div>
          <div className="product-detail">
            <h1>Product name: {product.name}</h1>
            <h2>Product price: {product.price} Baht</h2>
            <p>Product description: {product.description}</p>
          </div>

          <button className="delete-button" onClick={() => deleteProduct(product.id)}>x</button>
        </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default App;

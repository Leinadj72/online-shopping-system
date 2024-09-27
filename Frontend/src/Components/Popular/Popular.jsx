import React, { useEffect, useState } from 'react';
import './Popular.css';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/popularproducts')
      .then((response) => response.json())
      .then((data) => setPopularProducts(data))
      .catch((error) =>
        console.error('Error fetching popular products:', error)
      );
  }, []);

  return (
    <div className="popular">
      <h1>Popular Products</h1>
      <div className="popular-item">
        {popularProducts.map((product) => (
          <div key={product.id} className="product-item">
            <img
              style={{
                width: '280px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              src={product.image}
              alt={product.name}
            />
            <h2>{product.name}</h2>
            <p>Price: ${product.new_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popular;

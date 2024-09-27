import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};
export const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());

  useEffect(() => {
    fetch('http://localhost:4000/allproducts')
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          alert(data.message); // Alerts the error message from the backend
        } else {
          setAll_Product(data.products); // Products are in `data.products`
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        alert('Failed to fetch products');
      });
  }, []);

  // Function to add to cart locally
  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  // Add to cart via backend
  const addToCartBackend = async (userID, productID, quantity = 1) => {
    try {
      const response = await fetch('http://localhost:4000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, productID, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Product added to cart successfully');
        // Optionally, update the cart state based on the backend response
        addToCart(productID); // Add locally after successful backend response
      } else {
        console.error('Error adding product to cart:', data.message);
        alert('Error adding product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };
  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    addToCartBackend,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { useAuth } from '../../Context/AuthContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCartBackend } = useContext(ShopContext);
  const { currentUser } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const handleAddToCart = async () => {
    const userID = currentUser?.id;
    await addToCartBackend(userID, product.id, quantity);
  };
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-image-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-image">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(566)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            GHC{product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            GHC{product.new_price}
          </div>
          <div className="productdisplay-right-description">
            <p>
              A lightweight, usually knitted, pullover shirt, close-fitting and
              with a round neckline and short sleeves, worn as an undershirt or
              outer gament
            </p>
          </div>
          <div className="productdisplay-right-size">
            <h1>Select Size</h1>
            <div className="productdisplay-right-sizes">
              <div>S</div>
              <div>M</div>
              <div>L</div>
              <div>XL</div>
              <div>XXl</div>
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
          <button onClick={handleAddToCart}>ADD TO CART</button>
          <p className="productdisplay-right-category">
            <span>Category :</span>Women, T-Shirt, Crop-Top
          </p>
          <p className="productdisplay-right-category">
            <span>Tags :</span>Modern, Latest
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;

import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menu, setMenu] = useState('shop');
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
    // You can perform search-related actions here, such as redirecting to search results page
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>MALL</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <Link to="/search">
          <button type="submit">Search</button>
        </Link>
      </form>
      <ul ref={menuRef} className="nav-menu">
        <li></li>
        <li
          onClick={() => {
            setMenu('shop');
          }}
        >
          <Link style={{ textDecoration: 'none' }} to="/">
            Shop
          </Link>{' '}
          {menu === 'shop' ? <hr /> : null}
        </li>

        <li
          onClick={() => {
            setMenu('men');
          }}
        >
          <Link style={{ textDecoration: 'none' }} to="/Men">
            Men
          </Link>{' '}
          {menu === 'men' ? <hr /> : null}
        </li>
        <li
          onClick={() => {
            setMenu('women');
          }}
        >
          <Link style={{ textDecoration: 'none' }} to="/Women">
            Women
          </Link>{' '}
          {menu === 'women' ? <hr /> : null}
        </li>
        <li
          onClick={() => {
            setMenu('kid');
          }}
        >
          <Link style={{ textDecoration: 'none' }} to="/Kid">
            Kid
          </Link>{' '}
          {menu === 'kid' ? <hr /> : null}
        </li>
        {/* <li
          onClick={() => {
            setMenu('contacts');
          }}
        >
          <Link style={{ textDecoration: 'none' }} to="/Contact">
            Contact
          </Link>{' '}
          {menu === 'contacts' ? <hr /> : null}
        </li> */}
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <button
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace('/');
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="Cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;

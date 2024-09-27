const port = 4000;
const express = require('express');
const app = express(); // Initialize Express correctly
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { Await } = require('react-router-dom');

// Middleware
app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect(
  'mongodb+srv://LeinadJ:MongoDB9494@cluster0.ui1tk.mongodb.net/makola'
);

// API Routes
app.get('/', (req, res) => {
  res.send('Express App is Running');
});
// Image Storage Engine

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images

app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Creating Product

const Product = mongoose.model('Product', {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kid'],
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  related: [Number],
});

app.post('/addproduct', async (req, res) => {
  try {
    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      popular: req.body.popular || false,
      related: req.body.related || [],
    });

    await product.save();
    console.log('Product Saved:', product);
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
});

// Creating API For deleting Product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log('Removed');
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API For Getting All Product

app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log('All Products Fetched');
    res.json({ success: true, products }); // Ensure you're returning products in this format
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching products' });
  }
});

// creating API for category
app.get('/products/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });
    console.log(`Products in category ${category} fetched`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching products' });
  }
});

// creating API for popular product

app.get('/popularProducts', async (req, res) => {
  try {
    const products = await Product.find({ popular: true });
    console.log('Popular Products Fetched');
    res.json(products);
  } catch (error) {
    console.error('Error fetching popular products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching products' });
  }
});

// creating API for related product

app.get('/relatedproducts/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      id: { $in: product.related },
    });
    console.log('Related Products Fetched');
    res.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error fetching products' });
  }
});

// Schema creating user model
const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: 'existing user found with the same email address',
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  const token = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, token, user: data.user });
});

//Creating endpoint for user login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token, user: data.user });
    } else {
      res.json({ success: false, errors: 'Incorrect Password' });
    }
  } else {
    res.json({ success: false, errors: 'Wrong Email Address' });
  }
});

// creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
  let product = await Product.find({});
  let newcollection = product.slice(1).slice(-8);
  console.log('NewCollection Fetched');
  res.send(newcollection);
});

// Schema for creating Cart model
const Cart = mongoose.model('Cart', {
  userID: {
    type: mongoose.Schema.Types.ObjectId, // To reference the Users collection
    ref: 'Users',
    required: true,
  },
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId, // To reference the Product collection
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// API route for adding a product to the user's cart
app.post('/addtocart', async (req, res) => {
  console.log(req.body);
  const { userID, productID, quantity } = req.body;

  if (!userID || !productID) {
    return res
      .status(400)
      .json({ success: false, message: 'User ID and Product ID are required' });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userID });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new Cart({
        userID,
        products: [],
      });
    }
    // If the cart exists, find if the product is already in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productID.toString() === productID
    );

    if (productIndex > -1) {
      // If the product exists in the cart, update the quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.products.push({ productID, quantity });
    }

    // Save the cart
    await cart.save();

    res.json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log('Server Running on Port ' + port);
  } else {
    console.log('Error : ' + error);
  }
});

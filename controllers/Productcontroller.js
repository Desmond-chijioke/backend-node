const Product = require("../models/Product");

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: req.file ? req.file.path : null,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      updates.image = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };

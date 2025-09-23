const Product = require("../models/Product");

// Get all products
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(400).json({ message: "Invalid product id" });
  }
};


// Admin Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: req.file ? `/uploads/${req.file.filename}` : null, 
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Admin Update Product
const updateProduct = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};


// Admin Delete Product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(400).json({ message: "Delete failed" });
  }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };

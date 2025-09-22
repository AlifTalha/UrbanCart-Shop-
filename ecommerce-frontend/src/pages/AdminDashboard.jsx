import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./admin.css"; // <-- Import CSS file

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
  "Health",
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      stock: product.stock || "",
      image: null,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingProductId) {
      // Update product
      let res;
      if (form.image) {
        // send as FormData if image uploaded
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", Number(form.price));
        formData.append("category", form.category);
        formData.append("stock", Number(form.stock));
        formData.append("image", form.image);

        res = await api.put(`/products/${editingProductId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // send as JSON if no image
        res = await api.put(
          `/products/${editingProductId}`,
          {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            stock: Number(form.stock),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } else {
      // Add new product (always FormData for image)
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("stock", Number(form.stock));
      if (form.image) formData.append("image", form.image);

      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    fetchProducts();
    setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
    setEditingProductId(null);
  } catch (err) {
    console.error("Product submit error:", err.response?.data || err.message);
  }
};


  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Add / Edit Product Form */}
      <form onSubmit={handleSubmit} className="product-form">
        <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        <button type="submit" className="submit-btn">
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {product.image && (
              <img src={`http://localhost:5000${product.image}`} alt={product.name} className="product-image" />
            )}
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-category">{product.category}</p>

            <div className="button-group">
              <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

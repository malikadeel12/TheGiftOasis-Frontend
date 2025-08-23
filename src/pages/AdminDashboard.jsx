// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    discountPercentage: 0,
    discountStart: "",
    discountEnd: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/admin/dashboard");
      setData(res.data.products || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("discountPercentage", form.discountPercentage || 0);
    formData.append("discountStart", form.discountStart || "");
    formData.append("discountEnd", form.discountEnd || "");
    if (form.image) formData.append("image", form.image);

    try {
      if (editingId) {
        await api.put(`/api/admin/update-product/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product updated successfully!");
      } else {
        await api.post("/api/admin/add-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product added successfully!");
      }
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
        discountPercentage: 0,
        discountStart: "",
        discountEnd: "",
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Error saving product"}`);
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: null,
      discountPercentage: product.discountPercentage || 0,
      discountStart: product.discountStart
        ? new Date(product.discountStart).toISOString().slice(0, 16)
        : "",
      discountEnd: product.discountEnd
        ? new Date(product.discountEnd).toISOString().slice(0, 16)
        : "",
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/admin/delete-product/${id}`);
      setMessage("🗑 Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Error deleting product"}`);
    }
  };

  const isDiscountActive = (product) => {
    const now = new Date();
    return (
      product.discountPercentage > 0 &&
      product.discountStart &&
      product.discountEnd &&
      new Date(product.discountStart) <= now &&
      new Date(product.discountEnd) >= now
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-pink-100 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 text-pink-700 text-center">
          Admin Dashboard
        </h1>

        {/* Add Product Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                description: "",
                price: "",
                category: "",
                image: null,
                discountPercentage: 0,
                discountStart: "",
                discountEnd: "",
              });
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            ➕ Add New Product
          </button>
        </div>

        {/* All Products */}
        {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data.map((product) => {
              const finalPrice = isDiscountActive(product)
                ? product.price -
                (product.price * product.discountPercentage) / 100
                : product.price;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-64 object-contain p-2"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-pink-700">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    {isDiscountActive(product) ? (
                      <>
                        <p className="text-gray-500 line-through">
                          ₨ {product.price}
                        </p>
                        <p className="text-pink-500 font-semibold">
                          ₨ {finalPrice.toFixed(2)}{" "}
                          <span className="text-xs text-green-600">
                            ({product.discountPercentage}% OFF)
                          </span>
                        </p>
                        <span className="text-xs text-red-500 block mb-2">
                          Deal ends: {new Date(product.discountEnd).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <p className="text-pink-500 font-semibold">₨ {product.price}</p>
                    )}
                    <span className="text-xs text-gray-500 block mb-3">
                      Category: {product.category}
                    </span>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-pink-600 text-center">
              {editingId ? "✏️ Edit Product" : "🌸 Add New Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <input
                list="categories"
                name="category"
                placeholder="Select or Add New Category"
                value={form.category}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />

              <datalist id="categories">
                <option value="Polaroids" />
                <option value="Frames" />
                <option value="Midnight Surprise" />
                <option value="Acrylic Boxies" />
                <option value="Eid Collection" />
                <option value="Gift Boxes" />
                <option value="Bouqets" />
              </datalist>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              {/* Discount Fields */}
              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount %"
                value={form.discountPercentage}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />
              <label className="text-sm text-gray-500">Discount Start</label>
              <input
                type="datetime-local"
                name="discountStart"
                value={form.discountStart}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />
              <label className="text-sm text-gray-500">Discount End</label>
              <input
                type="datetime-local"
                name="discountEnd"
                value={form.discountEnd}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg"
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                      ? "Update Product"
                      : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium ${message.includes("✅") || message.includes("🗑")
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

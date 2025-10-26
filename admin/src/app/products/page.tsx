"use client";

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { Product, columns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);

  const res = await fetch("http://localhost:8080/api/products", {
  method: "GET", // or "POST"
  headers: { "Content-Type": "application/json" },
  mode: "cors",
  credentials: "include",
});



      if (!res.ok) {
        throw new Error(`Failed to fetch products. Status: ${res.status}`);
      }

      const text = await res.text();
      const products = text ? JSON.parse(text) : [];

      // Ensure all product IDs are numbers
      const formatted = products.map((p: any) => ({
        ...p,
        id: Number(p.id),
      }));

      setData(formatted);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete selected products
  const handleDeleteProducts = async (ids: number[]) => {
    try {
      if (ids.length === 0) return;

      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${ids.length} product(s)?`
      );
      if (!confirmDelete) return;

      for (const id of ids) {
        const res = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to delete product ID: ${id}`);
        }
      }

      toast.success("Selected product(s) deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error("Error deleting product(s)");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold text-lg">All Products</h1>
        <p className="text-sm text-gray-500">
          Manage, add, or delete wood products from here.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">Loading products...</p>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          onDelete={handleDeleteProducts}
        />
      )}
    </div>
  );
};

export default ProductsPage;

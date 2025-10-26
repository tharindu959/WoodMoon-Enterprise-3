"use client";
import { useEffect, useState } from "react";
import { ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { useSearchParams } from "next/navigation";

const ProductList = ({
  category,
  params,
}: {
  category: string;
  params: "homepage" | "products";
}) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || category || "all";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        const data = await res.json();

        // ✅ Prevent broken objects from crashing map
        const safeData = Array.isArray(data) ? data : [];
        setProducts(safeData);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <Link
        href={
          selectedCategory
            ? `/products/?category=${selectedCategory}`
            : "/products"
        }
        className="flex justify-end mt-4 underline text-sm text-gray-500"
      >
        View all products
      </Link>
    </div>
  );
};

export default ProductList;

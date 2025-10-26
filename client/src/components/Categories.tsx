"use client";

import { Layers, Trees, ShoppingBasket, FolderTree } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// ✅ Default category (always visible)
const defaultCategories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
  },
];

type Category = {
  id: number;
  name: string;
  slug?: string;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedCategory = searchParams.get("category");

  // ✅ Fetch categories dynamically from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors", // ✅ Important for cross-origin requests
          credentials: "include", // ✅ Important if cookies or CORS are used
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const data: Category[] = await res.json();
        console.log("✅ Categories fetched:", data); // Debug log
        setCategories(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", value || "all");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ✅ Combine backend + default categories
  const allCategories = [
    ...defaultCategories,
    ...categories.map((c) => ({
      name: c.name,
      slug: c.slug || c.name.toLowerCase().replace(/\s+/g, "-"),
      icon:
        c.name.toLowerCase().includes("wood") ? (
          <Trees className="w-4 h-4" />
        ) : (
          <FolderTree className="w-4 h-4" />
        ),
    })),
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 bg-gray-100 p-2 rounded-lg mb-4 text-sm">
      {loading ? (
        <p className="col-span-full text-center text-gray-500">
          Loading categories...
        </p>
      ) : allCategories.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No categories found.
        </p>
      ) : (
        allCategories.map((category) => (
          <div
            key={category.slug}
            className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md transition ${
              category.slug === selectedCategory
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:bg-white/60"
            }`}
            onClick={() => handleChange(category.slug)}
          >
            {category.icon}
            {category.name}
          </div>
        ))
      )}
    </div>
  );
};

export default Categories;

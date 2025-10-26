import ProductInteraction from "@/components/ProductInteraction";
import { ProductType } from "@/types";
import Image from "next/image";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  // Fetch product metadata for SEO
  try {
    const res = await fetch(`http://localhost:8080/api/products/${params.id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        title: "Product Not Found",
        description: "The product you're looking for does not exist.",
      };
    }

    const product: ProductType = await res.json();
    return {
      title: product.name || "Product Details",
      description: product.description || "Explore product details",
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Error Loading Product",
      description: "Please try again later.",
    };
  }
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string; size?: string }>;
}) => {
  const { id } = await params;
  const { color, size } = await searchParams;

  // ✅ Fetch product from backend
  const res = await fetch(`http://localhost:8080/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="text-center text-gray-500 mt-12">
        Product not found or failed to load.
      </div>
    );
  }

  const product: ProductType = await res.json();

  // ✅ Safely handle missing data
  const selectedSize = size || (product.sizes?.[0] ?? "");
  const selectedColor = color || (product.colors?.[0] ?? "");
  const imageSrc =
    product.imageUrl ||
    (product.images && product.colors?.length
      ? product.images[selectedColor]
      : Object.values(product.images || {})[0]) ||
    "/placeholder.png";

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>

      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">
          LKR {product.price?.toFixed(2) ?? "0.00"}
        </h2>

        {/* Product Interaction Component */}
        <ProductInteraction
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />

        {/* PAYMENT LOGOS */}
        <div className="flex items-center gap-2 mt-4">
          <Image
            src="/klarna.png"
            alt="klarna"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/cards.png"
            alt="cards"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/stripe.png"
            alt="stripe"
            width={50}
            height={25}
            className="rounded-md"
          />
        </div>

        {/* TERMS */}
        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
};

export default ProductPage;

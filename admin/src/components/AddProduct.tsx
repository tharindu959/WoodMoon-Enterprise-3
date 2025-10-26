"use client";

import "react-toastify/dist/ReactToastify.css";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "react-toastify";
import { useState } from "react";

// ✅ Categories specific to wood-related business
const categories = [
  "Woods",
  "Wood Products",
  "Furniture",
  "Panels",
  "Flooring",
  "Accessories",
] as const;

// ✅ Types of wood
const woodTypes = [
  "Teak",
  "Mahogany",
  "Burutha",
  "Albesia",
  "Akeshiya",
  "Jack",
  "Coconut",
  "Kolon",
] as const;

// ✅ Wood finishes
const finishes = [
  "Natural",
  "Polished",
  "Matte",
  "Glossy",
  "Dark Stain",
  "Light Stain",
] as const;

// ✅ Available sizes
const dimensions = [
  "2x2",
  "2x4",
  "4x4",
  "4x6",
  "6x6",
  "Custom Size",
] as const;

// ✅ Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Product name is required!" }),
  shortDescription: z
    .string()
    .min(1, { message: "Short description is required!" })
    .max(120),
  description: z.string().min(1, { message: "Description is required!" }),
  price: z.coerce.number().min(1, { message: "Price is required!" }),
  category: z.enum(categories),
  woodType: z.enum(woodTypes),
  dimensions: z.array(z.enum(dimensions)).nonempty({
    message: "At least one dimension must be selected.",
  }),
  finishes: z.array(z.enum(finishes)),
  image: z.any().optional(),
});

const AddProduct = () => {
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      category: undefined,
      woodType: undefined,
      dimensions: [],
      finishes: [],
      image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setUploading(true);

      // ✅ Convert data to backend-friendly JSON
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        category: values.category,
        shortDescription: values.shortDescription,
        woodType: values.woodType,
        dimensions: values.dimensions.join(", "),
        finishes: values.finishes.join(", "),
      };

      // ✅ FIXED: Use POST instead of GET
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        toast.success("✅ Wood product added successfully!");
        form.reset();
      } else {
        const text = await res.text();
        console.error("Server error:", text);
        toast.error("❌ Failed to add product. Check backend logs.");
      }
    } catch (err) {
      console.error("❌ Add product error:", err);
      toast.error("An error occurred while adding the product.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Wood Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-8"
              >
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Eg: Akeshiya Timber" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Short Description */}
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Eg: High-quality Akeshiya timber"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe wood texture, use cases, etc."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (LKR)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wood Type */}
                <FormField
                  control={form.control}
                  name="woodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wood Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select wood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {woodTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dimensions */}
                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Dimensions</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {dimensions.map((dim) => (
                            <label key={dim} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(dim)}
                                onChange={(e) => {
                                  const newVal = e.target.checked
                                    ? [...(field.value || []), dim]
                                    : field.value.filter((v) => v !== dim);
                                  field.onChange(newVal);
                                }}
                              />
                              {dim}
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Finishes */}
                <FormField
                  control={form.control}
                  name="finishes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wood Finishes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-3">
                          {finishes.map((finish) => (
                            <label key={finish} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(finish)}
                                onChange={(e) => {
                                  const newVal = e.target.checked
                                    ? [...(field.value || []), finish]
                                    : field.value.filter((v) => v !== finish);
                                  field.onChange(newVal);
                                }}
                              />
                              {finish}
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                      </FormControl>
                      <FormDescription>
                        Upload a representative image for the wood.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Add Product"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;

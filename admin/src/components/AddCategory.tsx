"use client";

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
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
});

const AddCategory = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // ✅ Create a slug from the category name
      const slug = values.name.toLowerCase().replace(/\s+/g, "-");

      // ✅ Send data to backend
      const res = await fetch("http://localhost:8080/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: values.name,
          slug,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add category");
      }

      toast.success("✅ Category added successfully!");

      // ✅ Reset form after submission
      form.reset();

      // ✅ Optional: Refresh page or categories list automatically
      window.location.reload();
    } catch (error) {
      console.error("❌ Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Category</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pb-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Furniture" />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the new category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Category"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddCategory;

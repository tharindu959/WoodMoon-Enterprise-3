"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Shield, Star, Users, Trash2 } from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddAdmin from "@/components/AddAdmin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLineChart from "@/components/AppLineChart";

const SingleAdminPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/admins/${id}`);
        if (!res.ok) throw new Error("Failed to fetch admin");
        const data = await res.json();
        setAdmin(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAdmin();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete admin "${admin?.firstName || "this"}"?`))
      return;
    try {
      const res = await fetch(`http://localhost:8080/api/admins/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Admin deleted successfully!");
      router.push("/admins");
    } catch (error) {
      console.error(error);
      alert("Failed to delete admin.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-gray-500">
        <p>Loading admin details...</p>
      </div>
    );

  if (!admin)
    return (
      <div className="p-6 text-gray-500">
        <p>Admin not found.</p>
      </div>
    );

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admins">Admins</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex flex-col xl:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full xl:w-1/3 space-y-6">
          {/* BADGES */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Admin Badges</h1>
            <div className="flex gap-4 mt-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck className="rounded-full bg-blue-500/30 border p-2" size={36} />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Verified</h1>
                  <p className="text-sm text-muted-foreground">
                    This admin account has been verified.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Shield className="rounded-full bg-green-500/30 border p-2" size={36} />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Super Admin</h1>
                  <p className="text-sm text-muted-foreground">
                    Has full access to all system features.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Star className="rounded-full bg-yellow-400/30 border p-2" size={36} />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Top Performer</h1>
                  <p className="text-sm text-muted-foreground">
                    Recognized for exceptional performance.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger>
                  <Users className="rounded-full bg-orange-400/30 border p-2" size={36} />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="font-bold mb-2">Manager</h1>
                  <p className="text-sm text-muted-foreground">
                    Manages multiple user groups.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>

          {/* PROFILE */}
          <div className="bg-primary-foreground p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src="/users/default.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold">
                {admin.firstName} {admin.lastName}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {admin.description || "Admin description or notes go here."}
            </p>
          </div>

          {/* INFO */}
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Admin Information</h1>
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>Edit Admin</Button>
                  </SheetTrigger>
                  <AddAdmin />
                </Sheet>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex flex-col gap-2 mb-8">
                <p className="text-sm text-muted-foreground">Profile completion</p>
                <Progress value={85} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Full name:</span>
                <span>{admin.firstName} {admin.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{admin.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Phone:</span>
                <span>{admin.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Address:</span>
                <span>{admin.address || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">City:</span>
                <span>{admin.city || "N/A"}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Joined on {admin.createdAt || "Unknown"}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Admin Activity</h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAdminPage;

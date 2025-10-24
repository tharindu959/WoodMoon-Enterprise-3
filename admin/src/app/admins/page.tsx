"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { Admin, columns } from "./columns";

const AdminsPage = () => {
  const [data, setData] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admins/all", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const text = await res.text();
        if (!text) {
          console.warn("⚠️ Empty response from /api/admins/all");
          setData([]);
          return;
        }

        const admins = JSON.parse(text);
        const formatted: Admin[] = admins.map((admin: any) => ({
          id: String(admin.id ?? ""),
          avatar: "/users/default.png",
          fullName: `${admin.fullName || admin.firstName || ""} ${admin.lastName || ""}`.trim(),
          email: admin.email || "unknown@email.com",
          status: "active" as "active",
          role: "admin" as "admin",
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching admins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-500">
        <p>Loading admins...</p>
      </div>
    );

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Admins</h1>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default AdminsPage;


import { User, columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<User[]> => {
  try {
    // ✅ Fetch data from your Spring Boot backend
    const res = await fetch("http://localhost:8080/api/users/all", {
      cache: "no-store", // always get latest data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();

    // ✅ Transform backend users to match your User type
    const formattedUsers: User[] = data.map((user: any) => ({
      id: String(user.id),
      avatar: "/users/default.png", // default avatar (optional)
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      status: "active", // or decide from your DB field if available
      role: "user", // backend can later send actual roles
    }));

    return formattedUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // return empty list on error
  }
};

const UsersPage = async () => {
  const data = await getData();

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersPage;

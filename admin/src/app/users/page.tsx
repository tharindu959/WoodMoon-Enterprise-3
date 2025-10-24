import { User, columns } from "./columns";
import { DataTable } from "./data-table";

const getData = async (): Promise<User[]> => {
  return [
    {
      id: "728ed521",
      avatar: "/users/1.png",
      status: "active",
      fullName: "John Doe",
      email: "johndoe@gmail.com",
      role: "admin",
    },
    {
      id: "728ed522",
      avatar: "/users/2.png",
      status: "active",
      fullName: "Jane Doe",
      email: "janedoe@gmail.com",
       role: "user",
    },
    {
      id: "728ed523",
      avatar: "/users/3.png",
      status: "inactive",
      fullName: "Mike Galloway",
      email: "mikegalloway@gmail.com",
      role: "user",
    },
  ];
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

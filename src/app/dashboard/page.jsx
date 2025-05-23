"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#d0ed57",
  "#a4de6c",
  "#8dd1e1",
  "#83a6ed",
  "#8a79ff",
  "#d88484",
];

const Page = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, productsRes] = await Promise.all([
        axios.get("https://norivo-backend.vercel.app/users"),
        axios.get("https://norivo-backend.vercel.app/products"),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    };
    fetchData();
  }, []);

  // User roles count dynamically
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const userRolesData = Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
  }));

  // Total users count
  const totalUsers = users.length;

  const productData = [
    {
      name: "Total",
      count: products.length,
    },
    {
      name: "Featured",
      count: products.filter((p) => p.isFeatured).length,
    },
    {
      name: "Offers",
      count: products.filter((p) => p.isOffer).length,
    },
  ];

  return (
    <div className="p-8 space-y-12 w-full">
      {/* User Summary */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">User Statistics</h1>

        {/* Summary boxes */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="bg-indigo-100 text-indigo-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-44">
            <p className="uppercase font-semibold tracking-wider text-sm">Total Users</p>
            <p className="text-4xl font-bold mt-2">{totalUsers}</p>
          </div>

          {userRolesData.map(({ role, count }, i) => (
            <div
              key={role}
              className="bg-indigo-50 text-indigo-700 rounded-xl shadow-md p-5 flex flex-col items-center w-36"
            >
              <p className="uppercase font-medium tracking-wide text-xs">{role}</p>
              <p className="text-3xl font-semibold mt-1">{count}</p>
            </div>
          ))}
        </div>

        {/* User roles bar chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">User Roles Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userRolesData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Product Stats */}
      <section>
        <h1 className="text-3xl font-bold mb-6 text-center">Product Statistics</h1>

        {/* Summary boxes */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {productData.map(({ name, count }) => (
            <div
              key={name}
              className="bg-green-100 text-green-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-44"
            >
              <p className="uppercase font-semibold tracking-wide text-sm">{name} Products</p>
              <p className="text-4xl font-bold mt-2">{count}</p>
            </div>
          ))}
        </div>

        {/* Product stats bar chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default Page;

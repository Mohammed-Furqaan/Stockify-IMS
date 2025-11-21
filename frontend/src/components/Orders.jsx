import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiCalendar, FiPackage, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

// ----- Apple Style Loading Skeleton -----
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array(6)
      .fill(0)
      .map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </td>
      ))}
  </tr>
);

// ---- Generate Apple-style Status -----
const getStatus = (qty) => {
  if (qty >= 5) return "Delivered";
  if (qty >= 2) return "Processing";
  return "Pending";
};

// ---- Status Badge UI -----
const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setFiltered(response.data.orders);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filters Logic
  useEffect(() => {
    let data = [...orders];

    if (search) {
      data = data.filter((o) =>
        o.product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      data = data.filter(
        (o) =>
          o.product.categoryId.categoryName.toLowerCase() ===
          categoryFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      data = data.filter(
        (o) =>
          new Date(o.orderDate).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
      );
    }

    setFiltered(data);
    setPage(1);
  }, [search, categoryFilter, dateFilter, orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination Logic
  const start = (page - 1) * itemsPerPage;
  const currentPageOrders = filtered.slice(start, start + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#f5f5f7]">
      {/* ----------------- HEADER ----------------- */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-200">
            <FiPackage className="text-gray-700 text-2xl" />
          </div>

          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
              Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage customer orders.
            </p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-black transition text-sm shadow-sm"
        >
          Refresh
        </button>
      </div>

      {/* ----------------- FILTERS ----------------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-xl w-full md:w-1/3">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full outline-none text-sm bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          className="px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-xl text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {Array.from(
            new Set(
              orders.map((o) => o.product.categoryId.categoryName.toLowerCase())
            )
          ).map((c, i) => (
            <option key={i} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <input
          type="date"
          className="px-4 py-2 bg-white shadow-sm border border-gray-200 rounded-xl text-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* ----------------- CARD ----------------- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* CARD HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 bg-[#fafafa]">
          <h3 className="text-lg font-medium text-gray-900">Order Records</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} orders found
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#fafafa] border-b border-gray-200">
              <tr>
                {[
                  "S No",
                  "Product",
                  "Category",
                  "Qty",
                  "Status",
                  "Total",
                  "Date",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array(6)
                  .fill(0)
                  .map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                currentPageOrders.map((order, index) => (
                  <motion.tr
                    layout
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {start + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.product.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.product.categoryId.categoryName}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.quantity}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={getStatus(order.quantity)} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₹{order.totalPrice}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                      <FiCalendar className="text-gray-500 text-sm" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-gray-500 bg-gray-50"
                  >
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ----------------- PAGINATION ----------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                page === i + 1
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

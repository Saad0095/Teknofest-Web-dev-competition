import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ticketAPI } from "../utils/api";
import TicketForm from "../components/TicketForm";
import {
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ Open: 0, inProgress: 0, Resolved: 0, total: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fixed: Added dependency array with proper dependencies
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fixed: Memoize fetch functions to prevent infinite loops
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setError("");
        const response = await ticketAPI.getAll();
        setTickets(response.tickets);
      } catch (err) {
        setError("Failed to fetch tickets. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await ticketAPI.getStats();
        setStats(response.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    if (isAuthenticated) {
      fetchTickets();
      fetchStats();
    }
  }, [isAuthenticated]);

  // Fixed: Create stable function references
  const fetchTickets = async () => {
    try {
      setError("");
      const response = await ticketAPI.getAll();
      setTickets(response.tickets);
    } catch (err) {
      setError("Failed to fetch tickets. Please try again.");
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ticketAPI.getStats();
      setStats(response.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleCreateTicket = async (formData) => {
    setFormLoading(true);
    try {
      await ticketAPI.create(formData);
      setShowForm(false);
      await fetchTickets();
      await fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTicket = async (formData) => {
    setFormLoading(true);
    try {
      await ticketAPI.update(editingTicket._id, formData);
      setEditingTicket(null);
      setShowForm(false);
      await fetchTickets();
      await fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket");
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await ticketAPI.update(ticketId, { status: newStatus });
      await fetchTickets();
      await fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await ticketAPI.delete(ticketId);
      await fetchTickets();
      await fetchStats();
      setDeleteConfirm(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ticket");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isTicketOverdue = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursDiff = (now - created) / (1000 * 60 * 60);
    return hoursDiff > 24;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="w-4 h-4" />;
      case "inProgress":
        return <Clock className="w-4 h-4" />;
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "inProgress":
        return "bg-orange-100 text-orange-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Ticket Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-500 opacity-30" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Open</p>
                <p className="text-3xl font-bold text-gray-900">{stats.Open}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-30" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">inProgress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-30" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.Resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-30" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setFilter("Open")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "Open"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter("inProgress")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "inProgress"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              inProgress
            </button>
            <button
              onClick={() => setFilter("Resolved")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "Resolved"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Resolved
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTicket(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-lg">No tickets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900 font-medium max-w-xs truncate">
                            {ticket.subject}
                          </p>
                          {isTicketOverdue(ticket.createdAt) && ticket.status === "Open" && (
                            <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue (24h+)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ticket.category}</td>
                      <td className="px-6 py-4">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer ${getStatusColor(ticket.status)}`}
                        >
                          <option value="Open">Open</option>
                          <option value="inProgress">inProgress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTicket(ticket);
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(ticket._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Ticket Form Modal */}
      {showForm && (
        <TicketForm
          ticket={editingTicket}
          onSubmit={editingTicket ? handleUpdateTicket : handleCreateTicket}
          onClose={() => {
            setShowForm(false);
            setEditingTicket(null);
          }}
          isLoading={formLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">Delete Ticket</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this ticket? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTicket(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
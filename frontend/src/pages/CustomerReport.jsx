import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/CustomerReport.css";

function CustomerReport() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Arjun Kumar",
      email: "arjun@gmail.com",
      phone: "+91 9876543210",
      location: "Hyderabad",
      joined: "15 Jan 2025",
      status: "Inactive",
      image: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "Priya Reddy",
      email: "priya@gmail.com",
      phone: "+91 9123456780",
      location: "Vijayawada",
      joined: "08 Mar 2025",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 3,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9988776655",
      location: "Bangalore",
      joined: "21 Feb 2025",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "+91 9000011111",
      location: "Chennai",
      joined: "10 Apr 2025",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=47",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(searchText) ||
      customer.email.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || customer.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditCustomer({ ...customer });
  };

  const handleSave = () => {
    setCustomers(
      customers.map((customer) =>
        customer.id === editCustomer.id ? editCustomer : customer
      )
    );

    setEditCustomer(null);
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="main-content">
        <Sidebar />

        <div className="content">
          <div className="customer-report">

            {/* Header */}
            <div className="customer-header">
              <h1>👥 Customer Report</h1>
              <p>Customer activity and engagement overview.</p>
            </div>

            {/* Cards */}
            <div className="customer-cards">
              <div className="customer-card">
                <h2>Total Customers</h2>
                <h1>430</h1>
              </div>

              <div className="customer-card">
                <h2>Active Customers</h2>
                <h1>390</h1>
              </div>

              <div className="customer-card">
                <h2>Inactive Customers</h2>
                <h1>40</h1>
              </div>
            </div>

            {/* Customer Table */}
            <div className="customer-table">
              <h2>Customer List</h2>

              <input
                type="text"
                placeholder="🔍 Search by Name or Email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="customer-search-box"
              />

              <div className="filter-buttons">
                <button
                  className={filter === "All" ? "active-filter" : ""}
                  onClick={() => setFilter("All")}
                >
                  All
                </button>

                <button
                  className={filter === "Active" ? "active-filter" : ""}
                  onClick={() => setFilter("Active")}
                >
                  🟢 Active
                </button>

                <button
                  className={filter === "Inactive" ? "active-filter" : ""}
                  onClick={() => setFilter("Inactive")}
                >
                  🔴 Inactive
                </button>
              </div>
                            <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>

                      <td>
                        <span
                          className={
                            customer.status === "Active"
                              ? "active"
                              : "inactive"
                          }
                        >
                          {customer.status}
                        </span>
                      </td>

<td>
  <div className="action-buttons">
    <button
      className="view-btn"
      onClick={() => handleView(customer)}
    >
      👁 View
    </button>

    <button
      className="edit-btn"
      onClick={() => handleEdit(customer)}
    >
      ✏️ Edit
    </button>
  </div>
</td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* View Customer Modal */}
              {showModal && selectedCustomer && (
                <div className="modal-overlay">
                  <div className="modal">
                    <img
                      src={selectedCustomer.image}
                      alt={selectedCustomer.name}
                      className="customer-photo"
                    />

                    <h2>{selectedCustomer.name}</h2>

                    <p>
                      <strong>Customer ID:</strong> {selectedCustomer.id}
                    </p>

                    <p>
                      <strong>Email:</strong> {selectedCustomer.email}
                    </p>

                    <p>
                      <strong>Phone:</strong> {selectedCustomer.phone}
                    </p>

                    <p>
                      <strong>Location:</strong> {selectedCustomer.location}
                    </p>

                    <p>
                      <strong>Joined:</strong> {selectedCustomer.joined}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          selectedCustomer.status === "Active"
                            ? "active"
                            : "inactive"
                        }
                      >
                        {selectedCustomer.status}
                      </span>
                    </p>

                    <button
                      className="close-btn"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Customer Modal */}
              {editCustomer && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h2>✏️ Edit Customer</h2>

                    <label>Name</label>
                    <input
                      type="text"
                      value={editCustomer.name}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          name: e.target.value,
                        })
                      }
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      value={editCustomer.email}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          email: e.target.value,
                        })
                      }
                    />

                    <label>Phone</label>
                    <input
                      type="text"
                      value={editCustomer.phone}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          phone: e.target.value,
                        })
                      }
                    />

                    <label>Location</label>
                    <input
                      type="text"
                      value={editCustomer.location}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          location: e.target.value,
                        })
                      }
                    />

                    <label>Status</label>
                    <select
                      value={editCustomer.status}
                      onChange={(e) =>
                        setEditCustomer({
                          ...editCustomer,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <button
                      className="save-btn"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>

                    <button
                      className="close-btn"
                      onClick={() => setEditCustomer(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerReport;
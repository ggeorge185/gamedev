import React, { useState, useEffect } from "react";
import axios from "axios";

// CHANGE THIS to your actual Render backend URL:
const API_URL = "https://gamedev-2jld.onrender.com/api/minigames";

export default function MiniGameTable() {
  const [data, setData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    title: "",
    location: "",
    price: "",
    deposit: "",
    image: "",
    description: "",
    isScam: false,
    redFlags: "",
    greenFlags: "",
  });
  const [editIdx, setEditIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch mini games from backend on mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        // If DB empty, optionally seed with defaultData
        if (res.data.length === 0) setData(defaultData);
        else setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Failed to load data from server");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add a new mini game via backend
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newEntry,
        redFlags: newEntry.redFlags
          ? newEntry.redFlags.split(",").map((s) => s.trim())
          : [],
        greenFlags: newEntry.greenFlags
          ? newEntry.greenFlags.split(",").map((s) => s.trim())
          : [],
      };
      const res = await axios.post(API_URL, payload);
      setData((prev) => [...prev, res.data]);
      setNewEntry({
        title: "",
        location: "",
        price: "",
        deposit: "",
        image: "",
        description: "",
        isScam: false,
        redFlags: "",
        greenFlags: "",
      });
    } catch (err) {
      alert("Failed to add mini game.");
    }
  };

  // Delete mini game from backend
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setData((prev) => prev.filter((entry) => entry._id !== id));
    } catch {
      alert("Failed to delete mini game.");
    }
  };

  // Edit
  const handleEdit = (idx) => {
    setEditIdx(idx);
    const entry = data[idx];
    setNewEntry({
      ...entry,
      redFlags: entry.redFlags ? entry.redFlags.join(", ") : "",
      greenFlags: entry.greenFlags ? entry.greenFlags.join(", ") : "",
    });
  };

  // Update mini game via backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    const entry = data[editIdx];
    try {
      const payload = {
        ...newEntry,
        redFlags: newEntry.redFlags
          ? newEntry.redFlags.split(",").map((s) => s.trim())
          : [],
        greenFlags: newEntry.greenFlags
          ? newEntry.greenFlags.split(",").map((s) => s.trim())
          : [],
      };
      const res = await axios.put(`${API_URL}/${entry._id}`, payload);
      setData((prev) =>
        prev.map((item, idx) => (idx === editIdx ? res.data : item))
      );
      setEditIdx(null);
      setNewEntry({
        title: "",
        location: "",
        price: "",
        deposit: "",
        image: "",
        description: "",
        isScam: false,
        redFlags: "",
        greenFlags: "",
      });
    } catch {
      alert("Failed to update mini game.");
    }
  };

  const handleCancelEdit = () => {
    setEditIdx(null);
    setNewEntry({
      title: "",
      location: "",
      price: "",
      deposit: "",
      image: "",
      description: "",
      isScam: false,
      redFlags: "",
      greenFlags: "",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Mini Game Table</h2>
      <form
        onSubmit={editIdx === null ? handleAdd : handleUpdate}
        style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        <input
          name="title"
          placeholder="Title"
          value={newEntry.title}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={newEntry.location}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          value={newEntry.price}
          onChange={handleChange}
          required
        />
        <input
          name="deposit"
          placeholder="Deposit"
          value={newEntry.deposit}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="Image URL"
          value={newEntry.image}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={newEntry.description}
          onChange={handleChange}
        />
        <label style={{ alignSelf: "center" }}>
          Scam?{" "}
          <input
            type="checkbox"
            name="isScam"
            checked={!!newEntry.isScam}
            onChange={handleChange}
          />
        </label>
        <input
          name="redFlags"
          placeholder="Red Flags (comma-separated)"
          value={newEntry.redFlags}
          onChange={handleChange}
        />
        <input
          name="greenFlags"
          placeholder="Green Flags (comma-separated)"
          value={newEntry.greenFlags}
          onChange={handleChange}
        />
        <button type="submit">
          {editIdx === null ? "Add" : "Update"}
        </button>
        {editIdx !== null && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Price</th>
            <th>Deposit</th>
            <th>Image</th>
            <th>Description</th>
            <th>Is Scam?</th>
            <th>Red Flags</th>
            <th>Green Flags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry._id || idx}>
              <td>{entry.title}</td>
              <td>{entry.location}</td>
              <td>{entry.price}</td>
              <td>{entry.deposit}</td>
              <td>
                {entry.image && (
                  <img src={entry.image} alt="apartment" width={50} />
                )}
              </td>
              <td>{entry.description}</td>
              <td>{entry.isScam ? "Yes" : "No"}</td>
              <td>
                {entry.redFlags && Array.isArray(entry.redFlags)
                  ? entry.redFlags.join(", ")
                  : entry.redFlags}
              </td>
              <td>
                {entry.greenFlags && Array.isArray(entry.greenFlags)
                  ? entry.greenFlags.join(", ")
                  : entry.greenFlags}
              </td>
              <td>
                <button onClick={() => handleEdit(idx)}>Edit</button>
                <button
                  onClick={() =>
                    handleDelete(entry._id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "miniGameTableData";

const defaultData = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    location: "Near Otto-von-Guericke University",
    price: "€450/month",
    deposit: "€900",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    description: "Perfect for students. Furnished, Wi-Fi included.",
    isScam: false,
    redFlags: [],
    greenFlags: ["Reasonable deposit", "Near university", "Furnished"],
  },
];

export default function MiniGameTable() {
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  });
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

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setData([
      ...data,
      {
        ...newEntry,
        id: Date.now(),
        redFlags: newEntry.redFlags
          ? newEntry.redFlags.split(",").map((s) => s.trim())
          : [],
        greenFlags: newEntry.greenFlags
          ? newEntry.greenFlags.split(",").map((s) => s.trim())
          : [],
      },
    ]);
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

  const handleDelete = (id) => {
    setData(data.filter((entry) => entry.id !== id));
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    const entry = data[idx];
    setNewEntry({
      ...entry,
      redFlags: entry.redFlags.join(", "),
      greenFlags: entry.greenFlags.join(", "),
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = {
      ...newEntry,
      redFlags: newEntry.redFlags
        ? newEntry.redFlags.split(",").map((s) => s.trim())
        : [],
      greenFlags: newEntry.greenFlags
        ? newEntry.greenFlags.split(",").map((s) => s.trim())
        : [],
    };
    setData(
      data.map((item, idx) => (idx === editIdx ? { ...item, ...updated } : item))
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
            <tr key={entry.id}>
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
              <td>{entry.redFlags.join(", ")}</td>
              <td>{entry.greenFlags.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(idx)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import "./styles.css";
import { FaThumbsUp, FaMoon, FaSun, FaMapMarkerAlt, FaBolt, FaTint, FaTrash, FaRoad, FaLeaf, FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";


const categoryIcons = {
  Road: <FaRoad />,
  Sanitation: <FaTrash />,
  Electricity: <FaBolt />,
  Water: <FaTint />,
  Environment: <FaLeaf />,
};

const categoryColors = {
  Road: "#e8853d",
  Sanitation: "#6b8f71",
  Electricity: "#e6c84a",
  Water: "#4a90c4",
  Environment: "#7bbf6a",
};

const severityConfig = {
  Low: { color: "#6b8f71", bg: "rgba(107,143,113,0.12)" },
  Medium: { color: "#e6c84a", bg: "rgba(230,200,74,0.12)" },
  High: { color: "#e85d4a", bg: "rgba(232,93,74,0.12)" },
};

const statusConfig = {
  Open: { color: "#4a90c4", label: "Open" },
  "In Progress": { color: "#e6c84a", label: "In Progress" },
  Resolved: { color: "#6b8f71", label: "Resolved" },
};

const delhiAreas = [
  { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
  { name: "Karol Bagh", lat: 28.6519, lng: 77.1909 },
  { name: "Saket", lat: 28.5245, lng: 77.2066 },
  { name: "Dwarka", lat: 28.5921, lng: 77.0460 },
  { name: "Rohini", lat: 28.7041, lng: 77.1025 },
  { name: "Lajpat Nagar", lat: 28.5677, lng: 77.2436 },
  { name: "Janakpuri", lat: 28.6219, lng: 77.0878 },
  { name: "Vasant Kunj", lat: 28.5244, lng: 77.1588 },
  { name: "Chandni Chowk", lat: 28.6506, lng: 77.2303 },
  { name: "Mayur Vihar", lat: 28.6139, lng: 77.2960 }
];

function App() {

  const [issues, setIssues] = useState([]);
  const [duplicateIssue, setDuplicateIssue] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Road",
    severity: "Low",
    image: null,
    // new line area
    area: null
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    fetchIssues();
  }, [search]);

  const fetchIssues = () => {
    let url = "http://localhost:5000/issues";
    if (search) url += `?search=${search}`;
    axios.get(url)
      .then(res => setIssues(res.data))
      .catch(err => console.log(err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   data.append("title", formData.title);
  //   data.append("description", formData.description);
  //   data.append("category", formData.category);
  //   data.append("severity", formData.severity);
  //   data.append("image", formData.image);
  //   axios.post("http://localhost:5000/issues", data, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   }).then(() => {
  //     fetchIssues();
  //     setShowForm(false);
  //     setFileName("");
  //     setFormData({ title: "", description: "", category: "Road", severity: "Low", image: null });
  //   }).catch(err => console.log(err));
  // };


  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("severity", formData.severity);
    data.append("image", formData.image);
    //below 3 lines new for area data
    data.append("lat", formData.area?.lat);
    data.append("lng", formData.area?.lng);
    data.append("areaName", formData.area?.name);

    axios.post("http://localhost:5000/issues", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {

        // 🚨 DUPLICATE DETECTED
        if (res.data.message === "Similar issue already exists") {

          alert("⚠️ Similar issue already exists. Please upvote it!");

          setDuplicateIssue(res.data.existingIssue); // store it

          return; // stop further execution
        }

        // ✅ NORMAL FLOW
        fetchIssues();
        setShowForm(false);
        setFileName("");
        setFormData({
          title: "",
          description: "",
          category: "Road",
          severity: "Low",
          image: null
        });

      })
      .catch(err => console.log(err));
  };

  const handleUpvote = (id) => {
    axios.patch(`http://localhost:5000/issues/${id}/upvote`)
      .then(() => fetchIssues())
      .catch(err => console.log(err));
  };

  const updateStatus = (id, status) => {
    axios.patch(`http://localhost:5000/issues/${id}/status`, { status })
      .then(() => fetchIssues())
      .catch(err => console.log(err));
  };

  const filteredIssues = issues.filter(issue => !filter || issue.category === filter);

  return (
    <div className={`ct-root${darkMode ? " ct-dark" : ""}`}>

      {/* SIDEBAR */}
      <aside className="ct-sidebar">
        <div className="ct-logo">
          <span className="ct-logo-icon"><FaMapMarkerAlt /></span>
          <span className="ct-logo-text">City<strong>Track</strong></span>
        </div>

        <nav className="ct-nav">
          <p className="ct-nav-label">Filter by Category</p>
          {["", "Road", "Sanitation", "Electricity", "Water", "Environment"].map(cat => (
            <button
              key={cat}
              className={`ct-nav-btn${filter === cat ? " active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat ? (
                <>
                  <span className="ct-nav-icon" style={{ color: categoryColors[cat] }}>
                    {categoryIcons[cat]}
                  </span>
                  {cat}
                </>
              ) : (
                <>
                  <span className="ct-nav-icon">📋</span>
                  All Issues
                </>
              )}
              <span className="ct-nav-count">
                {cat ? issues.filter(i => i.category === cat).length : issues.length}
              </span>
            </button>
          ))}
        </nav>

        <div className="ct-sidebar-footer">
          <div className="ct-stats">
            <div className="ct-stat">
              <span className="ct-stat-num">{issues.filter(i => i.status === "Open").length}</span>
              <span className="ct-stat-label">Open</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">{issues.filter(i => i.status === "In Progress").length}</span>
              <span className="ct-stat-label">Active</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">{issues.filter(i => i.status === "Resolved").length}</span>
              <span className="ct-stat-label">Done</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ct-main">

        {/* TOPBAR */}
        <header className="ct-topbar">
          <div className="ct-search-wrap">
            <FaSearch className="ct-search-icon" />
            <input
              className="ct-search"
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="ct-topbar-right">
            <button className="ct-darkmode" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="ct-report-btn" onClick={() => setShowForm(true)}>
              <FaPlus /> Report Issue
            </button>
          </div>
        </header>

        {/* ISSUE COUNT */}
        <div className="ct-page-title">
          <h1>{filter || "All Issues"}</h1>
          <span className="ct-issue-count">{filteredIssues.length} reports</span>
        </div>

        {/* ISSUE GRID */}
        <div className="ct-grid">
          <AnimatePresence>
            {filteredIssues.map((issue, i) => (
              <motion.div
                key={issue._id}
                className="ct-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <div className="ct-card-header">
                  <span
                    className="ct-cat-badge"
                    style={{
                      background: categoryColors[issue.category] + "22",
                      color: categoryColors[issue.category],
                    }}
                  >
                    {categoryIcons[issue.category]} {issue.category}
                  </span>
                  <span
                    className="ct-sev-badge"
                    style={{
                      background: severityConfig[issue.severity]?.bg,
                      color: severityConfig[issue.severity]?.color,
                    }}
                  >
                    {issue.severity}
                  </span>
                </div>

                <h3 className="ct-card-title">{issue.title}</h3>
                <p className="ct-card-desc">{issue.description}</p>
                {/* new line for area data */}
                <p><b>Area:</b> {issue.location?.areaName}</p>

                {issue.image_url && (
                  <div className="ct-card-img-wrap">
                    <img src={issue.image_url} alt="issue" className="ct-card-img" />
                  </div>
                )}

                <div className="ct-card-footer">
                  <span
                    className="ct-status"
                    style={{ color: statusConfig[issue.status]?.color }}
                  >
                    <span className="ct-status-dot" style={{ background: statusConfig[issue.status]?.color }} />
                    {issue.status}
                  </span>

                  <div className="ct-actions">
                    <button className="ct-upvote" onClick={() => handleUpvote(issue._id)}>
                      <FaThumbsUp /> {issue.upvotes}
                    </button>
                    <button
                      className="ct-action-btn"
                      onClick={() => updateStatus(issue._id, "In Progress")}
                    >
                      In Progress
                    </button>
                    <button
                      className="ct-action-btn ct-resolve"
                      onClick={() => updateStatus(issue._id, "Resolved")}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredIssues.length === 0 && (
            <div className="ct-empty">
              <span>🗺️</span>
              <p>No issues found.</p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="ct-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="ct-modal"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="ct-modal-header">
                <h2>Report an Issue</h2>
                <button className="ct-close" onClick={() => setShowForm(false)}><FaTimes /></button>
              </div>

              <form onSubmit={handleSubmit} className="ct-form">
                <div className="ct-field">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Brief title of the issue"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="ct-field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="ct-field-row">
                  <div className="ct-field">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="Road">Road</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Environment">Environment</option>
                    </select>
                  </div>

                  <div className="ct-field">
                    <label>Severity</label>
                    <select name="severity" value={formData.severity} onChange={handleChange}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="ct-field">
                  <label>Attach Image</label>
                  <label className="ct-file-label">
                    <input
                      type="file"
                      className="ct-file-input"
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.files[0] });
                        setFileName(e.target.files[0]?.name || "");
                      }}
                    />
                    <span className="ct-file-btn">📎 Choose File</span>
                    <span className="ct-file-name">{fileName || "No file chosen"}</span>
                  </label>
                  {/* new line till select */}
                  <select
                    onChange={(e) => {
                      const selected = delhiAreas.find(a => a.name === e.target.value);
                      setFormData({
                        ...formData,
                        area: selected
                      });
                    }}
                  >
                    <option value="">Select Area</option>
                    {delhiAreas.map(area => (
                      <option key={area.name} value={area.name}>
                        {area.name}
                      </option>
                    ))}
                  </select>


                </div>

                <button type="submit" className="ct-submit">Submit Report</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
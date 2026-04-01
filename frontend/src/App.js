import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [issues, setIssues] = useState([]);

const [formData, setFormData] = useState({
  title: "",
  description: "",
  category: "Road",
  severity: "Low",
  image: null
});
const [search, setSearch] = useState(""); 
  useEffect(() => {
    fetchIssues();
  }, [search]);

  const fetchIssues = () => {
  let url = "http://localhost:5000/issues";

  if (search) {
    url += `?search=${search}`;
  }

  axios.get(url)
    .then(res => setIssues(res.data))
    .catch(err => console.log(err));
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   axios.post("http://localhost:5000/issues", formData)
  //     .then(() => {
  //       fetchIssues(); // refresh list
  //       setFormData({ title: "", description: "" });
  //     })
  //     .catch(err => console.log(err));
  // };

const handleSubmit = (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("category", formData.category);
  data.append("severity", formData.severity);
  data.append("image", formData.image);

  axios.post("http://localhost:5000/issues", data)
    .then(() => {
      fetchIssues();
    })
    .catch(err => console.log(err));
};

  const handleUpvote = (id) => {
    axios.patch(`http://localhost:5000/issues/${id}/upvote`)
      .then(() => fetchIssues())
      .catch(err => console.log(err));
  };

  const [filter, setFilter] = useState("");

const updateStatus = (id, status) => {
  axios.patch(`http://localhost:5000/issues/${id}/status`, { status })
    .then(() => fetchIssues())
    .catch(err => console.log(err));
};

  return (
    <div>
      <h1>CityTrack 🚀</h1>

      {/* FORM */}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Road">Road</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Electricity">Electricity</option>
          <option value="Water">Water</option>
          <option value="Environment">Environment</option>
        </select>

        <br />

        <select name="severity" value={formData.severity} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button type="submit">Submit Issue</button>

        <input
  type="file"
  onChange={(e) =>
    setFormData({ ...formData, image: e.target.files[0] })
  }
/>
      </form>

<input
  type="text"
  placeholder="Search issues..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ marginBottom: "20px", padding: "5px", width: "200px" }}
/>


      {/* ISSUES */}
      
      {issues
  .filter(issue => !filter || issue.category === filter)
  .map(issue => (
        <div key={issue._id} style={{
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  margin: "10px",
  background: "#f9f9f9"
}}>
  <h3>{issue.title}</h3>
  <p>{issue.description}</p>

  <p><b>Category:</b> {issue.category}</p>
  <p><b>Severity:</b> {issue.severity}</p>
  <p><b>Status:</b> {issue.status}</p>
  {issue.image_url && (
  <img src={issue.image_url} alt="issue" width="200" />
)}

  <p>👍 {issue.upvotes}</p>

  <button onClick={() => handleUpvote(issue._id)}>
    Upvote
  </button>

  <button onClick={() => updateStatus(issue._id, "In Progress")}>
  In Progress
</button>

<button onClick={() => updateStatus(issue._id, "Resolved")}>
  Resolved
</button>
</div>
      ))}

    </div>
  );
}

export default App;
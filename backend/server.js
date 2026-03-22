const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const issueRoutes = require("./routes/issueRoutes");

require("dotenv").config();

const app = express();


app.use(cors());
app.use(express.json());
app.use("/issues", issueRoutes);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("CityTrack API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
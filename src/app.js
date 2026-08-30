const inventoryRoutes = require("./routes/inventoryRoutes");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();

app.use(express.json());
app.use("/api/inventory", inventoryRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Bookstore Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
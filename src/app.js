const express = require("express");
const isbnRoutes = require("../routes/isbnRoutes");

const app = express();

app.use(express.json());
app.use("/api/isbn", isbnRoutes);

app.get("/", (req, res) => {
    res.send("Bookstore Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
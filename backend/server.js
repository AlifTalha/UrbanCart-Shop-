const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));


app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));

app.use("/api/webhook", require("./routes/webhook"));

// Other routes...
app.use("/api/favorites", require("./routes/favoriteRoutes"));


// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

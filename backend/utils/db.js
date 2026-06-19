const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {};
    if (process.env.NODE_ENV !== "production") {
      options.tlsAllowInvalidCertificates = true;
    }
    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("DB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
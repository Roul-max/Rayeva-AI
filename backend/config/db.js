import mongoose from "mongoose";

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempting to connect using the URI from environment variables
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
    console.log("Host:", connection.connection.host);

  } catch (err) {
    // If connection fails, log the error and stop the server
    console.error("Failed to connect to MongoDB");
    console.error("Error message:", err.message);

    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
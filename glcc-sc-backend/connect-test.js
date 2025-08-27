// connect-test.js
const mongoose = require("mongoose");

const uri = "mongodb+srv://glccapp:GlccSc2025@glcc-sc.vtpcweg.mongodb.net/GLCC-SC?retryWrites=true&w=majority";  // paste the full Compass string here
console.log("Connecting to:", uri.replace(/:\/\/.*@/, "://<redacted>@"));

mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log("✅ Connected!");
    return mongoose.disconnect();
  })
  .then(() => {
    console.log("🔌 Disconnected cleanly.");
  })
  .catch(err => {
    console.error("❌ Connect error:", err.message || err);
    process.exit(1);
  });

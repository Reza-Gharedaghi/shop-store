const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log(`Connected to DB successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("DB connection error ->", err);
    process.exit(1);
  }
}

function startServer() {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Start Running Server On Port ${port}`);
  });
}

async function run() {
  startServer();
  await connectToDb();
}

run();

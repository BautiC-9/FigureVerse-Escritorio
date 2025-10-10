//con require
const express = require ("express");
const cors = require ("cors");
const helmet = require ("helmet");
const dotenv = require ("dotenv");
const { syncModels } = require("./models");
const routes = require("./routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/health", (req, res) => res.json({ status: "Node API OK" }));

app.use("/api", routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await syncModels();
  console.log(`🚀 Node API en http://localhost:${PORT}`);
});


const express = require ("express");
const app = express();

const cors = require("cors");


require("dotenv").config();
console.log(process.env);


app.use(express.json());


app.use(express.static("public"));


app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello, World!");
});


app.post("/", (req, res) => {
  res.send("Received the data successfully!");
  
});


const videosRoutes = require("./routes/videos");


app.use("/videos", videosRoutes);


const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


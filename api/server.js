const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { setupRoutes } = require("./routes/index");

const connection = require("./db-config");
const app = express();

const PORT = process.env.PORT || 4000;

connection.connect((err) => {
  if (err) {
    console.log("Error connceting : " + err.stack);
  } else {
    console.log(
      "Connected to databases with threadId : " + connection.threadId
    );
  }
});

const corsOptions = {
  origin: "https://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

app.listen(PORT, () => {
  console.log("Server is running on port : " + PORT);
});

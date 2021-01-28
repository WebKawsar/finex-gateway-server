const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const ObjectId = require("mongodb").ObjectId;
const fs = require("fs-extra");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2izr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const app = express();
app.use(express());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("services"));
const port = 8080;


// Root url api
app.get("/", (req, res) => {
  res.send("Welcome to Finex Gateway Server");
});


client.connect((err) => {

  // Finex Gateway Colletions
  const puchasesCollection = client.db(`${process.env.DB_NAME}`).collection("purchases");
  const SellsCollection = client.db(`${process.env.DB_NAME}`).collection("sells");




  // User purchase Coin
  app.post("/pruchase", (req, res) => {

    const data = req.body;
    puchasesCollection.insertOne(data)
    .then((result) => {

      res.send(result.insertedCount > 0);
    });

  });



  // User Sell Coin
  app.post("/sells", (req, res) => {

    const data = req.body;
    SellsCollection.insertOne(data)
    .then((result) => {

      res.send(result.insertedCount > 0);
    });

  });




  console.log("Database Connected");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

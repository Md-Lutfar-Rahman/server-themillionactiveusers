const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require('cors')

const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
app.use(cors())
app.use(express.json());

async function run() {
  const client = new MongoClient(DB_CONNECTION_STRING);

  try {
    await client.connect();
    const db = client.db("themillionactiveusers");
    const productColl = db.collection("pixels");
    const usersColl = db.collection("users");
   
   
   
    app.get("/", (req, res) => {
      res.send("Home");
    });

    //products document
    app.get("/pixels", async (req, res) => {
      try {
        const result = await productColl.find({}).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.get("/pixels/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await productColl.findOne({ _id: ObjectId(id) });
        if (!result) {
          res.status(404).send({ error: "Product not found" });
        } else {
          res.status(200).send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.post("/pixels", async (req, res) => {
      try {
        const createdData = req.body;
        const result = await productColl.insertOne(createdData);
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.delete("/pixels/:id", async (req, res) => {
      try {
        const deletedId = req.params.id;
        const result = await productColl.deleteOne({
          _id: ObjectId(deletedId),
        });
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.put("/pixels/:id", async (req, res) => {
      try {
        const getId = req.params.id;
        const updatedDocument = req.body;
        const result = await productColl.updateOne(
          { _id: ObjectId(getId) },
          { $set: updatedDocument }
        );
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    //   users document
    app.get("/users", async (req, res) => {
      try {
        const result = await usersColl.find({}).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.get("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersColl.findOne({ _id: ObjectId(id) });
        if (!result) {
          res.status(404).send({ error: "Product not found" });
        } else {
          res.status(200).send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.post("/users/register", async (req, res) => {
      try {
        const createdData = req.body;
        createdData.role = "user";
        console.log(createdData)
        const result = await usersColl.insertOne(createdData);
        console.log(result)

        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.delete("/users/:id", async (req, res) => {
      try {
        const deletedId = req.params.id;
        const result = await usersColl.deleteOne({ _id: ObjectId(deletedId) });
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.put("/users/:id", async (req, res) => {
      try {
        const getId = req.params.id;
        const updatedDocument = req.body;
        const result = await usersColl.updateOne(
          { _id: ObjectId(getId) },
          { $set: updatedDocument }
        );
        res.status(200).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("🌎 Database is connected");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.error);

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
app.use(cors());
app.use(express.json());

async function run() {
  const client = new MongoClient(DB_CONNECTION_STRING);

  try {
    await client.connect();
    const db = client.db("products"); // Use the correct database name 'products'
    
    // Collection for items (products)
    const productColl = db.collection("items"); // Use the 'items' collection inside the 'products' database
    const usersColl = db.collection("users");  // Assuming users collection remains the same

    app.get("/", (req, res) => {
      res.send("Welcome to the Product API");
    });

    // Products Endpoints

    // Get all products
    app.get("/products", async (req, res) => {
      try {
        const result = await productColl.find({}).toArray();
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get a specific product by ID
    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await productColl.findOne({ _id: ObjectId(id) });
        if (!result) {
          res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Create a new product
    app.post("/products", async (req, res) => {
      try {
        const newProduct = req.body;
        const result = await productColl.insertOne(newProduct);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Delete a product by ID
    app.delete("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await productColl.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount === 0) {
          res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json({ message: "Product deleted" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Update a product by ID
    app.put("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedProduct = req.body;
        const result = await productColl.updateOne(
          { _id: ObjectId(id) },
          { $set: updatedProduct }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ error: "Product not found" });
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Users Endpoints

    // Get all users
    app.get("/users", async (req, res) => {
      try {
        const result = await usersColl.find({}).toArray();
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get a specific user by ID
    app.get("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersColl.findOne({ _id: ObjectId(id) });
        if (!result) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Register a new user
    app.post("/users/register", async (req, res) => {
      try {
        const newUser = req.body;
        newUser.role = "user";
        const result = await usersColl.insertOne(newUser);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Delete a user by ID
    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await usersColl.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json({ message: "User deleted" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Update a user by ID
    app.put("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedUser = req.body;
        const result = await usersColl.updateOne(
          { _id: ObjectId(id) },
          { $set: updatedUser }
        );
        if (result.matchedCount === 0) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("🌎 Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

run().catch(console.error);

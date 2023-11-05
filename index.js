const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// libraryManagement
// yaeCi4tYLhPEd3v9

const uri =
  "mongodb+srv://libraryManagement:yaeCi4tYLhPEd3v9@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const categoryBooksCollection = client
      .db("LibraryManagement")
      .collection("categoryBooks");
    const booksCollection = client.db("LibraryManagement").collection("books");

    //post single book
    app.post("/books", async (req, res) => {
      const newBook = req.body;
      console.log(newBook);

      const result = await booksCollection.insertOne(newBook);
      res.send(result);
    });

    // get all book
    app.get("/books", async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

     // update one book
     app.put("/books/:id", async (req, res) => {
      const id = req.params.id;

      console.log("update id : ", id);

      const filter = { _id: new ObjectId(id) };

      const options = { upsert: true };

      const updatedBook = req.body;

      //const newProduct = { UserName, userEmail, photo, productName, bandName, type, price, shortDescription, rating }

      const book = {
        $set: {
          // userName: updatedProduct.UserName,
          // userEmail: updatedProduct.userEmail,
          // photo: updatedProduct.photo,

          // rating: updatedProduct.rating,

          ...updatedBook
        },
      };

      const result = await booksCollection.updateOne(
        filter,
        book,
        options
      );
      res.send(result);
    });

    //get all categories
    app.get("/categories", async (req, res) => {
      const cursor = categoryBooksCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    //get one
    // app.get("/categories/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await productsCollection.findOne(query);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("my  library server is running fast");
});

app.listen(port, () => {
  console.log(`library server is running on port : ${port}`);
});

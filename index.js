const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
      origin: ['http://localhost:5173',"https://library-cb6f7.web.app"],
      credentials: true,
  }),
)
app.use(express.json());

// libraryManagement
// yaeCi4tYLhPEd3v9
// ACCESS_TOKEN_SECRET=48925043bad6c5938f9e8d56a7812325c88997b1b1603eebc0997bf9e8bd7cf00b5a6200eaeaeea5b23b43f683602957d845df3f3caa251139ad807bad5395a8

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

// `mongodb+srv://libraryManagement:yaeCi4tYLhPEd3v9@cluster0.mjrato5.mongodb.net/?retryWrites=true&w=majority`;

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
    const borrowBooksCollection = client
      .db("LibraryManagement")
      .collection("borrowBooks");

    //post single book
    app.post("/books", async (req, res) => {
      try {
        const newBook = req.body;
        console.log(newBook);

        const result = await booksCollection.insertOne(newBook);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    //post single book for borrow
    app.post("/borrowBooks", async (req, res) => {
      try {
        const newBook = req.body;
        console.log(newBook);

        const result = await borrowBooksCollection.insertOne(newBook);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get all book
    app.get("/books", async (req, res) => {
      try {
        const cursor = booksCollection.find();
        const result = await cursor.toArray();

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get one .. get one book
    app.get("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // get all borrow books
    app.get("/borrowBooks", async (req, res) => {
      try {
        const cursor = borrowBooksCollection.find();
        const result = await cursor.toArray();

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    // update one book
    app.put("/books/:id", async (req, res) => {
      try {
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

            ...updatedBook,
          },
        };

        const result = await booksCollection.updateOne(filter, book, options);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    //get some book by category
    app.get("/booksByCategory", async (req, res) => {
      try {
        let query = {};
        if (req?.query?.categoryName) {
          query = {
            categoryName: req.query.categoryName,
          };
        }
        console.log("categoryName", query);
        const result = await booksCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    //get all categories
    app.get("/categories", async (req, res) => {
      try {
        const cursor = categoryBooksCollection.find();
        const result = await cursor.toArray();

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    //delete return book

    app.delete("/borrowBooks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const result = await borrowBooksCollection.deleteOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
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

// real a11


//  https://library-server-1hry8165t-2eg4rizve.vercel.app

//https://library-server-gh7iei1jc-2eg4rizve.vercel.app

//https://library-server-dcfa5jbzu-2eg4rizve.vercel.app

// https://a11-i2o70nkvc-2eg4rizve.vercel.app

//https://a11-pj5k18qlf-2eg4rizve.vercel.app
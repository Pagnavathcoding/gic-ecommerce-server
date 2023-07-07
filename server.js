require("dotenv").config();
const express = require("express")
const cors = require("cors");
const cookieParser = require("cookie-parser");
const UserRouter = require("./api/User.js")
const Product = require("./models/Product.js");
const User = require("./models/User.js");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", UserRouter)
// Database
mongoose.connect("mongodb+srv://pagnavath:DwJkPDv69nVcN4mU@cluster0.dl6wikn.mongodb.net/?retryWrites=true&w=majority");


app.post("/post/products", (req, res) => {
    const postProduct = {
        title: req.body.title,
        brand: req.body.brand,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
    }
    const newProduct = new Product(postProduct);
    return newProduct.save().then(data => {
        return res.json(data);
    });
});

app.get("/products", (req, res) => {
    Product.find().then(data => {
        return res.json(data);
    })
})

app.delete("/products/:id", (req, res) => {
    Product.findById(req.params.id).then(data => {
        return data.deleteOne().then(() => {
            return res.status(200).json({"delete": true});
        }).catch(err => {
            return res.status(400).json({"delete": false});
        })
    })
})
app.get("/", (req, res) => {
    return res.send("Server...")
})


app.listen(9000, () => {
    console.log(`http://localhost:${9000}`)
});

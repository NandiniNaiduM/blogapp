const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://mongo:27017/blogDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Blog = mongoose.model("Blog", BlogSchema);

app.get("/", async (req, res) => {
    let blogs = await Blog.find();

    if (blogs.length === 0) {
        await Blog.create({
            title: "My First Blog",
            content: "Hello! This blog is running with Docker and MongoDB."
        });

        blogs = await Blog.find();
    }

    res.render("index", { blogs });
});
app.post("/add-blog", async (req, res) => {

    await Blog.create({
        title: req.body.title,
        content: req.body.content
    });

    res.redirect("/");
});
app.post("/delete-blog/:id", async (req, res) => {

    await Blog.findByIdAndDelete(req.params.id);

    res.redirect("/");

});

app.listen(3000, () => {
    console.log("Server Started on Port 3000");
});
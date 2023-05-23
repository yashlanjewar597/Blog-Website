//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lod = require("lodash");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const homeStartingContent = process.env.STRT;
const aboutContent = process.env.ABT;
const contactContent = process.env.CNT;

const app = express();


async function run() {

  await mongoose.connect(process.env.URI);
  
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const blogSchema = new mongoose.Schema({
  title:String,
  body:String
});

const Blog = mongoose.model("blog", blogSchema);

var posts = [];

app.get("/", function(req, res){
  
    Blog.find().then(function(data){
    res.render("home", {posts:data});
  });
});
app.get("/about",function (req,res){
  res.render("about",{text2: aboutContent});
});
app.get("/contact", function(req,res){
  res.render("contact",{text3: contactContent});
});
app.get("/compose", function(req, res){
  res.render("compose");
});
app.get("/posts/:postName", function(req, res){
  const Name = lod.lowerCase(req.params.postName);
  Blog.find().then( function(data){
    data.forEach(function(ele){
    if (Name == lod.lowerCase(ele.title)){
      res.render("post",{postTitle:ele.title, postBody:ele.body});
    }else{
      console.log("!Match not found");
    }
  })
});
});

app.post("/", function(req, res){
  //console.log(req.body.post);
  const POST = new Blog({
    title: req.body.title,
    body : req.body.body
  });
  POST.save();
  res.redirect("/");
}
);


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

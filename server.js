const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('./config');

name = config.name;
pass = config.pass;
var url = "mongodb+srv://" + name + ":" + pass + "@email-editor.kre0j.mongodb.net/Blog";
mongoose.connect(url);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts = [];

const postSchema = new mongoose.Schema({
  title:String,
  content:String
})

const Post = mongoose.model('Post',postSchema);



app.get("/",async function(req,res){
  let posts = await Post.find();
  res.render("home",{posts:posts});

})

app.get("/about",function(req,res){
  res.render("about");
})

app.get("/contact",function(req,res){
  res.render("contact");
})


app.get("/compose",function(req,res){
  res.render("compose");
})


app.post("/compose",function(req,res){
  var post = new Post({
    title : req.body.p_title,
    content : req.body.p_body
  })
  post.save();
  res.redirect("/");
})

app.get("/posts/:str",async function(req,res){
  let title = req.params.str //_.lowerCase(req.params.str);
  Post.findOne({title:title},{content:1,_id:0})
  .then(content => res.render("post",{heading:title,data:content.content}))
  .catch(console.log("Match not found"));
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

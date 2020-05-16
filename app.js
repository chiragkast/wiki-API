//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.set('useUnifiedTopology', true);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser : true});

const articlesSchema=new mongoose.Schema({
  title: String,
  content: String
});

const Artical=mongoose.model("Artical", articlesSchema);

app.route("/articals")
   .get(function(req,res)
     {
       Artical.find(function(err, foundArticles)
       {
          //  console.log(foundArticles);
        if(!err){
           res.send(foundArticles);
         }
        else {
          res.send(err);
        }
      });
    })

    .post(function(req,res)
     {
      console.log(req.body.title);
      console.log(req.body.content);

      const newArticle=new Artical({
        title:req.body.title,
        content:req.body.content
     });

      newArticle.save(function(err)
       {
         if(!err)
          {
           res.send("successfully added new articals");
          }
         else {
          res.send(err);
          }
      });
     })

.delete(function(req,res)
 {
    Artical.deleteMany(function(err)
    {
       if(!err)
       {
         res.send("successfully delete articals");
       }
       else {
         res.send(err);
       }
    });
 });

/////////////////////////Individual Articles///////////////////////////////////

 app.route("/articals/:articalsTitle")
 .get(function(req,res)
{
  Artical.findOne({title: req.params.articalsTitle}, function(err, foundArticles)
{
  if(foundArticles)
  {
    res.send(foundArticles);
  }
  else {
    res.send("no artical is matching that title");
  }
});
})

.put(function(req,res)
{
  Artical.update(
    {title: req.params.articalsTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err)
    {
      if(!err)
      {
        res.send("successfully updated");
      }
    });
})

.patch(function (req,res)
{
  Artical.update(
    {title: req.params.articalsTitle},
    {$set: req.body},
    function(err)
    {
      if(!err)
      {
        res.send("successfully updated");
      }
      else {
        res.send(err);
      }
    });
})

.delete(function(req,res)
{
  Artical.deleteOne(
    {title: req.params.articalsTitle},
    function(err)
    {
      if(!err)
      {
        res.send("deleted successfully");
      }
      else {
        res.send(err);
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

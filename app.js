const express=require("express");
const port=process.env.PORT || 3000;
const Bookdata=require("./src/model/Bookdata");
const Authordata=require("./src/model/Authordata");
const cors=require('cors');
var jwt = require('jsonwebtoken');
var bodyparser=require('body-parser');
const app= new express();


app.use(cors());
app.use(bodyparser.json());
var username= 'admin@gmail.com';
const password="123456";

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

app.get("/books",function(req,res){
      Bookdata.find()
      .then(function(books){
        res.send(books);
      });
    });

app.post("/addbook",verifyToken,function(req,res){
         console.log(req.body);
         var book={
          title :req.body.book.title,
          author :req.body.book.author,
          genre :req.body.book.genre,
          about :req.body.book.about,
          image :req.body.book.image,
         } 
         var book=new Bookdata(book);
         book.save();
    });
    
app.post("/login",function(req,res){
      console.log(req.body);
      var userData=req.body;
      if (username !==userData.username) {
            res.status(401).send('Invalid Username')
            console.log("req.user");
          }
       else if (password !==userData.password) {
            res.status(401).send('Invalid Password')
            console.log("req.pass");
          }
          else{
           let payload={subject:username+password}
           let token=jwt.sign(payload,'secretKey')
           res.status(200).send({token})
          }   
})

app.get("/book/:id",function(req,res){
      const id = req.params.id; 
      Bookdata.findOne({"_id":id})
      .then((book)=>{
         res.send(book);
      })
    });

    app.put('/updatebook',verifyToken,(req,res)=>{
      id=req.body._id,
      title= req.body.title,
      author = req.body.author,
      genre = req.body.genre,
      about = req.body.about,
      image = req.body.image,
     Bookdata.findByIdAndUpdate({"_id":id},
                                  {$set:{"title":title,
                                  "author":author,
                                  "genre":genre,
                                  "about":about,
                                  "image":image
                              }})
     .then(function(){
         res.send();
     });
   });

   app.delete("/deletebook/:id",verifyToken,(req,res)=>{
   
      id = req.params.id;
      Bookdata.findByIdAndDelete({"_id":id})
      .then(()=>{
          console.log('success')
          res.send();
      });
    });
    app.get("/authors",function(req,res){
      Authordata.find()
      .then(function(authors){
        res.send(authors);
      });
    });

    app.post("/addauthor",verifyToken,function(req,res){
      console.log(req.body);
      var author={
       title :req.body.author.title,
       about :req.body.author.about,
       image :req.body.author.image,
      } 
      var author=new Authordata(author);
      author.save();
 });
 app.get("/author/:id",function(req,res){
      const id = req.params.id; 
      Authordata.findOne({"_id":id})
      .then((author)=>{
         res.send(author);
      })
    });

    app.put('/updateauthor',verifyToken,(req,res)=>{
      id=req.body._id,
      title= req.body.title,
      about = req.body.about,
      image = req.body.image,
     Authordata.findByIdAndUpdate({"_id":id},
                                  {$set:{"title":title,
                                  "about":about,
                                  "image":image
                              }})
     .then(function(){
         res.send();
     });
   });

   app.delete("/deleteauthor/:id",verifyToken,(req,res)=>{
   
      id = req.params.id;
      Authordata.findByIdAndDelete({"_id":id})
      .then(()=>{
          console.log('success')
          res.send();
      });
});


app.listen(port,function(){
  console.log("Server Ready at " +port);
});
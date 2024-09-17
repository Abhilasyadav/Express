const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT  = 3000;

app.use((req,res,next)=>{
    console.log("middleware will be detected");
    next();
})

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req,res)=>{
    fs.readdir(`./files`,function(err,files){
        res.render("index",{files:files});
    })
})

// app.get("/login/:username",(req,res)=>{
//     res.send(`welcome ${req.params.username}`);
// })

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.description,function(err){
        res.redirect("/")
    });
});

app.get("/files/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err){
            err.send("Error reading file..");
        }
        res.render("show",{filename: req.params.filename, filedata: filedata});
    })
})

app.get("/edit/:filename",(req,res)=>{
    res.render("edit",{filename: req.params.filename});
});

app.post("/edit", (req,res)=>{
    console.log(req.body.Previous);
    fs.rename(`./files/${req.body.Previous}`,`./files/${req.body.new}`,(err)=>{
        res.redirect("/"); 
    })
})

app.listen(PORT,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})
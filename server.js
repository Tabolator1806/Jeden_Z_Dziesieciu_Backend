import express from 'express';
import path from 'path'
import hbs from 'express-handlebars'
import cors from 'cors'
import formidable from 'formidable'
import fs from 'fs'
const __dirname = import.meta.dirname
const uploadPath = path.join(__dirname,"static","upload")
// const express = require('express')
// const path = require('path')
// const hbs = require('express-handlebars')
const app = express();
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.engine('hbs', hbs.engine({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')




let playerlist = [
    {id:0,name:"admin",lifes:3,points:0}
]

app.get("/", (req, res) => {
    res.render("login.hbs")
})
app.post("/login", (req, res) => {
    console.log(req.body)
    let form = formidable({})
    form.keepExtentions = true
    form.multiples=true
    form.uploadDir = uploadPath
    form.parse(req,(err, fields, files)=>{
        fs.rename(files.image[0].filepath,path.join(uploadPath,`${fields.name[0]}.png`),(err)=>{
            if (err) console.log(err)
        })
        playerlist.push({id:playerlist.length,name:fields.name[0],lifes:3,points:0})
        res.render("button.hbs",{name:fields.name[0]})
    })
})
app.post("/buttonClicked",(req,res)=>{
    console.log(req.body.name)
    res.render("button.hbs",{name:req.body.name})
})

app.get("/playerList",(req,res)=>{
    res.json(playerlist)
})
app.use(express.static('static'))
app.listen(port, () => {
    console.log(`Server works on port ${port}`)
})
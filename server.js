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
    {id:0,name:"admin",lifes:3,points:0},
    {id:1,name:"Tadeusz",lifes:3,points:0},
    {id:2,name:"Sznuk",lifes:3,points:0},
]
const adminpassword="123"

app.get("/", (req, res) => {
    res.render("login.hbs")
})
app.post("/login", (req, res) => {
    let form = formidable({})
    form.keepExtentions = true
    form.multiples=true
    form.uploadDir = uploadPath
    form.parse(req,(err, fields, files)=>{
        fs.rename(files.image[0].filepath,path.join(uploadPath,`${fields.name[0]}.png`),(err)=>{
            if (err) console.log(err)
        })
        playerlist.push({id:playerlist.length,name:fields.name[0],lifes:3,points:0})
        res.render("button.hbs",{id:playerlist.length})
    })
})
app.post("/buttonClicked",(req,res)=>{
    const id = Number(req.body.id) -1
    console.log(playerlist[id])
})

app.get("/playerList",(req,res)=>{
    res.json(playerlist)
})
app.get("/admin",(req,res)=>{
    res.render("roundEnter.hbs")
})
app.get("/adminMenu",(req,res)=>{
    if (req.query.password==adminpassword){
        res.render("adminMenu.hbs",{playerlist:playerlist})
    }
})
app.post("/takeLife",(req,res)=>{
    playerlist[req.body.id].lifes-=1
    res.render("adminMenu.hbs",{playerlist:playerlist})
})

app.use(express.static('static'))
app.listen(port, () => {
    console.log(`Server works on port ${port}`)
})
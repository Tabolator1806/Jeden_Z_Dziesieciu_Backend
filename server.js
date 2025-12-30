import express from 'express';
import path from 'path'
import hbs from 'express-handlebars'
import cors from 'cors'
import formidable from 'formidable'
import fs from 'fs'
import qrcode from 'qrcode'
import pytanka from './static/pytanka.json' with { type: "json" };
let pytania = pytanka.pytania
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
]
const adminpassword="123"
let endPoll = false

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
        playerlist.push({id:playerlist.length,name:fields.name[0],lives:3,points:0,button:false})
        res.render("button.hbs",{id:playerlist.length-1})
    })
})
app.post("/buttonClicked",(req,res)=>{
    const id = Number(req.body.id)
    if (!endPoll){
        endPoll = true
        playerlist[id].button=true
        console.log(playerlist[id].name)

        // if (!playerlist[id].button){
        //     playerlist[id].button=true
        // }
    }
    console.log(playerlist[id].name, playerlist[id].button, endPoll)
    res.send("ok")
})
app.get("/addQuestions",(req,res)=>{
    if(req.query.tresc!=undefined){
        // console.log(`,
        // {
        //     "nr":${pytania.length+1},
        //     "kategoria":"${req.query.kategoria}",
        //     "tresc":"${req.query.tresc}",
        //     "poprawna odp":"${req.query["poprawna odp"]}"
        // }`)
        fs.appendFile("./static/pytanka2.json",`,
        {
            "nr":${pytania.length+1},
            "kategoria":"${req.query.kategoria}",
            "tresc":"${req.query.tresc}",
            "poprawna odp":"${req.query["poprawna odp"]}"
        }`,(err)=>{
            if(err) console.log(err)
        })
        pytania.push({
            nr:pytania.length+1,
            kategoria:req.query.kategoria,
            tresc:req.query.tresc,
            'poprawna odp':req.query["poprawna odp"]
        })
    }
    // console.log(pytania)
    // console.log(pytanka)
    res.render("pytanie.hbs")
})
app.post("/buttonUnclicked",(req,res)=>{
    console.log("-----------------------------LOBOTOMIAAAAAAAAAAA----------------------------------------------")
    endPoll = false
    playerlist.forEach(player=>{
        player.button=false
    })
    res.send("ok")
})
app.get("/generateQRCode",async (req,res)=>{
    const url = "http://83.27.64.116:3000"
    const qrCodeImage = await qrcode.toDataURL(url);
    res.send(qrCodeImage);
})
app.get("/playerList",(req,res)=>{
    res.json(playerlist)
})
app.get("/admin",(req,res)=>{
    res.render("roundEnter.hbs")
})
app.get("/adminMenu",(req,res)=>{
    if (req.query.password==adminpassword){
        res.render("adminMenu.hbs",{playerlist:playerlist,pytania:pytania})
    }
})
app.post("/takeLife",(req,res)=>{
    playerlist[req.body.id].lives-=1
    res.send("ok")
})
app.post("/kickPlayer",(req,res)=>{
    playerlist = playerlist.filter((player)=> player.id!=req.body.id)
    res.send("ok")
})
app.get("/playerStat",(req,res)=>{
    const stat = req.query.stat
    const id = req.query.id
    if (stat=="lives") res.send(playerlist[id].lives)
    if (stat=="button") res.send(playerlist[id].button)
})
app.get("/setSound",(req,res)=>{
    res.send("")
})
app.get("/getQuestions",(req,res)=>{
    res.json(pytania)
})
app.use(express.static('static'))
app.listen(port, () => {
    console.log(`Server works on port ${port}`)
})
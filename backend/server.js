import express, { urlencoded } from 'express'
import cors from 'cors'
import dbmodel from './dbmodel.js'
import crypto from 'crypto'

const app = express()
app.use(cors({
    origin:["http://localhost:5173"]
}))
app.use(express.json())

const genstore = async(url)=>{
    console.log(url)
    const invalid = false
    if(url.includes("localhost:8080")||url.includes("127.0.1:8080")||!url.includes("http")){
         return {success:false, invalid:true}
    }
    const short_code = crypto.randomBytes(4).toString('hex')
    console.log("short_code: ",short_code)
    const exists = await dbmodel.findOne({shortened:short_code})
    if(exists==null){
        await dbmodel.insertOne({url:url,shortened:short_code})
    return {success:true,resurl:`http://localhost:8080/${short_code}`,invalid:invalid}
    }
    else{
       return genstore(url)
    }
}

const normalise = (url)=>{
    url = url.toLowerCase()
    url = url.trim()
    if(url[url.length-1]==='/'){
        url  = url.slice(0,-1)
    }
    return url
}

app.post("/convert",async(req,res)=>{
    const url = normalise(req.body.url)
    console.log("normal: ",url)
    const exists = await dbmodel.findOne({url:url})
    if(exists===null){
        const response = await genstore(url)
    console.log("response: ",response)
    res.json(response)
    }
    else{
        res.json({success:true,resurl:`http://localhost:8080/${exists.shortened}`,invalid:false})
    }
})

app.get("/:code",async(req,res)=>{
    const urlcode = req.params.code 
    const f = await dbmodel.findOne({shortened:urlcode})
    if(f!=null){
        res.redirect(f.url)
    }
    else{
        res.status(404).send("The entered URL Does not exist")
    }
})

app.listen(8080,()=>{
    console.log(`server live at: http://localhost:8080`)
})
/*
this will be the entry point for the server  
*/

const express = require(`express`);
const app = express()
const port = 3000; 

app.get(`/`, (req, res) => {
    res.send("Hello World")
})

app.listen(port, () =>{
    console.log(`port: ${port}`)
})
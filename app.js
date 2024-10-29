/*
this is the server code
*/

//initialize express 
const express = require(`express`); 
const app = express()
const port = 3000; //define port 

//define route
app.get(`/`, (req, res) => {
    res.send("Hello World")
})

//start server 
app.listen(port, () =>{
    console.log(`port: ${port}`)
})
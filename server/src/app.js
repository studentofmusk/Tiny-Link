const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Setup middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));


const links_route = require("./routes/links.route");



// Client
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/api/healthz', (req, res)=>{
    res.status(200).json({
        ok:true,
        version:'1.0'
    });
})
app.use('/', links_route);


module.exports = app;
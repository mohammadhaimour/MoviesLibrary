'use strict'
const express = require('express');//require the package
const app = express();//create an express app 
const PORT = 3000;
const movieData = require('./Movie Data/data.json');



//route
app.listen(PORT, handleListener);
app.get('/favorite', handleFavorite);
app.get('/', handleData);
app.use('/error', (req, res) => res.send(error()));
app.get('*', handelNotFound);




//function
function handleListener() {
    console.log(`i am a live on port ${PORT}`);
}

function handleFavorite(reg, res) {
    res.send("Welcom to Favorit page");
}

function handleData(req, res) {
    // console.log(movieData);
    // res.send("Welcom to Favorit page1");
    let result = [];
    let newMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
    result.push(newMovie);
    res.json(result);
}

function handelNotFound(req, res) {

    res.status(404).send("Not found");

}


app.use(function (err, req, res, text) {
    console.log(err.stack);
    res.type('taxt/plain');
    res.status(500);
    res.send("Sorry something wrong");
});


// app.use(function (req, res, text) {
//     res.status(404);
//     res.type('taxt/plain');
//     res.send("not found");
// });




//constructor
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

}
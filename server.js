'use strict'
const express = require('express');//require the package
const cores = require('cors');
const axios = require('axios').default;
require('dotenv').config();
const PORT = 3005;
const apiKey = process.env.API_KEY;
const app = express();//create an express app 
app.use(cores());
const movieData = require('./Movie Data/data.json');



//route
app.listen(PORT, handleListener);
app.get('/favorite', handleFavorite);
app.get('/', handleData);
app.use('/error', (req, res) => res.send(error()));
// app.get('*', handelNotFound);
//--------------
app.get('/trending', handleTrending);
app.get('/search', handleSearch);
app.get('/id', handleId);
app.get('/image', handleImage);
app.get('/similar', handleSimilar);

//function2
function handleTrending(req, res) {

    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    // const url = `https://api.themoviedb.org/3/trending/all/week?api_key=9bab47b08930091ff7167a089bbdfe4a&language=en-US`;
    //    axios.get().then().catch();
    axios.get(url)
        .then((result) => {
            // console.log("11", result);
            // console.log(result.data.results);
            let trender = result.data.results.map(trend => {
                return new Trend(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview);
            })
            res.json(trender);

        })
        .catch((error) => {
            console.log(error);
            res.send("Inside catch");
        });

}

function handleSearch(req, res) {
    let movName = req.query.movName;
    // const url = `https://api.themoviedb.org/3/search/movie?api_key=9bab47b08930091ff7167a089bbdfe4a&language=en-US&query=${movName}&page=2`;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movName}&page=2`;
    //    axios.get().then().catch();
    axios.get(url)
        .then(result => {
            // console.log("11", result);
            // console.log(result.data.results);
            res.json(result.data.results);

        })
        .catch((error) => {
            console.log(error);
            res.send("Inside cach");
        });
}

function handleId(req, res) {
    let id = req.query.id;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&page=2`;
    // const url = `https://api.themoviedb.org/3/movie/${id}?api_key=9bab47b08930091ff7167a089bbdfe4a&language=en-US&page=2`;

    //    axios.get().then().catch();
    axios.get(url)
        .then(result => {
            // console.log("11", result);
            // console.log(result.data.results);
            // console.log(result.data);
            res.json(result.data);


        })
        .catch((error) => {
            console.log(error);
            res.send("Inside cach");
        });
}
function handleImage(req, res) {
    let id = req.query.id;

    const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}&language=en-US`;
    // const url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=9bab47b08930091ff7167a089bbdfe4a&language=en-US`;

    //    axios.get().then().catch();
    axios.get(url)
        .then(result => {
            // console.log("11", result);
            // console.log(result.data.results);
            // console.log(result.data);
            res.json(result.data);

        })
        .catch((error) => {
            console.log(error);
            res.send("Inside cach");
        });
}

function handleSimilar(req, res) {
    let id = req.query.id;
    const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}&language=en-US&page=1`;

    // const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=9bab47b08930091ff7167a089bbdfe4a&language=en-US&page=1`;

    //    axios.get().then().catch();
    axios.get(url)
        .then(result => {
            // console.log("11", result);
            // console.log(result.data.results);
            res.json(result.data.results);

        })
        .catch((error) => {
            console.log(error);
            res.send("Inside cach");
        });
}








//function1
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

function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
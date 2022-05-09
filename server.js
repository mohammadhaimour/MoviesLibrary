//-
'use strict'
const url = "postgres://mohammad:0000@localhost:5432/movie_db";

const express = require('express');//require the package
const cores = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios').default;
require('dotenv').config();
const PORT = 3000;
const apiKey = process.env.API_KEY;
const { Client } = require('pg');
const client = new Client(url);
const app = express();//create an express app 
app.use(cores());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const movieData = require('./Movie Data/data.json');


//RRR
//route
// app.listen(PORT, handleListener);
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
//-----------
app.post("/addMovie", handelAdd);
app.get("/getMovies", handelGet);
app.get("/getMovies/:id", handelGet2);
app.put("/UPDATE/:id", handleUpdate);   // UPDATE with params
app.delete("/DELETE", handleDelete);   // DELETE with quey
app.use(handelError);


//function3
function handelAdd(req, res) {
    // console.log(req.body);
    // res.send("adding to db");
    // let name = req.body.title;
    // let time = req.body.time;
    // let summury = req.body.summary;
    // let image = req.body.image;
    const { name, time, summury, image } = req.body;
    let sql = 'INSERT INTO movie_tab(name,time,summary,image) VALUES($1, $2, $3, $4) RETURNING *;';
    let values = [name, time, summury, image];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch();

}

function handelGet(req, res) {
    let sql = 'SELECT * from movie_tab;';
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handelError(err, req, res);
    });

}
function handelGet2(req, res) {
    const { id } = req.params;
    let sql = 'SELECT * from movie_tab WHERE id = $1;';
    let value = [id];
    client.query(sql, value).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handelError(err, req, res);
    });

}


function handleUpdate(req, res) {
    const { id } = req.params;
    const { name, time, summary, image } = req.body;

    let sql = `UPDATE movie_tab  SET name = $1, time = $2, summary = $3, image = $4 WHERE id = $5 RETURNING *;`
    let values = [name, time, summary, image, id];

    client.query(sql, values).then(result => {
        console.log(result.rows);
        res.send("working");
        // res.json(result.rows[0]);
    }

    ).catch();

}

// http://localhost:3000/DELETE?id=1
function handleDelete(req, res) {
    const { id } = req.query
    let sql = 'DELETE FROM movie_tab WHERE id=$1;'
    let value = [id];
    client.query(sql, value).then(result => {
        console.log(result);
        res.send("deleted");
    }
    ).catch(error => {
        console.log(error);
    })
}





function handelError(error, req, res) {
    res.status(500).send(error);

}

// after connection to db, start the server
client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
});






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
// function handleListener() {
//     console.log(`i am a live on port ${PORT}`);
// }

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



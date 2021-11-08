const express = require ("express");
const app = express();
const PORT = 5000; 
const fs = require ("fs");
app.use(express.json()) 

 

function addToMovies(Movies){
    fs.writeFile("./movies.json", JSON.stringify(Movies), ()=>{
        console.log("DONE!");
    })
}

///// Display all movies (all data) && specific Movie by ID  GET/Read    
app.get("/movies", (req,res)=>{
     const movieId = req.body.id;
    fs.readFile("./movies.json",(err , data)=>{
        const movies = JSON.parse(data, toString());
// console.log(Movies);
    const Movies = movies.filter((movie) => movie.isDeleted === false);
if (movieId){
    const found = Movies.find((movie) => movie.id == movieId && movie.isDeleted === false);
    res.status(200).json(found)
} else {
    res.status(200).json(Movies)
}

})})



// ////// Display Favorite movies GET/Read   
app.get("/favorite",(req,res)=>{
    fs.readFile("./movies.json", (err, data) => {
      const movies = JSON.parse(data, toString());
      const fav = movies.filter((movie) => movie.isFav === true);
      if (fav) {
        res.status(200).json(fav);
      } else {
        res.status(404).send("There Is No Favorite Movies");
      }
    });
    })
  


//// ADD Movies POST/Create   
app.post("/add",(req,res)=>{
    const newMovie = req.body
    fs.readFile("./movies.json", (err, data) => {
      const Movies = JSON.parse(data, toString());
      Movies.push({
        id: Movies.length,
        name: newMovie,
        isFav: false,
        isDeleted: false,
      });
      addToMovies(Movies);
      res.status(201).json("movie has been added");
    });
})


////// Delete specific movie by ID (DELETE)
app.delete("/deleted", (req,res)=>{
    const deletedMovie = req.body.id;
    fs.readFile("./movies.json", (err, data) => {
      const Movies = JSON.parse(data, toString());
      const del = Movies.find((movie) => {
        return movie.id == deletedMovie;
      });
      const index = Movies.indexOf(del);
      del.isDeleted = true;
      if (del) {
        res.send("movie is deleted");
          addToMovies(Movies);
      } else {
        res.status(404).send("There is No Movie");
      }
    });
  
    })
    
     

///// Modified specific movie 
app.put("/edit" , (req,res)=>{
    const id = req.body.id;
    fs.readFile("./movies.json", (err, data) => {
      const Movies = JSON.parse(data, toString());
const edit = Movies.find((movie) => {
  return(movie.id == id)
});
const index = Movies.indexOf(edit);
// console.log(index);
index.isFav = true;
if(edit){
    res.status(200).json("the movie has been added to favorite");
    addToMovies(Movies);
} else { 
res.status(200).json("there is no movie");
}

})})



app.listen(PORT , ()=>{
    console.log(`this server started on port: ${PORT}`);
})
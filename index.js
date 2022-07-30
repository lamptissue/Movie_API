const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  fs = require("fs"), // import built in node modules fs and path
  path = require("path"),
  uuid = require("uuid");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require("mongoose");
const Models = require("./model.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myflixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let users = [
  {
    id: 1,
    name: "Paul",
    favouriteMovie: [],
  },
  {
    id: 2,
    name: "Jane",
    favouriteMovie: ["Toy Story"],
  },
];

let movies = [
  {
    title: "The Shawshank Redemption",
    year: "1994",
    genre: {
      name: "Drama",
    },
    director: "Frank Darabont",
  },
  {
    title: "Lord of the Rings:The Return of the King",
    year: "2003",
    genre: {
      name: "Fantasy",
    },
    director: "Peter Jackson",
  },
  {
    title: "The Godfather",
    year: "1972",
    genre: {
      name: "Crime",
    },
    director: "Francis Ford Coppola",
  },
  {
    title: "The Dark Knight",
    year: "2008",
    genre: {
      name: "Action",
    },
    director: "Christopher Nolan",
  },
  {
    title: "The Godfather: Part II",
    year: "1974",
    genre: {
      name: "Crime",
    },
    director: "Francis Ford Coppola",
  },
  {
    title: "12 Angry Men",
    year: "1957",
    genre: {
      name: "Crime",
    },
    director: "Sidney Lumet",
  },
  {
    title: "Schindler's List",
    year: "1993",
    genre: {
      name: "History",
    },
    director: "Steven Spielberg",
  },
  {
    title: "Pulp Fiction",
    year: "1994",
    genre: {
      name: "Thriller",
    },
    director: "Quentin Tarantino",
  },
  {
    title: "The Good, the Bad and the Ugly",
    year: "1966",
    genre: {
      name: "Western",
    },
    director: "Sergio Leone",
  },
  {
    title: "Forrest Gump",
    year: "1994",
    genre: {
      name: "Comedy Drama",
    },
    director: "Robert Zemeckis",
  },
];

// Get all users

app.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get user by username
app.get("/users/:username", (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ - Shows a list of all the movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ - Shows a certain movie title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ - Shows a specific genre
app.get("/movies/genre/:name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.name })
    .then((movies) => {
      res.json(movies.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//READ - Shows director
app.get("/movies/directors/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then((movies) => {
      res.json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Add user

app.post("/users", (req, res) => {
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + "already exists");
      } else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Update user's info by username
app.put("/users/:username", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// add a movie to user's list of favourites
app.post("/users/:username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $push: { FavouriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Delete a user by username
app.delete("/users/:username", (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//DELETE - Delete movie title from users array
app.delete("/users/:username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $pull: { FavouriteMovies: req.params.MovieID },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my movie website!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use(express.static("public"));

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

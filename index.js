const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  fs = require("fs"), // import built in node modules fs and path
  path = require("path"),
  uuid = require("uuid"),
  bodyParser = require("body-parser");

app.use(bodyParser.json());

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

//UPDATE - User
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

//CREATE - New users
app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Users need name");
  }
});

//CREATE - Add movie title to user
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favouriteMovie.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});

//DELETE - Delete movie title from users array
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favouriteMovie = user.favouriteMovie.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send("No such user");
  }
});

//DELETE - Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`User ${id} has been deleted`);
  } else {
    res.status(400).send("No such user");
  }
});

//READ - Shows a list of all the movies
app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

//READ - Shows a certain movie title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
});

//READ - Shows a specific genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre.name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});

//READ - Shows director
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director === directorName
  ).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("No such genre");
  }
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

const express = require('express'),
morgan = require('morgan'),
fs = require('fs'), // import built in node modules fs and path 
path = require('path');

const app = express();

let topMovies = [
    {
      title: 'The Shawshank Redemption ',
      year: '1994'
    },
    {
      title: 'Lord of the Rings:The Return of the King',
      year: '2003'
    },
    {
      title: 'The Godfather',
      year: '1972'
    },
    {
        title: 'The Dark Knight',
        year: '2008'
      },
      {
        title: 'The Godfather: Part II',
        year: '1974'
      },
      {
        title: '12 Angry Men',
        year: '1957'
      },
      {
        title: 'Schindler\'s List',
        year: '1993'
      },
      {
        title: 'Pulp Fiction',
        year: '1994'
      },
      {
        title: 'The Good, the Bad and the Ugly',
        year: '1966'
      },
      {
        title: 'Forrest Gump',
        year: '1994'
      }
  ];
  
  // create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));
  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my movie website!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
  app.use(express.static('public'));
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
  app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
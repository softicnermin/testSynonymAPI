const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3000;
const synonymRouter = require('./routes/synonymRouter');

app.use('/api', synonymRouter);
app.get('/', (req, res) => {
  res.send('Welcome to my Synonyms API!');
});

app.listen(port, () => console.log(`Running on port ${port}`));

module.exports = app;

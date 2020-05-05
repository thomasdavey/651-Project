const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const port = 3001;
app.use(express.json());

const url = 'mongodb://localhost:27017';
const mongo = new MongoClient(url, { useUnifiedTopology: true });

mongo.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Successfully connected to server!');
});

const db = mongo.db('test');

app.get('/get', (req, res) => {
  db.collection('notes')
    .find()
    .toArray()
    .then((docs) => {
      if(docs) {
        res.send(docs);
      } else {
        res.send([]);
      }
    })
    .catch(console.log);
});

app.post('/submit', (req, res) => {
  db.collection('notes')
    .insertOne({
      title: req.body.noteTitle,
      note: req.body.note,
    })
    .then((docs) => {
      console.log('Note', docs.insertedId, 'added!');
      res.send('Note added!');
    })
    .catch(console.log);
});

app.post('/update', (req, res) => {
  const updater = {
    $set: {
      title: req.body.noteTitle,
      note: req.body.note,
    }
  };
  
  db.collection('notes')
    .findOneAndUpdate({
      _id: ObjectID.createFromHexString(req.body.id),
    }, updater)
    .then((docs) => {
      console.log('Note updated!');
      res.send('Note updated!');
    })
    .catch(console.log);
});

app.post('/remove', (req, res) => {
  db.collection('notes')
    .findOneAndDelete({
      _id: ObjectID.createFromHexString(req.body.id),
    })
    .then((docs) => {
      console.log('Note deleted!');
      res.send('Note deleted!');
    })
    .catch(console.log);
});

app.listen(port, () => console.log(`Server on port ${port}!`));
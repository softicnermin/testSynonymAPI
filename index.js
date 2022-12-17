const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const router = express.Router();
app.use('/api', router);
const synonymsTable = new Map();

router.route('/synonym')
  .post((req, res) => {
    const { word, newSynonym } = req.body;

    // Is there already a synonym for this word
    const existingWordSynonyms = synonymsTable.get(word);

    if (existingWordSynonyms && existingWordSynonyms.has(newSynonym)) {
      console.log('Synonym already saved!!!');
      res.sendStatus(201);
      return;
    }
    // If it's an existing word add the new
    // synonym if not already present
    if (existingWordSynonyms) {
      console.log('-------  START ------');
      console.log('Existing synonyms for this word:');
      console.log(existingWordSynonyms);
      // 1. Add the entry for the newSynony word
      // It consists of the existing synonyms for the lookup word and that word itself
      const newEntrySynyms = new Set(existingWordSynonyms);
      newEntrySynyms.add(word);
      synonymsTable.set(newSynonym, newEntrySynyms);
      console.log(newEntrySynyms);

      console.log('-----2-----');

      // Add this synonym to the other synonyms due to transitive rule
      // If "B" is a synonym to "A" and "C" a synonym to "B", then "C" should automatically,
      // by transitive rule, also be the synonym for "A".
      existingWordSynonyms.forEach((el) => {
        const otherSyonyms = synonymsTable.get(el);
        otherSyonyms.add(newSynonym);
        console.log(el);
      });

      // add it to this word as well
      existingWordSynonyms.add(newSynonym);

      console.log(existingWordSynonyms);
      console.log('-------  END ------');
    } else {
      // First entry
      synonymsTable.set(word, new Set([newSynonym]));
      synonymsTable.set(newSynonym, new Set([word]));
    }

    console.log(synonymsTable);
    res.sendStatus(201);
  });
router.route('/synonym/:word')
  .get((req, res) => {
    const { word } = req.params;

    console.log(word);

    const synonym = synonymsTable.get(word);
    if (synonym) {
      synonym.forEach((el) => {
        console.log(`The synonym for word ${word} is ${el}`);
      });

      res.json({
        synonyms: Array.from(synonym),
      });
    } else {
      res.json({
        synonym: [],
      });
    }
  });

app.listen(3000, () => console.log('listening'));

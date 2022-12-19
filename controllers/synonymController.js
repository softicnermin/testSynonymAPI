const wordsDictionary = new Map();
const synonymsData = new Map();

const MAX_WORD_LENGTH = 35;
const isWordValid = (word) => word && /^[a-zA-Z ]+$/.test(word) && word.length < MAX_WORD_LENGTH;
/*
  Storage
  wordsDictionary is a Map where the word is the key and
  the value is the key in the synonymsData Map
  The value in the synonymData is a set of synonyms.

  wordsDictionary:
  {
    w1: 1,
    w2: 1,
    w3: 1,
    w4: 2,
    w5: 2,
  }
  synonymsData:
  {
    1: Set(3) { w1, w2, w3}
    2: Set(2) { w4, w5 }
  }
 */

const postSynonym = ((req, res) => {
  const { word, newSynonym } = req.body;
  // If the words are not valid return bad request
  if (!isWordValid(word) || !isWordValid(newSynonym)) {
    res.status(400).json({
      message: 'Not valid words!',
    });
    return;
  }

  // Is there already a synonym for this word
  const key = wordsDictionary.get(word);
  const existingWordSynonyms = synonymsData.get(key);

  if (existingWordSynonyms && existingWordSynonyms.has(newSynonym)) {
    res.json({
      message: 'Duplicate entry!',
    });
  } else if (existingWordSynonyms) {
    // If it's an existing word add the new
    // synonym if not already present
    existingWordSynonyms.add(newSynonym);
    wordsDictionary.set(newSynonym, key);

    res.json({
      message: 'Success!',
    });
  } else {
    // New entry
    const newKey = synonymsData.size + 1;
    synonymsData.set(newKey, new Set([word, newSynonym]));
    // Add both wordsDictionary with the link to the synonym set
    wordsDictionary.set(word, newKey);
    wordsDictionary.set(newSynonym, newKey);
    res.json({
      message: 'Success!',
    });
  }
});

/*
Getting the synonym list for a word is requires two
  operations
  1. Get the key from the wordsDictionary O(1)
  2. Get the synonym from synonymsData O(1)
 */
const getSynonym = ((req, res) => {
  const { word } = req.params;

  const key = wordsDictionary.get(word);
  // Make a copy and delete the searched word from the response
  const synonyms = new Set(synonymsData.get(key));
  synonyms.delete(word);
  if (synonyms) {
    res.json({
      synonyms: Array.from(synonyms),
    });
  } else {
    res.json({
      synonyms: [],
    });
  }
});

module.exports = { postSynonym, getSynonym };

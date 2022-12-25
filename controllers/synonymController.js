const { v4: uuidv4 } = require('uuid');

const wordsDictionary = new Map();
const synonymsData = new Map();

const MAX_WORD_LENGTH = 35;
const isWordValid = (word) => word && /^[a-zA-Z ]+$/.test(word) && word.length < MAX_WORD_LENGTH;
const sanitizeWord = (word) => word.trim().toLowerCase();
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
  let { firstWord, secondWord } = req.body;
  firstWord = sanitizeWord(firstWord);
  secondWord = sanitizeWord(secondWord);
  // If the words are not valid return bad request
  if (!isWordValid(firstWord)
      || !isWordValid(secondWord)
      || firstWord === secondWord
  ) {
    res.status(400).json({
      message: 'Not valid entry!',
    });
    return;
  }

  // Is there already a synonym for this word
  const firstWordKey = wordsDictionary.get(firstWord);
  const firstWordSynonyms = synonymsData.get(firstWordKey);

  // CASE I - a duplicate entry  ( w1-w1 )
  if (firstWordSynonyms && firstWordSynonyms.has(secondWord)) {
    res.json({
      message: 'Duplicate entry!',
    });
    return;
  }

  const secondWordKey = wordsDictionary.get(secondWord);
  const secondWordSynonyms = synonymsData.get(secondWordKey);

  // CASE II - Both words already exist but not as synonyms
  // Now they are declared synonyms, so we need to merge the synonym list
  // Example for the list in the description would be to
  // declare any word from the group 1 a synonym with any of the words from group 2
  // e.g (w3 - w5)
  if (firstWordKey && secondWordKey && firstWordKey !== secondWordKey) {
    const mergedKey = synonymsData.size + 1;
    // 1.New merged list
    synonymsData.set(mergedKey, new Set([...firstWordSynonyms, ...secondWordSynonyms]));
    // 2. Reassign synonym list keys
    [...firstWordSynonyms, ...secondWordSynonyms].forEach((word) => {
      wordsDictionary.set(word, mergedKey);
    });
    // 3. Delete old entries
    synonymsData.delete(firstWordKey);
    synonymsData.delete(secondWordKey);
    res.json({
      message: 'Success!',
    });
    return;
  }
  // CASE III - Only first word exists (w3 - w6)
  if (firstWordKey && !secondWordKey) {
    // If it's an existing word add the new
    // synonym if not already present
    firstWordSynonyms.add(secondWord);
    wordsDictionary.set(secondWord, firstWordKey);

    res.json({
      message: 'Success!',
    });
    return;
  }
  // CASE IV - Only second word exists (w6 - w3)
  if (secondWordKey && !firstWordKey) {
    // If it's an existing word add the new
    // synonym if not already present
    secondWordSynonyms.add(firstWord);
    wordsDictionary.set(firstWord, secondWordKey);

    res.json({
      message: 'Success!',
    });
    return;
  }
  // CASE V - First time for new words (w6 - w7)
  const newKey = uuidv4();
  synonymsData.set(newKey, new Set([firstWord, secondWord]));
  // Add both wordsDictionary with the link to the synonym set
  wordsDictionary.set(firstWord, newKey);
  wordsDictionary.set(secondWord, newKey);
  res.json({
    message: 'Success!',
  });
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
  if (key) {
    // Make a copy and delete the searched word from the response
    const synonyms = new Set(synonymsData.get(key));
    synonyms.delete(word);
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

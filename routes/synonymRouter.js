const express = require('express');
const synonymController = require('../controllers/synonymController');

const synonymRouter = express.Router();

synonymRouter.route('/synonym')
  .post(synonymController.postSynonym);
synonymRouter.route('/synonym/:word')
  .get(synonymController.getSynonym);

module.exports = synonymRouter;

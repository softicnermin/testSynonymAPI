const chai = require('chai');
const chaiHttp = require('chai-http');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

const server = require('../index');

chai.use(chaiHttp);
describe('Synonym Controller Test', () => {
  describe('Get', () => {
    it('should return 200', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Get', () => {
    it('should return empty array', (done) => {
      chai.request(server)
        .get('/api/synonym/test')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('synonyms');
          res.body.synonyms.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return error because of same words', (done) => {
      const payload = {
        firstWord: 'test',
        secondWord: 'test',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Not valid entry!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return error because of invalid words', (done) => {
      const payload = {
        firstWord: 'test',
        secondWord: 'test234',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Not valid entry!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return success', (done) => {
      const payload = {
        firstWord: 'plate',
        secondWord: 'saucer',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Success!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return duplicate entry -  CASE I', (done) => {
      const payload = {
        firstWord: 'plate',
        secondWord: 'saucer',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Duplicate entry!');
          done();
        });
    });
  });

  describe('Get', () => {
    it('should return synonym entry', (done) => {
      const word = 'plate';

      chai.request(server)
        .get(`/api/synonym/${word}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('synonyms');
          res.body.synonyms.length.should.be.eql(1);
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return success - cover CASE III', (done) => {
      const payload = {
        firstWord: 'plate',
        secondWord: 'bowl',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Success!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return success - cover CASE IV', (done) => {
      const payload = {
        firstWord: 'dish',
        secondWord: 'plate',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Success!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return success', (done) => {
      const payload = {
        firstWord: 'platter',
        secondWord: 'paten',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Success!');
          done();
        });
    });
  });

  describe('Post', () => {
    it('should return success - cover CASE II', (done) => {
      const payload = {
        firstWord: 'plate',
        secondWord: 'paten',
      };

      chai.request(server)
        .post('/api/synonym')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.eql('Success!');
          done();
        });
    });
  });
});

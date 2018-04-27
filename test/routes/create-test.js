const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');

    });
  });

  describe('POST', () => {
    it('creates and renders a new item in database', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

        const createdItem = await Item.findOne(itemToCreate);
        assert.isOk(createdItem, 'Item was not created successfully in the database');

    });

    it('redirect the user back to root', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

        const responseStatus = response.status;
        assert.equal(responseStatus, 302);
        assert.equal(response.headers.location, '/');

    });

    it('items/create request with no title should display an error message', async () => {
      const invalidItemToCreate = {
       description: 'test',
       imageUrl: 'https://www.placebear.com/200/300',
      };

      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);

        const createdItem = await Item.find({});
        assert.equal(createdItem.length, 0);
        assert.equal(response.status, 400);

        const bodyText = parseTextFromHTML (response.text, 'form');
        assert.include(bodyText, 'required')


    });
  });

});

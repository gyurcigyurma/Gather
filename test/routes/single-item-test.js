const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');
const pino = require('pino')();

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  describe('opens a single view and ',  () => {
    it('should display the created item', async () => {
      const Item = await seedItemToDatabase({
        title: 'Big Bears',
        description: 'Like big bear',
        imageUrl: 'www.maci.hu'
      });

      const response = await request(app)
        .get(`/items/${Item._id}`);

      const originalItemTitle = String(Item.title);
      const returnedItemTitle = String(parseTextFromHTML(response.text, '#item-title'));
      assert.include(returnedItemTitle, originalItemTitle);

      const originalItemDescription = String(Item.description);
      const returnedItemDescription = String(parseTextFromHTML(response.text, '#item-description'));
      assert.include(returnedItemDescription, originalItemDescription);
    });
  });


});

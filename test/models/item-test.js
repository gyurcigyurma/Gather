const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title', function(){
    it('title should be string', function(){
      const invalidTitle = 123;
      const newItem = new Item({title:invalidTitle});
      assert.strictEqual(newItem.title, invalidTitle.toString());
    });

    it('title is required', function(){
      const newItem = new Item({title:null});
      newItem.validateSync();

      assert.equal(newItem.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('#description', function(){
    it('description should be string', function(){
      const invalidDescription = 3434;
      const newItem = new Item({description:invalidDescription});
      assert.strictEqual(newItem.description, invalidDescription.toString());
    });

    it('description is required', function(){
      const newItem = new Item({description:null});
      newItem.validateSync();

      assert.equal(newItem.errors.description.message, 'Path `description` is required.');
    });
  });

  describe('#imageUrl', function(){
    it('imageUrl should be string', function(){
      const invalidimageUrl = 555;
      const newItem = new Item({imageUrl:invalidimageUrl});
      assert.strictEqual(newItem.imageUrl, invalidimageUrl.toString());
    });

    it('imageUrl is required', function(){
      const newItem = new Item({imageUrl:null});
      newItem.validateSync();

      assert.equal(newItem.errors.imageUrl.message, 'Path `imageUrl` is required.');
    });
  });

});

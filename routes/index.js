const router = require('express').Router();
const Item = require('../models/item');
const pino = require('pino')();

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {
    items
  });
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.get('/items/:itemId', async (req, res, next) => {
  const actualImtem = await Item.findById({_id:req.params.itemId });
  res.render('single', {actualImtem});
});

router.post('/items/create', async (req, res, next) => {
  const {
    title,
    description,
    imageUrl
  } = req.body;

  const newItem = new Item({
    title,
    description,
    imageUrl
  });

  newItem.validateSync();

  if (newItem.errors) {
    const errorMsg = createErrorMessage(newItem.errors);

    pino.info('Error occured in router');
    res.status(400).render('create', {
      newItem: newItem,
      errors: {
        message: errorMsg
      }
    });

  } else {
    await newItem.save();
    res.redirect('/');
  }
});

function createErrorMessage (errorObj) {
  const errorsCount = Object.keys(errorObj);
  const missingFields = errorsCount.join(', ');
  return `The ${missingFields} fields are required.`;

}

module.exports = router;

const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits single item\'s page', () => {
    describe('creating a new item', () => {
      it('is rendered on the root', () => {
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        assert.include(browser.getText('body'), itemToCreate.title);
        assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl);
      });
    });

    describe('Click on the new item', () => {
      it('is rendered on single view', () => {
        const itemToCreate = buildItemObject();
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');
        browser.url('/');
        browser.click('.item-card a');

        assert.include(browser.getText('body'), itemToCreate.description);
      });
    });
});

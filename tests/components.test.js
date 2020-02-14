import '@testing-library/jest-dom/extend-expect';
import Search from '../src/scripts/components/Search';
import Actions from '../src/scripts/components/Actions';
import Message from '../src/scripts/components/Message';

describe('Search', () => {
  const grid = document.createElement('div');
  const search = new Search(grid);

  test('render function should append element to grid', () => {
    search.render('en');
    expect(grid).toContainElement(search.el);
  });
});

describe('Actions', () => {
  const grid = document.createElement('div');
  const actions = new Actions(grid);

  test('render function should append element to grid', () => {
    actions.render('en', 'celsium');
    expect(grid).toContainElement(actions.el);
  });
});

describe('Message', () => {
  const grid = document.createElement('div');
  const message = new Message(grid);

  test('render function should append element to grid', () => {
    message.render();
    expect(grid).toContainElement(message.el);
  });
});

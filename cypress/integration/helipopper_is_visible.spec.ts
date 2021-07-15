Cypress.on('scrolled', element => {
  // When we do `cy.get()` the Cypress finds the element
  // and scrolls down, thus this element becomes at the very top
  // of the page.
  // `tippy.js` will not show tooltips if they appeared in an invisible
  // part of the window.
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center'
  });
});

describe('@ngneat/helipopper/is_visible', () => {
  const popperSelector = '.tippy-box .tippy-content';

  beforeEach(() => {
    cy.visit('/is-visible').wait(200);
  });

  describe('Is visible from the beginning', () => {
    it('should be visible while flag is already set true before view renders', () => {
      cy.get(popperSelector).contains("I'm a declarative tooltip");
    });
  });
});

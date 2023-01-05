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

  describe('isVisible attribute', () => {
    beforeEach(() => {
      cy.visit('/').wait(200);
    });

    it('should not be visible while flag is false', () => {
      cy.get('.declarativeTooltip').should('not.exist');
    });
    it('should be visible while flag is true', () => {
      cy.get('[data-cy~="trigger-declarative"]').click({ force: true });
      cy.get(popperSelector).contains("I'm a declarative tooltip");
      cy.get('[data-cy~="trigger-declarative"]').click({ force: true });
      cy.get('.declarativeTooltip').should('not.exist');
    });
  });

  describe('isVisible attribute with initial value true', () => {
    beforeEach(() => {
      cy.visit('/is-visible').wait(200);
    });

    it('should be visible while flag is already set true before view renders', () => {
      cy.get(popperSelector).contains("I'm a declarative tooltip");
    });
  });
});

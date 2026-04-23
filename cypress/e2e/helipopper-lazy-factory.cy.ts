Cypress.on('scrolled', (element) => {
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center',
  });
});

describe('Lazy factory content', () => {
  const trigger = '[data-cy="lazy-factory-trigger"]';
  const loader = '[data-cy="tippy-loader"]';
  const component = '[data-cy="lazy-dummy-content"]';

  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  it('should show the loader while the component is being loaded', () => {
    // Delay the JS chunk so the loader is visible long enough to assert.
    cy.intercept('GET', '**/*.js', (req) => {
      if (req.url.includes('lazy-dummy')) {
        req.reply((res) => res.setDelay(600));
      }
    });

    cy.get(trigger).click({ force: true });
    cy.get(loader).should('be.visible');
  });

  it('should replace the loader with the lazy-loaded component', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible').and('contain.text', 'Lazy loaded!');
    cy.get(loader).should('not.exist');
  });

  it('should hide the tooltip on a second click', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible');

    cy.get(trigger).click({ force: true });
    cy.get(component).should('not.exist');
  });

  it('should re-show the component on a third click without the loader', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible');

    cy.get(trigger).click({ force: true });
    cy.get(component).should('not.exist');

    // On re-show the chunk is already cached by the browser, so no loader.
    cy.get(trigger).click({ force: true });
    cy.get(loader).should('not.exist');
    cy.get(component).should('be.visible');
  });
});

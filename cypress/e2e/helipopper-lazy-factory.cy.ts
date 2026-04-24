Cypress.on('scrolled', (element) => {
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center',
  });
});

describe('Lazy factory content', () => {
  const trigger = '[data-cy="lazy-factory-trigger"]';
  const component = '[data-cy="lazy-dummy-content"]';

  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  it('should show the lazy-loaded component', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible').and('contain.text', 'Lazy loaded!');
  });

  it('should hide the tooltip on a second click', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible');

    cy.get(trigger).click({ force: true });
    cy.get(component).should('not.exist');
  });

  it('should re-show the component on a third click', () => {
    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible');

    cy.get(trigger).click({ force: true });
    cy.get(component).should('not.exist');

    cy.get(trigger).click({ force: true });
    cy.get(component).should('be.visible');
  });
});

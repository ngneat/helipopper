Cypress.on('scrolled', (element) => {
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center',
  });
});

describe('@ngneat/helipopper — keyboard navigation', () => {
  const popperSelector = '.tippy-box .tippy-content';
  const tooltipButton = '[data-cy="default-tooltip-button"]';

  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  it('should open tooltip on focus (keyboard navigation)', () => {
    cy.get(tooltipButton).focus();
    cy.get(popperSelector).contains('Default tooltip').should('be.visible');
  });

  it('should close tooltip on blur', () => {
    cy.get(tooltipButton).focus();
    cy.get(popperSelector).contains('Default tooltip').should('be.visible');

    cy.get(tooltipButton).blur();
    cy.get(popperSelector).should('not.exist');
  });

  it('should open tooltip on mouseenter as before', () => {
    cy.get(tooltipButton).trigger('mouseenter');
    cy.get(popperSelector).contains('Default tooltip').should('be.visible');
  });
});

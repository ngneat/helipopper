Cypress.on('scrolled', (element) => {
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center',
  });
});

describe('@ngneat/helipopper — disableAll / enableAll', () => {
  const popperSelector = '.tippy-box .tippy-content';
  const tooltipA = '[data-cy="disable-all-tooltip-a"]';
  const tooltipB = '[data-cy="disable-all-tooltip-b"]';
  const locallyDisabled = '[data-cy="disable-all-tooltip-local"]';
  const toggleAll = '[data-cy="toggle-all-button"]';

  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  it('should show tooltips when globally enabled (default)', () => {
    cy.get(tooltipA).trigger('mouseenter');
    cy.get(popperSelector).contains('Tooltip A').should('be.visible');

    cy.get(tooltipA).trigger('mouseleave');

    cy.get(tooltipB).trigger('mouseenter');
    cy.get(popperSelector).contains('Tooltip B').should('be.visible');
  });

  it('should hide all tooltips after disableAll()', () => {
    cy.get(toggleAll).should('contain', 'Disable All').click();

    cy.get(tooltipA).trigger('mouseenter');
    cy.get(popperSelector).should('not.exist');

    cy.get(tooltipB).trigger('mouseenter');
    cy.get(popperSelector).should('not.exist');
  });

  it('should restore all tooltips after enableAll()', () => {
    cy.get(toggleAll).click(); // disable
    cy.get(tooltipA).trigger('mouseenter');
    cy.get(popperSelector).should('not.exist');

    cy.get(toggleAll).click(); // re-enable
    cy.get(tooltipA).trigger('mouseenter');
    cy.get(popperSelector).contains('Tooltip A').should('be.visible');
  });

  it('should keep a locally-disabled tooltip hidden even after enableAll()', () => {
    // Locally-disabled tooltip never shows while enabled globally.
    cy.get(locallyDisabled).trigger('mouseenter');
    cy.get(popperSelector).should('not.exist');

    // Disable all, then re-enable — locally disabled should stay hidden.
    cy.get(toggleAll).click();
    cy.get(toggleAll).click();

    cy.get(locallyDisabled).trigger('mouseenter');
    cy.get(popperSelector).should('not.exist');
  });

  it('should survive multiple disable/enable cycles', () => {
    for (let i = 0; i < 3; i++) {
      cy.get(toggleAll).click(); // disable
      cy.get(tooltipA).trigger('mouseenter');
      cy.get(popperSelector).should('not.exist');

      cy.get(toggleAll).click(); // enable
      cy.get(tooltipA).trigger('mouseenter');
      cy.get(popperSelector).contains('Tooltip A').should('be.visible');
      cy.get(tooltipA).trigger('mouseleave');
    }
  });
});

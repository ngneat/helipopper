Cypress.on('scrolled', (element) => {
  // When we do `cy.get()` the Cypress finds the element
  // and scrolls down, thus this element becomes at the very top
  // of the page.
  // `tippy.js` will not show tooltips if they appeared in an invisible
  // part of the window.
  element.get(0).scrollIntoView({
    block: 'center',
    inline: 'center',
  });
});

describe('@ngneat/helipopper', () => {
  const playground = '#tippy-playground';
  const popperSelector = '.tippy-box .tippy-content';

  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  describe('Manual trigger', () => {
    it('should manually create tooltip', () => {
      cy.get('#manual-trigger button')
        .first()
        .click({ force: true })
        .get('body')
        .contains('Helpful Message')
        .should('exist');
    });
  });

  describe('Custom template', () => {
    it('should create tooltip with a custom template', () => {
      cy.get('#custom-template button').click({ force: true }).get('.positions').contains('top').should('exist');
    });
  });

  describe('Custom component', () => {
    it('should create a tooltip with custom component', () => {
      cy.get('#custom-component button')
        .click({ force: true })
        .get('app-example')
        .contains('Hello, ngneat')
        .should('exist');

      cy.get('#custom-component input').clear().type('world!');

      cy.get('#custom-component button')
        .click({ force: true })
        .get('app-example')
        .contains('Hello, world!')
        .should('exist');
    });
  });

  describe('Tippy nil values', () => {
    it('should create a tooltip with a non-nil value', () => {
      cy.get('#tippy-value-non-nil button')
        .click({ force: true })
        .get(popperSelector)
        .contains('I have a tooltip value different from nil')
        .should('exist');
    });

    it('should not create a tooltip when using a null value', () => {
      cy.get('#tippy-value-null button').click({ force: true }).get(popperSelector).should('not.exist');
    });

    it('should not create a tooltip when using an undefined value', () => {
      cy.get('#tippy-value-undefined button').click({ force: true }).get(popperSelector).should('not.exist');
    });
  });

  describe('hideOnEscape', () => {
    const tippyTriggerSelector = `${playground} .btn-container button`;
    const tippyCheckboxSelector = '#hideOnEsc-toggle';

    it('should NOT hide on Escape if hideOnEscape is false', () => {
      cy.get(tippyCheckboxSelector)
        .uncheck()
        .should('not.be.checked')
        .get(tippyTriggerSelector)
        .click({ force: true })
        .get(popperSelector)
        .should('exist');
    });

    it('should hide on Escape if hideOnEscape is true', () => {
      cy.get(tippyCheckboxSelector)
        .check()
        .should('be.checked')
        .get(tippyTriggerSelector)
        .click({ force: true })
        .get(popperSelector)
        .should('not.exist');
    });
  });

  describe('showOnCreate', () => {
    it('should show tooltip if created', () => {
      cy.get('.tippy-content').contains('Shown immediately when created').should('exist');
    });
  });

  describe('onlyTextOverflow', () => {
    it('should show tooltip if text is overflowed', () => {
      cy.get('[data-cy="overflow-case-1"]').trigger('mouseenter');

      cy.get('.tippy-content').contains('Only shown when text is overflowed 1').should('be.visible');

      cy.get('[data-cy="content-toggler"]').first().click();

      cy.get('[data-cy="overflow-case-1"]').trigger('mouseenter');

      cy.get('.tippy-content').contains('Only shown when text is overflowed 1').should('not.exist');
    });

    it('should show tooltip when decreasing the tp host width', () => {
      cy.get('[data-cy="content-toggler"]').eq(1).click();

      cy.get('[data-cy="overflow-case-2"]').trigger('mouseenter');

      cy.get('.tippy-content').contains('Only shown when text is overflowed 2').should('not.exist');

      cy.get('[data-cy="width-toggler"]').click();

      cy.get('[data-cy="overflow-case-2"]').trigger('mouseenter');

      cy.get('.tippy-content').contains('Only shown when text is overflowed 2').should('be.visible');
    });
  });
});

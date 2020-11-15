describe('@ngneat/helipopper', () => {
  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  describe('Manual trigger', () => {
    it('should manually create tooltip', () => {
      cy.get('#manual-trigger button')
        .first()
        .click()
        .get('body')
        .contains('Helpful Message')
        .should('exist');
    });
  });

  describe('Custom template', () => {
    it('should create tooltip with a custom template', () => {
      cy.get('#custom-template button')
        .click()
        .get('body')
        .contains('Click to talk')
        .should('exist');
    });
  });

  describe('Disabled state', () => {
    it('should disable tooltip', () => {
      const getDivToHover = () => cy.get('#disabled').contains('Hover me to read a secret');

      getDivToHover()
        .trigger('mouseenter')
        .get('body')
        .contains("I can't tell you")
        .should('exist');

      getDivToHover().trigger('mouseleave');

      cy.get('#disabled button').click();
      cy.get('#disabled')
        .contains('No tooltip')
        .should('exist');
    });
  });

  describe('Sticky', () => {
    it('should become sticky after clicking a button', () => {
      cy.get('#sticky button')
        .click()
        .get('body')
        .contains('Knock knock')
        .should('exist')
        .get('#sticky button')
        .click();
    });
  });

  describe('Custom component', () => {
    it('should create a tooltip with custom component', () => {
      cy.get('#custom-component button')
        .click()
        .get('app-example')
        .contains('example works')
        .should('exist');
    });
  });
});

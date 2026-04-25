describe('tpTippyProps', () => {
  beforeEach(() => {
    cy.visit('/').wait(200);
  });

  it('should pass tippy props to the instance', () => {
    cy.get('[data-cy="tippy-props-button"]')
      .click({ force: true })
      .get('.tippy-box')
      .should('be.visible')
      .and('have.attr', 'data-animation', 'shift-away');
  });
});

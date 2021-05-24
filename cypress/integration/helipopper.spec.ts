Cypress.on("scrolled", element => {
  // When we do `cy.get()` the Cypress finds the element
  // and scrolls down, thus this element becomes at the very top
  // of the page.
  // `tippy.js` will not show tooltips if they appeared in an invisible
  // part of the window.
  element.get(0).scrollIntoView({
    block: "center",
    inline: "center"
  });
});

describe("@ngneat/helipopper", () => {
  beforeEach(() => {
    cy.visit("/").wait(200);
  });

  describe("Manual trigger", () => {
    it("should manually create tooltip", () => {
      cy.get("#manual-trigger button")
        .first()
        .click({ force: true })
        .get("body")
        .contains("Helpful Message")
        .should("exist");
    });
  });

  describe("Custom template", () => {
    it("should create tooltip with a custom template", () => {
      cy.get("#custom-template button")
        .click({ force: true })
        .get(".positions")
        .contains("top")
        .should("exist");
    });
  });

  describe("Custom component", () => {
    it("should create a tooltip with custom component", () => {
      cy.get("#custom-component button")
        .click({ force: true })
        .get("app-example")
        .contains("example works")
        .should("exist");
    });
  });

  describe("Tippy nil values", () => {
    it("should create a tooltip with a non-nil value", () => {
      cy.get("#tippy-value-non-nil button")
        .click({ force: true })
        .get(".tippy-box .tippy-content")
        .contains("I have a tooltip value different from nil")
        .should("exist");
    });

    it("should not create a tooltip when using a null value", () => {
      cy.get("#tippy-value-null button")
        .click({ force: true })
        .get(".tippy-box .tippy-content")
        .should("not.exist");
    });

    it("should not create a tooltip when using an undefined value", () => {
      cy.get("#tippy-value-undefined button")
        .click({ force: true })
        .get(".tippy-box .tippy-content")
        .should("not.exist");
    });
  });
});

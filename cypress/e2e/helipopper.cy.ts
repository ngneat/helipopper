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
      cy.get('#custom-template button')
        .click({ force: true })
        .get('.positions')
        .contains('top')
        .should('exist');
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
      cy.get('#tippy-value-null button')
        .click({ force: true })
        .get(popperSelector)
        .should('not.exist');
    });

    it('should not create a tooltip when using an undefined value', () => {
      cy.get('#tippy-value-undefined button')
        .click({ force: true })
        .get(popperSelector)
        .should('not.exist');
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

  describe('onlyTextOverflow', () => {
    it('should show tooltip if text is overflowed', () => {
      cy.get('[data-cy="overflow-case-1"]').trigger('mouseenter');

      cy.get('.tippy-content')
        .contains('Only shown when text is overflowed 1')
        .should('be.visible');

      cy.get('[data-cy="content-toggler"]').first().click();

      cy.get('[data-cy="overflow-case-1"]').trigger('mouseenter');

      cy.get('.tippy-content')
        .contains('Only shown when text is overflowed 1')
        .should('not.exist');
    });

    it('should show tooltip when decreasing the tp host width', () => {
      cy.get('[data-cy="content-toggler"]').eq(1).click();

      cy.get('[data-cy="overflow-case-2"]').trigger('mouseenter');

      cy.get('.tippy-content').should('not.exist');

      cy.get('[data-cy="width-toggler"]').click();

      cy.get('[data-cy="overflow-case-2"]').trigger('mouseenter');

      cy.get('.tippy-content')
        .contains('Only shown when text is overflowed 2')
        .should('be.visible');
    });
  });

  describe('Dynamic content', () => {
    const dynamicButtonSelector = '[data-cy="dynamic-content"] .btn-container button';
    const setContentButton = '[data-cy="dynamic-content"] button:contains("Set Content")';
    const setEmptyStringButton =
      '[data-cy="dynamic-content"] button:contains("Set Empty String")';
    const setNullButton = '[data-cy="dynamic-content"] button:contains("Set Null")';
    const setUndefinedButton =
      '[data-cy="dynamic-content"] button:contains("Set Undefined")';

    it('should not create tooltip when content is initially empty', () => {
      // Initially, the dynamicContent should be undefined/null
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');
    });

    it('should create tooltip when content becomes available', () => {
      // Set content
      cy.get(setContentButton).click();

      // Verify tooltip is created and shows content
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');
    });

    it('should destroy tooltip when content becomes empty string', () => {
      // First set content to create tooltip
      cy.get(setContentButton).click();

      // Verify tooltip exists
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set empty string
      cy.get(setEmptyStringButton).click();

      // Verify tooltip is destroyed
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');
    });

    it('should destroy tooltip when content becomes null', () => {
      // First set content to create tooltip
      cy.get(setContentButton).click();

      // Verify tooltip exists
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set null
      cy.get(setNullButton).click();

      // Verify tooltip is destroyed
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');
    });

    it('should destroy tooltip when content becomes undefined', () => {
      // First set content to create tooltip
      cy.get(setContentButton).click();

      // Verify tooltip exists
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set undefined
      cy.get(setUndefinedButton).click();

      // Verify tooltip is destroyed
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');
    });

    it('should recreate tooltip when content becomes available again', () => {
      // Set content
      cy.get(setContentButton).click();

      // Verify tooltip exists
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set null to destroy tooltip
      cy.get(setNullButton).click();

      // Verify tooltip is destroyed
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');

      // Set content again
      cy.get(setContentButton).click();

      // Verify tooltip is recreated
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');
    });

    it('should handle multiple content changes correctly', () => {
      // Test sequence: empty -> content -> empty -> content

      // Initially empty
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');

      // Set content
      cy.get(setContentButton).click();
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set empty string
      cy.get(setEmptyStringButton).click();
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');

      // Set content again
      cy.get(setContentButton).click();
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip with content!')
        .should('be.visible');

      // Set undefined
      cy.get(setUndefinedButton).click();
      cy.get(dynamicButtonSelector)
        .trigger('mouseenter')
        .get(popperSelector)
        .should('not.exist');
    });

    it('should update button text to reflect current content state', () => {
      // Initially should show "No content"
      cy.get(dynamicButtonSelector).should('contain', 'No content');

      // Set content
      cy.get(setContentButton).click();
      cy.get(dynamicButtonSelector).should('contain', 'Tooltip with content!');

      // Set empty string
      cy.get(setEmptyStringButton).click();
      cy.get(dynamicButtonSelector).should('contain', 'No content');

      // Set null
      cy.get(setNullButton).click();
      cy.get(dynamicButtonSelector).should('contain', 'No content');

      // Set undefined
      cy.get(setUndefinedButton).click();
      cy.get(dynamicButtonSelector).should('contain', 'No content');
    });
  });

  describe('Disable/Enable functionality', () => {
    const tooltipButton = '[data-cy="disabled-tooltip-button"]';
    const toggleButton = '[data-cy="toggle-enabled-button"]';

    it('should show tooltip when enabled by default', () => {
      // Initially the tooltip should be enabled
      cy.get(tooltipButton)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip')
        .should('be.visible');
    });

    it('should hide tooltip when disabled', () => {
      // Click the toggle button to disable the tooltip
      cy.get(toggleButton).click();

      // Verify the button text changed to "Enable"
      cy.get(toggleButton).should('contain', 'Enable');

      // Try to trigger the tooltip - it should not appear
      cy.get(tooltipButton).trigger('mouseenter').get(popperSelector).should('not.exist');
    });

    it('should show tooltip again when re-enabled', () => {
      // First disable the tooltip
      cy.get(toggleButton).click();
      cy.get(tooltipButton).trigger('mouseenter').get(popperSelector).should('not.exist');

      // Re-enable the tooltip
      cy.get(toggleButton).click();

      // Verify the button text changed back to "Disable"
      cy.get(toggleButton).should('contain', 'Disable');

      // Try to trigger the tooltip - it should appear again
      cy.get(tooltipButton)
        .trigger('mouseenter')
        .get(popperSelector)
        .contains('Tooltip')
        .should('be.visible');
    });

    it('should handle multiple enable/disable cycles', () => {
      // Test multiple cycles of enable/disable
      for (let i = 0; i < 3; i++) {
        // Disable
        cy.get(toggleButton).click();
        cy.get(tooltipButton)
          .trigger('mouseenter')
          .get(popperSelector)
          .should('not.exist');

        // Enable
        cy.get(toggleButton).click();
        cy.get(tooltipButton)
          .trigger('mouseenter')
          .get(popperSelector)
          .contains('Tooltip')
          .should('be.visible');
      }
    });
  });
});

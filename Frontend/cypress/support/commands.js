/// <reference types="cypress" />
Cypress.Commands.add('loginWithRole', (role) => {
    cy.visit("/login");
    var emailInput = cy.get("[data-cy='email-input']");
    var passwordInput = cy.get("[data-cy='password-input']");
    var submitBtn = cy.get("[data-cy='submit-button']");
    if (role == "user") {
        emailInput.type("marton@gmail.com");
        passwordInput.type("MartonJelszo123");
        submitBtn.click({force: true});
        cy.wait(1000);
    } else {
        emailInput.type("admin@gmail.com");
        passwordInput.type("AdminJelszo123");
        submitBtn.click({force: true});
        cy.wait(1000);
    }
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
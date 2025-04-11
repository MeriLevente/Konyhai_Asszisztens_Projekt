Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A felhasználó szerepek tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
    });

    it('Admin felhasználó nem éri el a sima felhasználók által használt oldalakat (Konyhám, Receptek, Recept leírás)!', () => {
        cy.loginWithRole("admin");
        goToRouteByRole("admin");
    });

    it('Sima felhasználó nem éri el az admin felület oldalati (Admin, Adat megjelenítő, Admin regisztráció)!', () => {
        cy.loginWithRole("user");
        goToRouteByRole("user");
    });

    it('Ha nem vagyunk bejelentkezve, akkor az oldalak elérése nem engedélyezet és a bejelentkezés oldalra dob!', () => {
        cy.visit("/admin");
        cy.location('pathname').should('eq', '/login');

        cy.visit("/items");
        cy.location('pathname').should('eq', '/login');

        cy.visit("/recipes");
        cy.location('pathname').should('eq', '/login');
    });
});

const goToRouteByRole = (visitorRole) => {
    if (visitorRole == "admin") {
        cy.visit("/items");
        cy.location('pathname').should('eq', '/');

        cy.visit("/recipes");
        cy.location('pathname').should('eq', '/');

        cy.visit("/recipe?id=1");
        cy.location('pathname').should('eq', '/');
    } 
    if (visitorRole == "user") {
        cy.visit("/admin");
        cy.location('pathname').should('eq', '/');

        cy.visit("/edit-types");
        cy.location('pathname').should('eq', '/');

        cy.visit("/edit-items");
        cy.location('pathname').should('eq', '/');

        cy.visit("/edit-recipes");
        cy.location('pathname').should('eq', '/');

        cy.visit("/register-admin");
        cy.location('pathname').should('eq', '/');
    }
};
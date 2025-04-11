Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A admin oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("admin");
        cy.visit(`/admin`);
    });

    it('Az admin felület megjelenik!', () => {
        cy.location('pathname').should('eq', '/admin');
    });

    it('Az admin felületen 4 link található!', () => {
        cy.get("[data-cy='admin-block']").should("have.length", 4);
    });

    it('Az első link az élelmiszertípusok oldara visz és ott megjelennek az adatok!', () => {
        cy.get("[data-cy='admin-block']").eq(0).click({force: true});
        cy.location('pathname').should('eq', '/edit-types');
        cy.get("[data-cy='data-tr']").should("have.length", 2);
    });

    it('Az második link az élelmiszerek oldara visz és ott megjelennek az adatok!', () => {
        cy.get("[data-cy='admin-block']").eq(1).click({force: true});
        cy.location('pathname').should('eq', '/edit-items');
        cy.get("[data-cy='data-tr']").should("have.length", 3);
    });

    it('Az harmadik link a receptek oldara visz és ott megjelennek az adatok!', () => {
        cy.get("[data-cy='admin-block']").eq(2).click({force: true});
        cy.location('pathname').should('eq', '/edit-recipes');
        cy.get("[data-cy='data-tr']").should("have.length", 2);
    });

    it('Az negyedik link az admin regisztrálás oldara visz és ott a regisztráció űrlap!', () => {
        cy.get("[data-cy='admin-block']").eq(3).click({force: true});
        cy.location('pathname').should('eq', '/register-admin');
        cy.get("[data-cy='user-form']").should("be.visible");
    });

    it('Az aloldalak megnyitása után a vissza gomb vissza visz az admin felületre!', () => {
        for (let i = 0; i < 4; i++) {
            cy.get("[data-cy='admin-block']").eq(i).click({force: true});
            cy.get("[data-cy='back-button']").click({force: true});
            cy.location('pathname').should('eq', '/admin');
        };
    });
});
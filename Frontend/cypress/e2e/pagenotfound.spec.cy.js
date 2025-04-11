Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Az oldal nem található oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("user");
    });

    it('Az oldal nem található szöveg megjelenik!', () => {
        cy.visit(`/ilyen-nincs`);
        cy.get("[data-cy='404-h1']").should('contain', 'Hoppá! Valami hiba történt!');
    });

    it('Az oldal nem található oldalon lévő gomb visszarak a főoldara!', () => {
        cy.visit(`/ilyen-nincs`);
        cy.get("[data-cy='to-home-button']").click({force: true});
        cy.location('pathname').should('eq', '/');
    });

    it('Egy olyan azonosítójú recept keresésekor, ami nem létezik: recept nem található felirat jelenik meg!', () => {
        const recipeId = 100;
        cy.visit(`/recipe?id=${recipeId}`);
        cy.get("[data-cy='recipe-notfound']").should('contain', `${recipeId} azonosítójú recept nem található!`);
    });
});
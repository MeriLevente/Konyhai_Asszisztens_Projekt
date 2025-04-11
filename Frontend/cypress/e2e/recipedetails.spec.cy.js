Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A receptadatok oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("user");
        
    });

    it('A Teszt Bolognai recept adatai megjelennek helyesen az oldalon!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='recipe-title']").should("have.text", "Teszt Bolognai");
        cy.get("[data-cy='recipe-type']").should("have.text", "Olasz");
        cy.get("[data-cy='recipe-id']").should("have.text", "1");
        cy.get("[data-cy='recipe-diff']").should("have.text", "Nehézség: 5 / 10");
        cy.get("[data-cy='recipe-time']").should("have.text", "Elk. idő (perc): 80 ");
    });

    it('A Teszt Bolognai recept hozzávalóinak száma 1! Csak egy hozzávaló jelenik meg!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='ingredients-text']").should("have.length", 1);
    });

    it('A Teszt Bolognai recept hozzávalója megjelenik helyesen az oldalon! Illetve, az a mennyiség, ami a te konyhádban van!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='ingredients-text']").should("contain", "Paradicsom, 2 darab  ( 2 darab )");
    });

    it('A Teszt Bolognai recept 4 lépése megjelenik és helyesen!', () => {
        const steps = ["Teszt lépés", "Teszt lépés 2", "Teszt lépés 3", "Teszt lépés 4"];
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='recipe-steps-hu']").should("have.length", 4);
        cy.get("[data-cy='recipe-steps-hu']").each(($step, $index) => {
            cy.wrap($step).should("have.text", steps[$index]);
        });
    });

    it('A Teszt Bolognai elkészítéséhez van elég hozzávalónk, ezért az Elkészítés gomb nincs letiltva!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='cooking-button']").should("not.be.disabled");
    });

    it('A Teszt Bolognai elkészítéséhez van elég hozzávalónk, az Elkészítés gombra kattintva egy felugró ablak jelenik meg és visszarak a recpetek oldalra!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='cooking-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('Bon Appetit! :)')
        });
        cy.intercept("DELETE", "2", {status: 200});
        cy.wait(1000);
        cy.location('pathname').should('eq', '/recipes');
    });

    it('A Teszt Almák elkészítéséhez nincs elég hozzávalónk, ezért az Elkészítés gomb le van tiltva!', () => {
        cy.visit(`/recipe?id=2`);
        cy.get("[data-cy='cooking-button']").should("be.disabled");
    });

    it('A Teszt Almák elkészítéséhez nincs elég almánk, emiatt pirosan jelenik meg a mennyisége!', () => {
        cy.visit(`/recipe?id=2`);
        cy.get("[data-cy='my-ingredient']").should('have.class', 'text-danger');
    });

    it('A Teszt Bolognai elkészítéséhez van elég paradicsomunk, emiatt NEM pirosan jelenik meg a mennyisége!', () => {
        cy.visit(`/recipe?id=1`);
        cy.get("[data-cy='my-ingredient']").should('not.have.class', 'text-danger');
    });
});
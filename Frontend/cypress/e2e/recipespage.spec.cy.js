Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A receptek oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("user");
        cy.visit(`/recipes`);
    });

    it('A receptek oldal megjelenik!', () => {
        cy.location('pathname').should('eq', '/recipes');
    });

    it('A fejlécben megjelenik az recept típusok kiválasztómező, kereső input mező!', () => {
        cy.get("[data-cy='recipetype-select']").should("be.visible", true);
        cy.get("[data-cy='searchbar']").should("be.visible", true);
    });

    it('Az oldal betöltésekor a kiválasztott típus "Mind", megjelenik az összes adat és a paginátor!', () => {
        cy.get("[data-cy='recipetype-select']").find('option:selected').should('have.text', 'Mind');
        cy.get("[data-cy='paginator-back']").should("be.visible", true);
        cy.get("[data-cy='paginator-forward']").should("be.visible", true);
        cy.get("[data-cy='paginator-select']").should("be.visible", true);
        cy.get("[data-cy='recipe-card']").should("have.length", 2);
    });

    it('Ha az típusra szűrűnk megjelenik a hozzátartozó adat!', () => {
        cy.get("[data-cy='recipetype-select']").select("ITA");
        cy.get("[data-cy='recipe-card']").should("have.length", 1);
        cy.get("[data-cy='recipe-card-title']").should("contain", "Teszt Bolognai");
    });

    it('A receptkártyán helyesen váltja át az elkészítési időt óra és percre!', () => {
        cy.get("[data-cy='recipetype-select']").select("ITA");
        cy.get("[data-cy='recipe-card-time']").should("have.text", "1 ó 20 perc");
    });

    it('A Bolognai recept nehézsége helyesen jelenik meg, és háttérszíne helyesen, sárga!', () => {
        cy.get("[data-cy='recipetype-select']").select("ITA");
        cy.get("[data-cy='recipe-card-diff']").should("have.text", "5/10");
        cy.get("[data-cy='recipe-card-diff']").should('have.css', 'background-color').and('eq', 'rgb(255, 165, 0)');
    });

    it('A Teszt Almák recept nehézsége helyesen jelenik meg, és háttérszíne helyesen, zöld!', () => {
        cy.get("[data-cy='recipetype-select']").select("HUN");
        cy.get("[data-cy='recipe-card-time']").should("have.text", "10 perc");
        cy.get("[data-cy='recipe-card-diff']").should("have.text", "1/10");
        cy.get("[data-cy='recipe-card-diff']").should('have.css', 'background-color').and('eq', 'rgb(0, 128, 0)');
    });

    it('Recept kereséskor, ha a keresett recept nem található, akkor megjelenik egy figyelmeztető felirat!', () => {
        cy.get("[data-cy='searchbar']").type("nincs");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.get("[data-cy='no-recipes-text']").should("be.visible", true);
    });

    it('A receptkártyára kattintva megnyílik a recept adait tartalmazó oldal!', () => {
        cy.get("[data-cy='recipetype-select']").select("ITA");
        cy.get("[data-cy='recipe']").click({force: true});
        cy.get("[data-cy='recipe-book-div']").should("be.visible", true);
    });
});
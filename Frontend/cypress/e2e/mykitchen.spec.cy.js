Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A konyhám oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("user");
        cy.visit(`/items`);
    });

    it('A konyhám oldal megjelenik!', () => {
        cy.location('pathname').should('eq', '/items');
    });

    it('A két élelmiszer típus kártyája megjelenik!', () => {
        cy.get("[data-cy='type-card']").should("have.length", 2);
    });

    it('A fejlécben megjelenik az új felvétele, az összes mutatása, kereső input mező!', () => {
        cy.get("[data-cy='new-button']").should("be.visible", true);
        cy.get("[data-cy='show-all-checkbox']").should("be.visible", true);
        cy.get("[data-cy='searchbar']").should("be.visible", true);
    });

    it('Az élelmiszerek száma/az én dolgaim száma kör létezik és háttérszíne megfelelő!', () => {
        cy.get("[data-cy='my-score']").should("be.visible", true);
        cy.get("[data-cy='my-score']").should('have.css', 'background-color').and('eq', 'rgb(255, 221, 67)')
    });

    it('Az első típusra kattintva megjelenik a hozzája tartozó adat (Paradicsom)!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='item-title']").should("contain", "Paradicsom");
                cy.get("[data-cy='item-quantity']").should("contain", "2");
            }
        });
    });

    it('A mutasd mind megnyomására megjelenik az összes adat, a paginátor és egy vissza nyíl!', () => {
        cy.get("[data-cy='show-all-checkbox']").click({force: true});
        cy.get("[data-cy='stored-item']").should("have.length", 2);
        cy.get("[data-cy='paginator-back']").should("be.visible", true);
        cy.get("[data-cy='paginator-forward']").should("be.visible", true);
        cy.get("[data-cy='paginator-select']").should("be.visible", true);
        cy.get("[data-cy='back-to-types']").should("be.visible", true);
    });

    it.only('A paginátor gombjai le vannak tiltva, mivel visszafelé mínuszba nem tudsz lépni és előre sem, mert kevés adat van!', () => {
        cy.get("[data-cy='show-all-checkbox']").click({force: true});
        cy.get("[data-cy='paginator-back']").should("be.disabled", true);
        cy.get("[data-cy='paginator-forward']").should("be.disabled", true);
    });

});
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A admin élelmiszerek oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("admin");
        cy.visit(`/admin`);
        cy.get("[data-cy='admin-block']").eq(1).click({force: true});
    });

    it('Az új felvétele gomb nyomásra egy modal ablak ugrik fel!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='modal']").should("be.visible");
    });

    it('Az módosítás gomb nyomásra a modal ablak ugrik fel, benne a módosítandó adataival!', () => {
        cy.get("[data-cy='data-tr']").eq(0).find("[data-cy='edit-button']").click({force: true});
        cy.get("[data-cy='name-input']").invoke('val').should('equal', 'Burgonya');
        cy.get("[data-cy='name-en-input']").invoke('val').should('equal', 'Potato');
        cy.get("[data-cy='image-input']").invoke('val').should('equal', 'https://bgs.jedlik.eu/ml/Images/Items/potato.jfif');
    });

    it('Az törlés gomb nyomásra hibát dob, mivel az elemre az adatbázisban másik táblában hivatkoznak!', () => {
        cy.get("[data-cy='data-tr']").eq(0).find("[data-cy='delete-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('Típust nem lehet törölni, mert 1 rekord hivatkozik rá!');
        });
    });

    it('Az modal bezáró gomb bezárja tényleg!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='close-button']").click({force: true});
        cy.get("[data-cy='modal']").should('not.exist');
    });

    it('Kereséskor, ha a keresett szó nem található, akkor megjelenik egy figyelmeztető felirat!', () => {
        cy.get("[data-cy='searchbar']").type("nincs");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.get("[data-cy='no-data']").should("be.visible", true);
    });

    it('Hibát dob, ha nem töltünk ki minden mezőt!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='save-button']").click({force: true});
        cy.get("[data-cy='error-message']").should("have.text", "Töltsön ki minden mezőt!");
    });

    it('Helyes kitöltés esetén bezáródik a modal!', () => {
        cy.intercept("POST", "types", {status: 201}).as("saving");
        cy.get("[data-cy='add-button']").click({force: true});
        fillOutModal();
        cy.get("[data-cy='save-button']").click({force: true});
        cy.get("[data-cy='modal']").should('not.exist');
    });
});

const fillOutModal = () => {
    cy.get("[data-cy='name-input']").type("Teszt");
    cy.get("[data-cy='name-en-input']").type("Test");
    cy.get("[data-cy='type-select']").select(0);
    cy.get("[data-cy='unit-select']").select(0);
    cy.get("[data-cy='image-input']").type("Test.png");
};
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
        cy.get("[data-cy='my-score']").should('have.css', 'background-color').and('eq', 'rgb(173, 255, 47)')
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

    it('A paginátor gombjai le vannak tiltva, mivel visszafelé mínuszba nem tudsz lépni és előre sem, mert kevés adat van!', () => {
        cy.get("[data-cy='show-all-checkbox']").click({force: true});
        cy.get("[data-cy='paginator-back']").should("be.disabled", true);
        cy.get("[data-cy='paginator-forward']").should("be.disabled", true);
    });

    it('Élelmiszerre kereséskor megjelenik, amire kerestünk!', () => {
        cy.get("[data-cy='searchbar']").type("apple");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.get("[data-cy='stored-item']").should("have.length", 1);
        cy.get("[data-cy='item-title']").should("contain", "Alma");
    });

    it('Élelmiszerre kereséskor, ha a keresett termék nem található, akkor megjelenik egy figyelmeztető felirat!', () => {
        cy.get("[data-cy='searchbar']").type("nincs");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.get("[data-cy='no-items-text']").should("be.visible", true);
    });

    it('Nem lehet számra keresni!', () => {
        cy.get("[data-cy='searchbar']").type(2);
        cy.get("[data-cy='search-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('A keresett szó csak betűket tartalmazhat!')   
        })
    });

    it('Nem lehet 3 betűnél kisebb szóra keresni!', () => {
        cy.get("[data-cy='searchbar']").type("ab");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('A keresett szó túl rövid!')   
        })
    });

    it('Ha keresni szeretnénk ki kell tölteni a keresőmezőt!', () => {
        cy.get("[data-cy='search-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('Töltse ki a mezőt!')   
        })
    });
});
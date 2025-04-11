Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A konyhám oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("user");
        cy.visit(`/items`);
    });

    it('Az élelmiszerem mennyiségét akarom növelni, akkor megjelennek az adatai és a növelés ikonja!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='add-span']").click({force: true});
                cy.get("[data-cy='uparrow']").should("be.visible", true);
                cy.get("[data-cy='modified-item-title']").should("contain", "Paradicsom");   
                cy.get("[data-cy='modified-unit']").should("contain", "darab");   
                cy.get("[data-cy='old-quantity']").should("contain", "2");      
                cy.get("[data-cy='new-quantity']").should("contain", "2");      
            }
        });
    });

    it('Az élelmiszerem mennyiségét akarom csökkenteni, akkor megjelennek a lenullázó gomb és a csökkenés ikonja!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='reduce-span']").click({force: true});
                cy.get("[data-cy='downarrow']").should("be.visible", true); 
                cy.get("[data-cy='zerofier-button']").should("be.visible", true); 
            }
        });
    });

    it('Az élelmiszerem mennyisége negatív lenne akkor az új mennyiség 0 lesz, egyébként meg helyesen von ki!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='reduce-span']").click({force: true});
                const qtyInput = cy.get("[data-cy='quantity-input']");
                
                qtyInput.type(10);
                cy.get("[data-cy='new-quantity']").should("contain", "0");

                qtyInput.clear()
                qtyInput.type(1);
                cy.get("[data-cy='new-quantity']").should("contain", "1");
            }
        });
    });

    it('Az élelmiszerem mennyisége növelni tudom és jól számol!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='add-span']").click({force: true});
                const qtyInput = cy.get("[data-cy='quantity-input']");
                
                qtyInput.type(10);
                cy.get("[data-cy='new-quantity']").should("contain", "12");
            }
        });
    });

    it('Az élelmiszerem mennyiség megadásakor negatív szám és 10000-nél nagyobb szám nem lehet!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='add-span']").click({force: true});
                const qtyInput = cy.get("[data-cy='quantity-input']");
                
                qtyInput.type(100000);
                cy.get("[data-cy='new-quantity']").should("contain", "10002");

                qtyInput.clear()
                qtyInput.type(-2);
                cy.get("[data-cy='new-quantity']").should("contain", "2");
            }
        });
    });

    it('Az élelmiszerem mennyiségét akarom csökkenteni, a lenullázó gomb megnyomására az új mennyiség 0 lesz!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='reduce-span']").click({force: true});
                cy.get("[data-cy='zerofier-button']").click({force: true});
                cy.get("[data-cy='new-quantity']").should("contain", "0");
            }
        });
    });

    it('Az mégsem gombra nyomva bezárul a Mennyiség váltó Popup ablakok!', () => {
        cy.get("[data-cy='type-card']").each(($card, index) => {
            if (index == 0) {
                cy.wrap($card).click({force: true});
                cy.get("[data-cy='reduce-span']").click({force: true});
                cy.get("[data-cy='cancel-button']").click({force: true});
                cy.get("[data-cy='cancel-button']").should('not.exist');
            }
        });
    });

    it('Az új felvétele gomb megnyomására felugrik egy PopUp ablak!', () => {
        cy.get("[data-cy='new-button']").click({force: true});
        cy.get("[data-cy='types-select']").should("be.visible", true);
        cy.get("[data-cy='item-select']").should("be.visible", true);
        cy.get("[data-cy='item-select']").should("be.disabled", true);
        cy.get("[data-cy='new-quantity-input']").should("be.visible", true);
        cy.get("[data-cy='new-quantity-input']").should("be.disabled", true);
        cy.get("[data-cy='new-save-button']").should("be.visible", true);
        cy.get("[data-cy='new-cancel-button']").should("be.visible", true);
    });

    it('Az mégsem gombra nyomva bezárul az Új felvétele váltó Popup ablakok!', () => {
        cy.get("[data-cy='new-button']").click({force: true});
        cy.get("[data-cy='new-cancel-button']").click({force: true});
        cy.get("[data-cy='new-cancel-button']").should('not.exist');
    });

    it('Az új felvételekor helytelen mennyiségre hibát dob!', () => {
        cy.get("[data-cy='new-button']").click({force: true});
        cy.get("[data-cy='types-select']").select("1");
        cy.wait(500);
        cy.get("[data-cy='item-select']").select(0)

        const qtyInput = cy.get("[data-cy='new-quantity-input']");

        qtyInput.type(0);
        cy.get("[data-cy='new-save-button']").click();
        cy.get("[data-cy='new-popup-error']").should("contain", "Helytelen mennyiség!");

        qtyInput.clear()
        qtyInput.type(100000);
        cy.get("[data-cy='new-save-button']").click();
        cy.get("[data-cy='new-popup-error']").should("contain", "Helytelen mennyiség!");
    });

    it('Ha olyan terméket szeretnénk felvenni, ami már bent van a konyhánkban, akkor hibát dob!', () => {
        cy.get("[data-cy='new-button']").click({force: true});
        cy.get("[data-cy='types-select']").select("2");
        cy.wait(500);
        cy.get("[data-cy='item-select']").select(0)

        const qtyInput = cy.get("[data-cy='new-quantity-input']");

        qtyInput.type(10);
        cy.get("[data-cy='new-save-button']").click();
        cy.get("[data-cy='new-popup-error']").should("contain", "Már van ilyen a konyhádban!");
    });

    it('Ha nem választottunk ki semmit, akkor hibát dob!', () => {
        cy.get("[data-cy='new-button']").click({force: true});
        cy.get("[data-cy='new-save-button']").click();
        cy.get("[data-cy='new-popup-error']").should("contain", "Helytelen mennyiség!");
    });
});
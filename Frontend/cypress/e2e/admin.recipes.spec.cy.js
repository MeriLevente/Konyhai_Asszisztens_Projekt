Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('A admin recept oldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.loginWithRole("admin");
        cy.visit(`/admin`);
        cy.get("[data-cy='admin-block']").eq(2).click({force: true});
    });

    it('Az új felvétele gomb nyomásra megjelenik a receptíró oldal!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='recipe-editor']").should("be.visible");
    });

    it('Az törlés gomb nyomásra hibát dob, mivel az elemre az adatbázisban másik táblában hivatkoznak!', () => {
        cy.get("[data-cy='data-tr']").eq(0).find("[data-cy='delete-button']").click({force: true});
        cy.on('window:alert', (text) => {
            expect(text).to.eq('Receptet nem lehet törölni, mert 1 hozzávaló hivatkozik rá!');
        });
    });

    it('Az receptíró bezáró gombja bezárja tényleg!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='close-button']").click({force: true});
        cy.get("[data-cy='recipe-editor']").should('not.exist');
    });

    it('Módosítás gombra nyomva megjelenik a receptíró és a recept adatai (lépések száma, hozzávalók)!', () => {
        cy.get("[data-cy='data-tr']").eq(1).find("[data-cy='edit-button']").click({force: true});
        cy.get("[data-cy='recipe-editor']").should("be.visible");
        cy.get("[data-cy='stephu']").should("have.length", 2);
        cy.get("[data-cy='ingredient-div']").should("have.length", 1);
    });

    it('Helyesen felvett lépés megjelenik oldalt!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='step-textarea']").type("Test step");
        cy.get("[data-cy='save-step']").click({force: true});
        cy.get("[data-cy='stephu']").should("have.length", 1);
        cy.get("[data-cy='stephu']").should("contain", "Test step");
        cy.get("[data-cy='stephu-input']").invoke("val").should("equal", "2");
    });

    it('Tud lépést módosítani!', () => {
        cy.get("[data-cy='data-tr']").eq(1).find("[data-cy='edit-button']").click({force: true});
        cy.get("[data-cy='step-textarea']").type("Modified Test step");
        cy.get("[data-cy='save-step']").click({force: true});
        cy.get("[data-cy='stephu']").should("have.length", 2);
        cy.get("[data-cy='stephu']").eq(0).should("contain", "Modified Test step");
    });

    it('Hibát dob ha nem töltötte ki a lépés mezőt!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='save-step']").click({force: true});
        cy.get("[data-cy='step-error']").should("have.text", "Töltse ki a lépés mezőt!");
    });

    it('Hibát dob ha a lépés mező "#" karaktert tartalmaz!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='step-textarea']").type("Test ste#p");
        cy.get("[data-cy='save-step']").click({force: true});
        cy.get("[data-cy='step-error']").should("have.text", "Kérem ne használja a '#' karaktert!");
    });

    it('Hibát dob ha érvénytelen a lépés szám (0 vagy negatív, 4-nél több vagy 1-gyel több a jelenlegi lépésnél)!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='step-textarea']").type("Test step");
        
        invalidStepInput(0);
        invalidStepInput(2);
        invalidStepInput(5);
    });

    it('Kereséskor, ha a keresett szó nem található, akkor megjelenik egy figyelmeztető felirat!', () => {
        cy.get("[data-cy='searchbar']").type("nincs");
        cy.get("[data-cy='search-button']").click({force: true});
        cy.get("[data-cy='no-data']").should("be.visible");
    });

    it('Hibát dob, ha nem töltünk ki minden mezőt!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='diff-input']").type(3);
        cy.get("[data-cy='time-input']").type(3);
        cy.get("[data-cy='save-button']").click({force: true});
        cy.get("[data-cy='recipe-error']").should("have.text", "Töltsön ki minden mezőt!");
    });

    it('Helyes kitöltés esetén bezáródik a receptíró!', () => {
        cy.intercept("POST", "recipes", {status: 201}).as("saving");
        cy.get("[data-cy='add-button']").click({force: true});
        fillOutData();
        cy.get("[data-cy='save-button']").click({force: true});
        cy.get("[data-cy='recipe-editor']").should('not.exist');
    });

    it('Amíg nem választottunk élelmiszertípust addig a élelmiszer kiválasztó le van tiltva!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        cy.get("[data-cy='item-select']").should("be.disabled");
        cy.get("[data-cy='itemtype-select']").select(0);
        cy.get("[data-cy='item-select']").should("not.be.disabled");
    });

    it('Helytelen hozzávaló mennyiség megadásakor hibát dob (negatív darab)!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        invalidQuantityInput(-1);
    });

    it('Helytelen hozzávaló mennyiség megadásakor hibát dob (túl nagy)!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        invalidQuantityInput(100000);
    });

    it('Helyesen felvett hozzávaló megjelenik az oldalon!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        addNewIngredient();
        cy.get("[data-cy='ingredient-div']").should("contain", "Burgonya");
        cy.get("[data-cy='ingredient-div']").should("contain", "10");
    });

    it('Helyesen felvett hozzávaló törlés után nem látható!', () => {
        cy.get("[data-cy='add-button']").click({force: true});
        addNewIngredient();
        cy.get("[data-cy='delete-ingredient']").click({force: true});
        cy.get("[data-cy='ingredient-div']").should('not.exist');
    });

    it('Ha egy olyan hozzávalót akarok felvenni, ami már le van rögzítve, akkor a mennyiségét hozzáadja és nem új keletkezik!', () => {
        cy.get("[data-cy='data-tr']").eq(1).find("[data-cy='edit-button']").click({force: true});
        cy.get("[data-cy='itemtype-select']").select(1);
        cy.get("[data-cy='item-select']").select(0);
        cy.get("[data-cy='quantity-input']").type(10);
        cy.get("[data-cy='save-ingredient']").click({force: true});
        cy.get("[data-cy='ingredient-div']").should("contain", "30");
        cy.get("[data-cy='ingredient-div']").should("have.length", 1);
    });
});

const fillOutData = () => {
    cy.get("[data-cy='name-input']").type("Teszt");
    cy.get("[data-cy='name-en-input']").type("Test");
    cy.get("[data-cy='type-select']").select(0);
    cy.get("[data-cy='diff-input']").type(3);
    cy.get("[data-cy='time-input']").type(3);
    cy.get("[data-cy='image-input']").type("Test.png");
    cy.get("[data-cy='step-textarea']").type("Teszt lépés");
    cy.get("[data-cy='save-step']").click({force: true});
    cy.get("[data-cy='language-select']").select("en");
    cy.get("[data-cy='step-textarea']").type("Test step");
    cy.get("[data-cy='save-step']").click({force: true});
};

const addNewIngredient = () => {
    cy.get("[data-cy='itemtype-select']").select(0);
    cy.get("[data-cy='item-select']").select(0);
    cy.get("[data-cy='quantity-input']").type(10);
    cy.get("[data-cy='save-ingredient']").click({force: true});
};

const invalidStepInput = (step) => {
    cy.get("[data-cy='stephu-input']").clear();
    cy.get("[data-cy='stephu-input']").type(step);  
    cy.get("[data-cy='save-step']").click({force: true});
    cy.get("[data-cy='step-error']").should("have.text", "Érvénytelen lépés szám!");
};

const invalidQuantityInput = (quantity) => {
    cy.get("[data-cy='itemtype-select']").select(0);
    cy.get("[data-cy='item-select']").select(0);
    cy.get("[data-cy='quantity-input']").type(quantity);
    cy.get("[data-cy='save-ingredient']").click({force: true});
    cy.get("[data-cy='ingredient-error']").should("have.text", "Helytelen mennyiséget adott meg!");
};
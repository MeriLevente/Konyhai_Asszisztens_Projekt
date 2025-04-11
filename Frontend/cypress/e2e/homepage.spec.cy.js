Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Főoldal tesztelése', () => {
    beforeEach(()=>{
        cy.task("seedDatabase");
        cy.visit(`/`);
    });

    it('A főoldal megjelenik!', () => {
        cy.location('pathname').should('eq', '/');
    });

    it('Ha nem vagyunk bejelentkezve, akkor ismeretlen szó van a köszönésben!', () => {
        cy.get("[data-cy='greeting-h1']").should("contain", "Szervusz, ismeretlen!");
    });

    it('A főoldalon 4 ismertető szürke div van!', () => {
        cy.get("[data-cy='home-togglers']").should("have.length", 4);
    });

    it('Az oldal betöltésekor az első ismertető divnek kell "kinyitott" állapotban lennie!', () => {
        cy.get("[data-cy='about-me-header']").should("be.visible");
    });

    it('A 2., 3. és 4. ismertető divben kell lennie egy regisztrál először gombnak vagy linknek, ha nem vagyunk bejelentkezve!', () => {
        cy.get("[data-cy='home-togglers']").each((toggler, index) => {
            cy.wrap(toggler).click({force: true});
            if (index != 0)
                cy.wrap(toggler).find("[data-cy='login-first']").should("be.visible");
        });
    });

    it('A navbar címe megjelenik és helyes szöveget jelenít meg!', () => {
        cy.get("[data-cy='navbar-title']").should("contain", "DiKAMON");
    });

    it('Ha nem vagyunk bejelentkezve akkor csak a Főoldal és Bejelentkezés található a navbarban!', () => {
        cy.get("[data-cy='navbar-link']").should("have.length", 2);
    });

    it('A kijelentkezés gomb nem jelenik meg, ha nem vagyunk bejelentkezve!', () => {
        cy.get("[data-cy='logout-button']").should('not.exist');
    });

    it('Az oldal nyelvét váltó gomb megjelenik és kattintásra nyelvet vált!', () => {
        cy.get("[data-cy='lang-button']").should("be.visible");
        cy.get("[data-cy='lang-button']").click({force: true});
        cy.window().then((win) => {
            expect(win.localStorage.getItem('lang'), 'App language').to.equal('en');
        });
    });

    it('Bejelentkezés után a navbarban a Konyhám és Receptek találhatóak!', () => {
        cy.loginWithRole("user");
        const links = ["Konyhám", "Receptek"];
        cy.get("[data-cy='navbar-link']").each((link, index) => {
            if (index != 0)
                cy.wrap(link).should("contain", links[index - 1]);
        });
    });

    it('Bejelentkezés után a felhasználó neve van a köszönésben!', () => {
        cy.loginWithRole("user");
        cy.get("[data-cy='greeting-h1']").should("contain", "Szervusz, Manusz Márton!");
    });

    it('A kijelentkezés gomb meg jelenik, ha be vagyunk jelentkezve!', () => {
        cy.loginWithRole("user");
        cy.get("[data-cy='logout-button']").should('exist');
    });

    it('A 3. ismertető divben bejelentkezés után kell lennie egy gombnak, ami elvisz a Konyhám oldalra!', () => {
        cy.loginWithRole("user");
        cy.get("[data-cy='home-togglers']").each((toggler, index)=> {
            if (index == 2) {
                cy.wrap(toggler).click({force: true});
                cy.wrap(toggler).find(".recipebook-btn").click({force: true});
                cy.location('pathname').should('eq', '/items');
            };
        });
    });

    it('A 4. ismertető divben bejelentkezés után kell lennie egy gombnak, ami elvisz a Receptek oldalra!', () => {
        cy.loginWithRole("user");
        cy.get("[data-cy='home-togglers']").each((toggler, index) => {
            if (index == 3) {
                cy.wrap(toggler).click({force: true});
                cy.wrap(toggler).find(".recipebook-btn").click({force: true});
                cy.location('pathname').should('eq', '/recipes');
            };
        });
    });
})
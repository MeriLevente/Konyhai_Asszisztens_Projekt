Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

var nameInput;
var emailInput;
var passwordInput;
var confirmPasswordInput;
var submitBtn;
var errorMessage;

describe('Regisztráló oldal tesztelése', () => {
  beforeEach(()=>{
    cy.visit(`/register`);
    nameInput = cy.get("[data-cy='name-input']");
    emailInput = cy.get("[data-cy='email-input']");
    passwordInput = cy.get("[data-cy='password-input']");
    confirmPasswordInput = cy.get("[data-cy='confirm-password-input']");
    submitBtn = cy.get("[data-cy='submit-button']");
  })
  it('A regisztrációs oldal megjelenik!', () => {
    cy.location('pathname').should('eq', '/register');
  });
  it('Hibát dob, ha nincsen minden mező kitöltve!', () => {
    fillOutForm();
    emailInput.clear();
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "Töltsön ki minden mezőt!");
  });
  it('Érvénytelen email cím esetén hibát dob!', ()=> {
    fillOutForm();
    emailInput.clear();
    emailInput.type("testing-bad-email.com");
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "Az email cím érvénytelen!");
  })
  it('Túl rövid jelszó megadásakor hibát dob!', ()=> {
    fillOutForm();
    passwordInput.clear();
    passwordInput.type("hello");
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "A jelszó legyen legalább 8 karakter!");
  })
  it('Érvénytelen jelszó megadásakor hibát dob!', ()=> {
    fillOutForm();
    passwordInput.clear();
    passwordInput.type("hellooo ooo");
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "A jelszó érvénytelen karaktert tartalmaz!");
  })
  it('Ha a jelszó nem tartalmaz legalább 1 nagy betűt és 1 számot, akkor hibát dob!', ()=> {
    fillOutForm();
    passwordInput.clear();
    passwordInput.type("hellooooo4");
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "A jelszó tartalmazzon legalább 1 nagy betűt és 1 számot!");
  })
  it('Ha a jelszó megerősítés input tartalma nem egyezik a jelszó input tartalmával, akkor hibát dob!', ()=> {
    fillOutForm();
    passwordInput.clear();
    passwordInput.type("jelszo12A");
    submitBtn.click({force: true});
    cy.get("[data-cy='error-message']").should('contain', "A két jelszó nem egyezik!");
  }),
  it("Sikeres bejelentkezés után át dob a főoldalra!", ()=> {
    fillOutForm();
    submitBtn.click({force: true});
    cy.intercept("POST", "register", {status: 201}).as("register");
    cy.wait(3000);
    cy.location('pathname').should('eq', '/');
  }),
  it("Sikertelen bejelentkezéskor a hibaüzenet megjelenik és nem dob át a főoldalra!", ()=> {
    fillOutForm();
    emailInput.clear();
    emailInput.type("marton@gmail.com");
    submitBtn.click({force: true});
    cy.intercept("POST", "register", {
      statusCode: 400,  
      body: {
        hu: "Ilyen felhasználó már létezik!",
        en: "User already exists!"
      }
    }).as("registerFailed");
    cy.wait(3000);
    cy.get("[data-cy='error-message']").should('contain', "Ilyen felhasználó már létezik!");
    cy.location('pathname').should('eq', '/register');
  })
});

function fillOutForm(){
  nameInput.type("Teszt Elek");
  emailInput.type("test@gmail.com");
  passwordInput.type("TesztJelszo123");
  confirmPasswordInput.type("TesztJelszo123");
};
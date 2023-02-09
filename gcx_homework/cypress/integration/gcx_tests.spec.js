describe ("Verify user can login to GuideCX", () => {

    before (() => {
        cy.fixture('logindata').then(function (testdata) {
            this.testdata = testdata
        })

        Cypress.config('defaultCommandTimeout', 30000)

        System.visitGcxLoginPage()
    })

    beforeEach (() => {

    })

    after (() => {

    })

    it("Logs into GuideCX", function() {
        LoginPage.enterEmailAddress(this.testdata.email)
        LoginPage.enterPassword(this.testdata.password)
        LoginPage.loginButton()

        cy.contains('Projects')
          .should('be.visible')
    })
})


describe ("Add a new team member to a project", () => {
    before (() => {
        cy.fixture('logindata').then(function (logindata) {
            this.logindata = logindata
        })
        Cypress.config('defaultCommandTimeout', 30000)
    })

    beforeEach(function() {
        System.visitGcxLoginPage()
        LoginPage.login(this.logindata.email, this.logindata.password)
        cy.get('[data-testid="project-name"]')
          .should('be.visible')
})

    it("Adds a new team member to an existing project", function () {
        // I'm not a fan of needing so many checks in the middle of the test
        // but app slowness requires forced slowdowns. 

        ProjectPage.clickProjectRow()

        cy.get('[data-testid="project-team-tab"]')
          .should('be.visible')

        cy.wait(10000) //This is gross, but clicking on it too soon reloads the Plan page >:(

        MyProjectPage.clickTeamTab()

        cy.get('[data-test="options-ajditto@gmail.com"]')
          .should('be.visible')

        MyProjectPage.clickAddTeamMemberButton()

        cy.get('[data-testid="close-drawer"]')
          .should('be.visible')

        MyProjectPage.clickInternalTab()
        MyProjectPage.toggleTeamMember()
        MyProjectPage.clickAddUserButton()

        cy.contains("Team Member Added")
          .should('be.visible')

    })
})


class System {
    static visitGcxLoginPage() {
        cy.log("Navigating to Login Page")
        cy.visit("https://app.guidecx.com/auth/login")
    }
}
class LoginPage {
    // Login page functions
    static enterEmailAddress(email) {
        cy.get('[type=email]')
          .focus()
          .type(email)
    }

    static enterPassword(password) {
        cy.get('[type=password')
          .focus()
          .type(password)
    }

    static loginButton() {
        cy.get('[type=submit]')
          .click()
    }

    static login(email, password) {
        this.enterEmailAddress(email)
        this.enterPassword(password)
        this.loginButton()
    }
}

class ProjectPage {
    static clickProjectRow() {
        cy.get('[data-testid="project-name"]')
          .contains('Andrew Ditto')
          .click()
    }
}

class MyProjectPage {

    static clickTeamTab () {
        cy.get('[data-testid="project-team-tab"]')
          .click({force: true})
    }

    static clickAddTeamMemberButton() {
        cy.get('button')
          .contains('Add Team Member')
          .click({force: true})
    }

    static clickInternalTab() {
        cy.get('button')
          .contains('Internal')
          .click()
    }

    static toggleTeamMember() {
        cy.get('[data-testid="toggleNotChecked"]')
          .first()
          .click()
    }

    static clickAddUserButton() {
        cy.get('button')
          .contains('Add Users')
          .click()
    }
}
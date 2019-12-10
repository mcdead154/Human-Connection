import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import { VERSION } from '../../constants/terms-and-conditions-version.js'
import { gql } from '../../../backend/src/helpers/jest'

/* global cy  */

let lastReportTitle
let davidIrvingPostTitle = 'The Truth about the Holocaust'
let davidIrvingPostSlug = 'the-truth-about-the-holocaust'
let annoyingUserWhoBlockedModeratorTitle = 'Fake news'

const savePostTitle = $post => {
  return $post
    .first()
    .find('.ds-heading')
    .first()
    .invoke('text')
    .then(title => {
      lastReportTitle = title
    })
}

Given("I see David Irving's post on the landing page", page => {
  cy.openPage('landing')
})

Given("I see David Irving's post on the post page", page => {
  cy.visit(`/post/${davidIrvingPostSlug}`)
  cy.contains(davidIrvingPostTitle) // wait
})

Given('I am logged in with a {string} role', role => {
  cy.factory().create('User', {
    email: `${role}@example.org`,
    password: '1234',
    termsAndConditionsAgreedVersion: VERSION,
    role
  })
  cy.login({
    email: `${role}@example.org`,
    password: '1234'
  })
})

When('I click on "Report Post" from the content menu of the post', () => {
  cy.contains('.ds-card', davidIrvingPostTitle)
    .find('.content-menu-trigger')
    .click({force: true})

  cy.get('.popover .ds-menu-item-link')
    .contains('Report Post')
    .click()
})

When('I click on "Report User" from the content menu in the user info box', () => {
  cy.contains('.ds-card', davidIrvingPostTitle)
    .get('.user-content-menu .content-menu-trigger')
    .click({ force: true })

  cy.get('.popover .ds-menu-item-link')
    .contains('Report User')
    .click()
})

When('I click on the author', () => {
  cy.get('.username')
    .click()
    .url().should('include', '/profile/')
})

When('I report the author', () => {
  cy.get('.page-name-profile-id-slug').then(() => {
    invokeReportOnElement('.ds-card').then(() => {
      cy.get('button')
        .contains('Send')
        .click()
    })
  })
})

When('I click on send in the confirmation dialog', () => {
  cy.get('button')
    .contains('Send')
    .click()
})

Then('I get a success message', () => {
  cy.get('.iziToast-message').contains('Thanks')
})

Then('I see my reported user', () => {
  cy.get('table').then(() => {
    cy.get('tbody tr')
      .first()
      .contains(lastReportTitle.trim())
  })
})

Then(`I can't see the moderation menu item`, () => {
  cy.get('.avatar-menu-popover')
    .find('a[href="/settings"]', 'Settings')
    .should('exist') // OK, the dropdown is actually open

  cy.get('.avatar-menu-popover')
    .find('a[href="/moderation"]', 'Moderation')
    .should('not.exist')
})

When(/^I confirm the reporting dialog .*:$/, message => {
  cy.contains(message) // wait for element to become visible
  cy.get('.ds-modal').within(() => {
    cy.get('.ds-radio-option-label')
      .first()
      .click({
        force: true
      })
    cy.get('button')
      .contains('Report')
      .click()
  })
})

Given('somebody reported the following posts:', table => {
  table.hashes().forEach(({ submitterEmail, resourceId, reasonCategory, reasonDescription }) => {
    const submitter = {
      email: submitterEmail,
      password: '1234'
    }
    cy.factory()
      .create('User', submitter)
      .authenticateAs(submitter)
      .mutate(gql`mutation($resourceId: ID!, $reasonCategory: ReasonCategory!, $reasonDescription: String!) {
        fileReport(resourceId: $resourceId, reasonCategory: $reasonCategory, reasonDescription: $reasonDescription) {
          id
        }
      }`, {
        resourceId,
        reasonCategory,
        reasonDescription
      })
  })
})

Then('I see all the reported posts including the one from above', () => {
  cy.get('table tbody').within(() => {
    cy.contains('tr', davidIrvingPostTitle)
  })
})

Then('I see all the reported posts including from the user who blocked me', () => {
  cy.get('table tbody').within(() => {
    cy.contains('tr', annoyingUserWhoBlockedModeratorTitle)
  })
})

Then('each list item links to the post page', () => {
  cy.contains(davidIrvingPostTitle).click()
  cy.location('pathname').should('contain', '/post')
})

Then('I can visit the post page', () => {
  cy.contains(annoyingUserWhoBlockedModeratorTitle).click()
  cy.location('pathname').should('contain', '/post')
    .get('h3').should('contain', annoyingUserWhoBlockedModeratorTitle)
})

When("they have a post someone has reported", () => {
  cy.factory()
    .create("Post", {
      authorId: 'annnoying-user',
      title,
    });
    
})

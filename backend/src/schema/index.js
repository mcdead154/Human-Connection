import { makeAugmentedSchema } from 'neo4j-graphql-js'
import typeDefs from './types'
import resolvers from './resolvers'

export default makeAugmentedSchema({
  typeDefs,
  resolvers,
  config: {
    query: {
      exclude: [
        'Badge',
        'Embed',
        'InvitationCode',
        'EmailAddress',
        'Notfication',
        'Statistics',
        'LoggedInUser',
        'Location',
        'SocialMedia',
        'NOTIFIED',
        'REPORTED',
      ],
      // add 'User' here as soon as possible
    },
    mutation: {
      exclude: [
        'Badge',
        'Embed',
        'InvitationCode',
        'EmailAddress',
        'Notfication',
        'Post',
        'Comment',
        'Statistics',
        'LoggedInUser',
        'Location',
        'SocialMedia',
        'User',
        'EMOTED',
        'NOTIFIED',
        'REPORTED',
      ],
      // add 'User' here as soon as possible
    },
  },
})

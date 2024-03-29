const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const {
  globalIdField,
} = require('graphql-relay');

const ProfilePrefs = require('./ProfilePrefs');

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: globalIdField('Profile', (doc) => doc._id),
    _id: {
      type: GraphQLString,
      resolve: (doc) => doc._id,
    },
    userId: {
      type: GraphQLString,
      resolve: (doc) => doc.userId,
    },
    name: {
      type: GraphQLString,
      resolve: (doc) => doc.firstName + ' ' + doc.lastName,
    },
    firstName: {
      type: GraphQLString,
      resolve: (doc) => doc.firstName,
    },
    lastName: {
      type: GraphQLString,
      resolve: (doc) => doc.lastName,
    },
    pictureUrl: {
      type: GraphQLString,
      resolve: (doc) => doc.pictureUrl,
    },
    gender: {
      type: GraphQLString,
      resolve: (doc) => doc.gender,
    },
    locale: {
      type: GraphQLString,
      resolve: (doc) => doc.locale,
    },
    timezone: {
      type: GraphQLInt,
      resolve: (doc) => doc.timezone,
    },
    prefs: {
      type: ProfilePrefs,
      resolve: (doc) => doc.prefs,
    },
  }),
  interfaces: [require('../node-definitions').nodeInterface],
});

module.exports = Profile;

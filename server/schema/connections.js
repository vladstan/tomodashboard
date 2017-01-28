const {connectionDefinitions} = require('graphql-relay');

const {
  connectionType: MessagesConnection,
  edgeType: MessageEdge,
} = connectionDefinitions({
  name: 'messages',
  nodeType: require('./types/Message'),
});

const {
  connectionType: IncomingRequestsConnection,
  edgeType: IncomingRequestEdge,
} = connectionDefinitions({
  name: 'incomingRequests',
  nodeType: require('./types/IncomingRequest'),
});

const {
  connectionType: SummaryFieldsConnection,
  edgeType: SummaryFieldEdge,
} = connectionDefinitions({
  name: 'summaryFields',
  nodeType: require('./types/SummaryField'),
});

const {
  connectionType: TripsConnection,
  edgeType: TripEdge,
} = connectionDefinitions({
  name: 'trips',
  nodeType: require('./types/Trip'),
});

const {
  connectionType: TripAccommodationConnection,
  edgeType: TripAccommodationEdge,
} = connectionDefinitions({
  name: 'accommodation',
  nodeType: require('./types/TripAccommodation'),
});

const {
  connectionType: TripActivitiesConnection,
  edgeType: TripActivityEdge,
} = connectionDefinitions({
  name: 'activities',
  nodeType: require('./types/TripActivity'),
});

const {
  connectionType: TripFlightsConnection,
  edgeType: TripFlightEdge,
} = connectionDefinitions({
  name: 'flights',
  nodeType: require('./types/TripFlight'),
});

const {
  connectionType: UsersConnection,
  edgeType: UserEdge,
} = connectionDefinitions({
  name: 'users',
  nodeType: require('./types/User'),
});

module.exports = {
  MessagesConnection,
  MessageEdge,
  IncomingRequestsConnection,
  IncomingRequestEdge,
  SummaryFieldsConnection,
  SummaryFieldEdge,
  TripsConnection,
  TripEdge,
  TripAccommodationConnection,
  TripAccommodationEdge,
  TripActivitiesConnection,
  TripActivityEdge,
  TripFlightsConnection,
  TripFlightEdge,
  UsersConnection,
  UserEdge,
};

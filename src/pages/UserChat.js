import React from 'react';
import Relay from 'react-relay';

import {
  PanelContainer,
  Panel,
  PanelBody,
  Grid,
  Row,
  Col,
  Form,
  FormControl } from '@sketchpixy/rubix';

import Todo from '../components/Todo';
import TodoForm from '../components/TodoForm';

// import AddTodoMutation from '../mutations/AddTodoMutation';
// import RemoveTodoMutation from '../mutations/RemoveTodoMutation';

// class AllTodos extends React.Component {
//   static contextTypes = {
//     relay: Relay.PropTypes.Environment,
//   };
//
//   render() {
//     let user = this.props.user;
//     let todos = user.todos.edges;
//
//     return (
//       <PanelContainer>
//         <Panel>
//           <PanelBody style={{padding: 0, paddingBottom: 25}}>
//             <Grid>
//               <Row>
//                 <Col xs={12}>
//                   <h3>Todo List:</h3>
//
//                   <TodoForm relay={this.context.relay} user={user} />
//
//                   {todos.map(({node}) => {
//                     return <Todo key={node.id} todo={node} user={user} />;
//                   })}
//                 </Col>
//               </Row>
//             </Grid>
//           </PanelBody>
//         </Panel>
//       </PanelContainer>
//     );
//   }
// }

class UserChat extends React.Component {
  render() {

  }
}

// const UserChatContainer = Relay.createContainer(UserChat, {
//   fragments: {
//   }
// });

export default UserChat;

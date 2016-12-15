import React from 'react';

class ChatConversationItem extends React.Component {

  static propTypes = {
    position: React.PropTypes.oneOf(['left', 'right']).isRequired,
    avatarUrl: React.PropTypes.string.isRequired,
    imageUrl: React.PropTypes.string,
    text: React.PropTypes.string,
    cards: React.PropTypes.arrayOf(React.PropTypes.shape({
      pictureUrl: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
    }).isRequired),
  }

  render() {
    return (
      <li tabIndex='-1' style={{
        textAlign: this.props.position,
        display: 'block',
        marginBottom: '15px',
        listStyle: 'none',
      }}>
        {this.props.position === 'left' && this._renderAvatar()}
        {this._renderBody()}
        {this.props.position === 'right' && this._renderAvatar()}
      </li>
    );
  }

  _renderAvatar() {
    return (
      <img
        src={this.props.avatarUrl}
        width='30'
        height='30'
        style={{
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 100,
          verticalAlign: 'top',
          padding: 2,
          position: 'relative',
          top: -7,
        }} />
    );
  }

  _renderBody() {
    if (this.props.imageUrl) {
      return this._renderImage();
    } else if (this.props.cards && this.props.cards.length) {
      return this._renderCards();
    } else {
      return this._renderText();
    }
  }

  _renderImage() {
    return (
      <span
        className='body'
        style={{
          position: 'relative',
          top: -2,
          padding: '10px 15px 8px',
          borderRadius: '20px',
          marginLeft: '10px',
          marginRight: '10px',
        }}>
        <img src={this.props.imageUrl} style={{maxWidth: 300, maxHeight: 300}} />
      </span>
    );
  }

  _renderCards() {
    return (
      <span
        className='body'
        style={{
          position: 'relative',
          top: -2,
          padding: '10px 15px 8px',
          borderRadius: '20px',
          marginLeft: '10px',
          marginRight: '10px',
        }}>
        {
          this.props.cards.map((c) => (
            <div key={JSON.stringify(c)}>
              <img src={c.pictureUrl} style={{maxWidth: 300, maxHeight: 200}} />
              <p style={{background: '#F3F1F2', padding: '10px 15px 8px', borderRadius: '20px'}}>
                {c.title}
                <br/>
                <span style={{fontSize: 12}}>{c.description}</span>
              </p>
            </div>
          ))
        }
      </span>
    );
  }

  _renderText() {
    let {text} = this.props;
    text = text || '<no text>';

    const checkPayload = (prefix, genText) => {
      if (text.startsWith(prefix)) {
        const data = JSON.parse(text.substr(prefix.length));
        text = genText(data);
      }
    };

    checkPayload('@BOOK_FLIGHT:', (data) => 'Booked flight with ' + data.airline + ' for ' + data.price);
    checkPayload('@BOOK_ACCOMMODATION:', (data) => 'Booked accommodation at ' + data.name + ' for ' + data.price);
    checkPayload('@BOOK_ACTIVITY:', (data) => 'Booked activity ' + data.name + ' for ' + data.price);

    return (
      <span
        className='body'
        style={{
          position: 'relative',
          top: -2,
          background: '#F3F1F2',
          padding: '10px 15px 8px',
          borderRadius: '20px',
          marginLeft: '10px',
          marginRight: '10px',
        }}
        >{text}</span>
    );
  }

}

export default ChatConversationItem;

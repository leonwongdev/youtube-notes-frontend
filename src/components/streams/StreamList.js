import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStreams } from '../../actions';
import Modal from '../Modal';

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showedTutorial: true };
  }

  componentDidMount() {
    this.props.fetchStreams();
  }

  renderAdmin(stream) {
    if (stream.userId === this.props.currentUserId) {
      return (
        <div className="right floated content">
          <Link to={`/streams/edit/${stream.id}`} className="ui button primary">
            Edit
          </Link>
          <Link
            to={`/streams/delete/${stream.id}`}
            className="ui button negative"
          >
            Delete
          </Link>
        </div>
      );
    }
  }

  renderList() {
    if (!this.props.streams.length) {
      return (
        <div className="ui segment">
          <p></p>
          <div className="ui active dimmer">
            <div className="ui loader"></div>
          </div>
        </div>
      );
    }
    return this.props.streams.map((stream) => {
      const content =
        stream.description.length > 100
          ? stream.description.substring(0, 100) + ' ... Read More'
          : stream.description;
      return (
        <div className="item" key={stream.id}>
          {this.renderAdmin(stream)}
          <i className="large middle aligned icon video" />
          {/* <img
            className="ui mini image"
            src="https://www.youtube.com/img/desktop/yt_1200.png"
          /> */}
          <div className="content">
            <Link to={`/streams/${stream.id}`} className="header">
              {stream.title}
            </Link>
            <div className="description">{content}</div>
          </div>
        </div>
      );
    });
  }

  renderCreate() {
    if (this.props.isSignedIn && this.props.streams.length) {
      return (
        <div style={{ textAlign: 'right' }}>
          <Link to="/streams/new" className="ui button primary">
            Add Your Favorite CS Video
          </Link>
        </div>
      );
    }
  }

  renderTutorialButton() {
    return (
      <div style={{ textAlign: 'left' }}>
        <button
          className="ui button green"
          onClick={() => {
            this.setState(() => {
              return {
                showedTutorial: false,
              };
            });
          }}
        >
          Tutorial
        </button>
      </div>
    );
  }

  renderTutorialContent = () => {
    return (
      <div>
        <p>
          Sign in with Google account to add/edit/delete your own video notes.
        </p>
        <p>
          Your Google account will only be used to create an user id for
          identifying your video notes. No personal data is collected.
        </p>
      </div>
    );
  };

  onDismissModal = () => {
    this.setState(() => {
      console.log(this.state.showedTutorial);
      return {
        showedTutorial: true,
      };
    });
  };

  renderTutorialModal = () => {
    if (this.state.showedTutorial) {
      return;
    }
    return (
      <Modal
        title="How to use this app?"
        content={this.renderTutorialContent()}
        actions={
          <div>
            <button className="ui button" onClick={this.onDismissModal}>
              Dismiss
            </button>
          </div>
        }
        onDismiss={this.onDismissModal}
      />
    );
  };

  render() {
    return (
      <div>
        <h2>Streams</h2>
        {this.renderTutorialButton()}
        <div className="ui celled list">{this.renderList()}</div>
        {this.renderCreate()}
        {this.renderTutorialModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    streams: Object.values(state.streams),
    currentUserId: state.auth.userId,
    isSignedIn: state.auth.isSignedIn,
  };
};

export default connect(mapStateToProps, { fetchStreams })(StreamList);

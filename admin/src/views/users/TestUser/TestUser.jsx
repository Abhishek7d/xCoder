import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import { Test } from './TestUser.styles';

class TestUser extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentWillMount = () => {
    console.log('TestUser will mount');
  }

  componentDidMount = () => {
    console.log('TestUser mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('TestUser will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('TestUser will update', nextProps, nextState);
  }


  componentDidUpdate = () => {
    console.log('TestUser did update');
  }

  componentWillUnmount = () => {
    console.log('TestUser will unmount');
  }

  render () {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="TestUserWrapper">
        Test content
      </div>
    );
  }
}

TestUser.propTypes = {
  // bla: PropTypes.string,
};

TestUser.defaultProps = {
  // bla: 'test',
};

const mapStateToProps = state => ({
  // blabla: state.blabla,
});

const mapDispatchToProps = dispatch => ({
  // fnBlaBla: () => dispatch(action.name()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TestUser);

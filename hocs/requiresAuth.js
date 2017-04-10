import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { textCenterStyle } from '~/styles/inline';
import NoGroupPage from '~/modules/common/components/NoGroupPage';
import NoMultifactorPage from '~/modules/common/components/NoMultifactorPage';

// adapted from http://engineering.blogfoster.com/higher-order-components-theory-and-practice/
function requiresAuth(ComposedComponent) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      authState: PropTypes.object.isRequired
    };

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    componentDidMount() {
      const { route } = this.props;
      const { router } = this.context;
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      if (!this.props.authState.isLoggedIn) {
        this.context.router.push('/');
      }
    }

    render() {
      const renderAuthenticated = () => (
        <div className="authenticated">
          { !this.props.authState.access.hasGroup ? <NoGroupPage /> :
              !this.props.authState.access.hasMultifactor ? <NoMultifactorPage /> :
              <ComposedComponent { ...this.props } />
          }
        </div>
      );

      return (
        <div>
          { this.props.authState.isLoggedIn ? renderAuthenticated() : null }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      authState: state.authAppState
    };
  };

  return connect(
    mapStateToProps
  )(AuthenticatedComponent);
}

export default requiresAuth;

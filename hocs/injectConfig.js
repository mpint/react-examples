import React, { PropTypes } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lumiataTheme from '~/styles/lumiataMuiTheme';
import config from '~/config/content';

const muiTheme = getMuiTheme(lumiataTheme);

function injectConfiguration(BaseComponent) {
  class ConfiguredComponent extends React.Component {
    static childContextTypes = {
      config: PropTypes.object.isRequired,
      muiTheme: PropTypes.object.isRequired
    };

    getChildContext() {
      return { config, muiTheme };
    }

    render() {
      return ( <BaseComponent { ...this.props }/> );
    }
  }

  return ConfiguredComponent;
}

export default injectConfiguration;

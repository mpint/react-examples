import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '~/modules/jobs/state/jobs.ducks';
import EmbeddedView from '../components/EmbeddedView';
import { validatorSource } from '~/lib/embedded.constants';
import JobDashboard from '~/modules/jobs/components/JobDashboard';
import JobIcon from 'material-ui/svg-icons/av/play-arrow';
import TabbedView from '~/modules/common/components/TabbedView';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import { filterJobRunners } from '~/lib/utility.helpers';

class ValidatorPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      currentTab: ''
    };
  }
  componentWillMount = () => {
    this.props.params.tabSlug && this.resolveTab(this.props.params.tabSlug);
  }

  resolveTab = (currentTab) => {
    this.setState({ currentTab });
  }

  handleTabChange = (currentTab) => {
    const { location, route } = this.props;
    const currentPath = location.pathname.substr(0, location.pathname.indexOf(route.path)) + route.path;
    this.context.router.push(`${currentPath}/${currentTab}`);

    this.setState({ currentTab });
  }

  render() {
    const { companyName } = this.props.params;
    const { pages } = this.context.config;

    const validatorEndpoint = validatorSource(this.props.commonState.morpheusEnvironment, companyName);

    const runJobSaga = this.props.actions.runJobSaga.bind(this, companyName);

    const validatorJob = filterJobRunners(this.props.jobsState.jobs, 'validator', 'id');

    const pageList = Object.keys(pages.embedded.validator.pages)
      .map((pageName) => ({
        icon: <ChartIcon />,
        component: (
          <EmbeddedView
            height={ this.context.contentHeight }
            width={ this.context.contentWidth }
            url={ validatorEndpoint }/>
        ),
        messaging: pages.embedded.validator.pages[pageName]
      })
    );

    const jobRunnerConfig = {
      icon: <JobIcon />,
      component: <JobDashboard
        scopeList= { [ 'all' ] }
        jobs={ validatorJob }
        dependencyStatus={ this.props.commonState.schemaStatus.value }
        configurationUpdate={ this.props.actions.jobConfigurationUpdateSaga }
        reset={ this.props.actions.resetJob }
        run={ runJobSaga }/>,
      messaging: pages.embedded.validator.jobs.single
    };

    return (
      <TabbedView
        currentTab={ this.state.currentTab }
        onTabChange={ this.handleTabChange }
        pageList= { [ ...pageList, jobRunnerConfig ] }/>
    );
  }
}

ValidatorPage.contextTypes = {
  config: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  contentWidth: PropTypes.number.isRequired,
  contentHeight: PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    jobsState: state.jobsAppState,
    commonState: state.commonAppState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ValidatorPage);

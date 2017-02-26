import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '~/modules/common/state/companyInformation.ducks';

class CompanyRoot extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
    this.loadCompany(this.props.params.companyName);
  }

  componentWillReceiveProps = (nextProps) => {
    const nextCompany = nextProps.params.companyName;
    const currentCompany = this.props.params.companyName;

    if (nextCompany && nextCompany !== currentCompany) {
      this.loadCompany(nextCompany);
    }
  }

  loadCompany = (companyName) => {
    this.props.actions.companyInformationInjectionSaga(
      companyName, this.props.companyInformationState.companyDataList
    );
  }

  render () {
    return (
      <div> { this.props.children } </div>
    );
  }
}

CompanyRoot.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    companyInformationState: state.companyInformationAppState
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
)(CompanyRoot);

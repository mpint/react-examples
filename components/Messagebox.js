import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import InfoIcon from 'material-ui/svg-icons/action/info';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import WarningIcon from 'material-ui/svg-icons/alert/warning';

const Messagebox = (props, context) => {
  const { error, info, success, warning } = context.muiTheme.palette.messageBar;

  const commonStyles = { minHeight: 20 || props.height };

  const placeholderStyles = { ...commonStyles };

  const messageBoxStyles = {
    ...commonStyles,
    position: 'relative',
    display: 'inline-block',
    padding: 10,
    backgroundColor: props.hideColor ? 'none' :
      props.type === 'success' ? success :
      props.type === 'warning' ? warning :
      props.type === 'error' ? error : info
  };

  const iconStyles = {
    marginRight: 10, display: 'inline-block', verticalAlign: 'middle'
  };

  const getIcon = (type) => {
    return (
      type === 'success' ? <CheckIcon/> :
      type === 'warning' ? <WarningIcon/> :
      type === 'error' ? <CancelIcon/> :
      <InfoIcon/>
    );
  };

  const content = (text) => {
    return (
      <span>
        { !props.hideIcon && <span style={ iconStyles }> { getIcon(props.type) } </span> }
        <span> { props.text } </span>
      </span>
    );
  };

  return (
    props.text && props.isRaised ? <Paper style={ { ...messageBoxStyles, ...props.style } } zDepth={ 1 }> { content() } </Paper> :
    props.text && !props.isRaised ? <div style={ { ...messageBoxStyles, ...props.style } }> { content() } </div> :
    <div style={ { ...placeholderStyles, ...props.style } } />
  );
};

Messagebox.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

Messagebox.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  height: PropTypes.number,
  hideIcon: PropTypes.bool,
  hideColor: PropTypes.bool,
  isRaised: PropTypes.bool
};

export default Messagebox;

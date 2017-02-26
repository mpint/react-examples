import React from 'react';
import renderer from 'react-test-renderer';

import Messagebox from '../Messagebox';
import { wrapWithContext, muiTheme } from '~/lib/test.helpers';

describe('Messagebox', function() {
  it('should render', function() {
    const contextTypes = { muiTheme: React.PropTypes.object };
    const fields = {
      text: 'test',
      hideIcon: true
    };

    const component = renderer.create(
      wrapWithContext({ muiTheme }, contextTypes, <Messagebox { ...fields } />)
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

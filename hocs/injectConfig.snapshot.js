import React from 'react';
import renderer from 'react-test-renderer';

import { ConfiguredProvider } from '~/lib/test.helpers';

import injectConfig from '../injectConfig';
import EmptyComponent from '../../components/EmptyComponent';

describe('injectConfig', function() {

  it('should render', function() {
    const Thing = injectConfig(EmptyComponent);

    const component = renderer.create(
      <ConfiguredProvider>
        <Thing/>
      </ConfiguredProvider>
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

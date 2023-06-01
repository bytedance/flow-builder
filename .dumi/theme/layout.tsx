import React from 'react';
import Layout from 'dumi-theme-default/es/layout';

const CustomLayout = (props) => (
  <Layout {...props}>
    <>{props.children}</>
  </Layout>
);

export default CustomLayout;

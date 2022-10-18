import React from 'react';
import Layout from 'dumi-theme-default/es/layout';

import './layout.css';

const CustomLayout = (props) => (
  <Layout {...props}>
    <>
      {props.children}
      <div className="record-number">
        <a href="https://beian.miit.gov.cn/" target="_blank">
          浙ICP备2022016932号-1
        </a>
      </div>
    </>
  </Layout>
);

export default CustomLayout;

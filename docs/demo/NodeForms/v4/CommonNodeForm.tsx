import React from 'react';
import { Form, Input } from 'antd';
import { IConfigComponent } from 'react-flow-builder';
import DrawerContent from './DrawerContent';

const CommonNodeForm: React.FC<IConfigComponent> = (props) => {
  return (
    <DrawerContent {...props}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="desc" label="Description">
        <Input.TextArea />
      </Form.Item>
    </DrawerContent>
  );
};

export default CommonNodeForm;

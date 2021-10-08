import React from 'react';
import { Form, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IConfigComponent } from 'react-flow-builder';
import DrawerContent from './DrawerContent';

interface IProps extends IConfigComponent {
  form: WrappedFormUtils;
}

const CommonNodeForm: React.FC<IProps> = (props) => {
  const { node, form } = props;

  return (
    <DrawerContent {...props}>
      <Form.Item label="Name">
        {form.getFieldDecorator('name', {
          initialValue: node?.data?.name || node.name,
          rules: [{ required: true }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Description">
        {form.getFieldDecorator('desc', {
          initialValue: node?.data?.desc,
        })(<Input.TextArea />)}
      </Form.Item>
    </DrawerContent>
  );
};

export default Form.create()(CommonNodeForm);

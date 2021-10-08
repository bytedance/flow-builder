import React from 'react';
import { Form, Button } from 'antd';
import { IConfigComponent } from 'react-flow-builder';

const DrawerContent: React.FC<IConfigComponent> = (props) => {
  const { node, onCancel, onSave, children } = props;

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave?.(values);
    } catch (error) {
      const values = form.getFieldsValue();
      onSave?.(values, error);
    }
  };

  return (
    <div className="flow-builder-drawer-body">
      <div className="flow-builder-drawer-body-content">
        <Form form={form} initialValues={node.data || { name: node.name }}>
          {children}
        </Form>
      </div>
      <div className="flow-builder-drawer-body-footer">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default DrawerContent;

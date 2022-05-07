import React, { useContext } from 'react';
import { BuilderContext, useDrawer } from 'react-flow-builder';
import { Form, Button, Input } from 'antd';

const ConfigForm: React.FC = () => {
  const { selectedNode: node } = useContext(BuilderContext);

  const { closeDrawer: cancel, saveDrawer: save } = useDrawer();

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      save?.(values);
    } catch (error) {
      const values = form.getFieldsValue();
      save?.(values, !!error);
    }
  };

  return (
    <div>
      <Form form={form} initialValues={node.data || { name: node.name }}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
      <div>
        <Button onClick={cancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default ConfigForm;

import React from 'react';
import { IConfigComponent } from 'react-flow-builder';
import { Form, Button, Input } from 'antd';

const ConfigForm: React.FC<IConfigComponent> = (props) => {
  const { node, onCancel, onSave } = props;

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave?.(values);
    } catch (error) {
      const values = form.getFieldsValue();
      onSave?.(values, !!error);
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
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default ConfigForm;

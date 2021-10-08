import React from 'react';
import { Form, Button } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { IConfigComponent } from 'react-flow-builder';

interface IProps extends IConfigComponent {
  form: WrappedFormUtils;
}

const DrawerContent: React.FC<IProps> = (props) => {
  const { onCancel, onSave, form, children } = props;

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
        <Form>{children}</Form>
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

export default Form.create()(DrawerContent);

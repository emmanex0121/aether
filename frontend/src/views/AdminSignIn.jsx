import { useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { useAuth } from "../customHooks/useCustomAuth";

const AdminSignIn = () => {
  const [loading, setloading] = useState(false);
  const { onAuth } = useAuth();

  const onFinish = (values) => {
    console.log("Form Values:", values);
    setloading(true);
    // onNotify("success", "Successful", "User addedd");

    onAuth(values);
    setloading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    setloading(false);
  };

  return (
    <div className="min-h-[100svh] flex items-center justify-center">
      <Card className="max-w-[40rem] w-[100%]">
        <Form
          // form={form}
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}>
          {/* <Form.Item
            label="Username"
            name="userName"
            rules={[
              { required: true, message: "Please enter a unique username." },
            ]}>
            <Input />
          </Form.Item> */}
          <h1>ADMIN SIGN IN</h1>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminSignIn;

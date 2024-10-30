import { useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
// import useNotification from "../customHooks/useNotification";
import axios from "axios";
import { useAuth } from "../customHooks/useCustomAuth";

const SignUp = () => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState("");
  const [loading, setloading] = useState(false);
  const { onAuth } = useAuth();
  // const { onNotify } = useNotification();

  useEffect(() => {
    const fetchCountryFromIP = async () => {
      try {
        const response = await axios.get(
          `https://ipinfo.io/json?token=ff55629580ecf2`
        );
        setCountry(response.data.country); // Set country based on response
        form.setFieldsValue({ country: response.data.country }); // Prefill country field in form
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    fetchCountryFromIP();
  }, [form]);

  const onFinish = (values) => {
    console.log(country);
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
          form={form}
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{
            prefix: "+",
            country: country,
          }}>
          <div className="flex align-center justify-between gap-4 w-full">
            <Form.Item
              className="w-full"
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}>
              <Input />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Username"
            name="userName"
            rules={[
              { required: true, message: "Please enter a unique username." },
            ]}>
            <Input />
          </Form.Item>

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
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              { pattern: /^\d{10,15}$/, message: "Enter a valid phone number" },
            ]}>
            <Input addonBefore="+" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password />
          </Form.Item>

          {/* Address Fields */}
          <Form.Item
            label="Street"
            name="street"
            rules={[{ required: true, message: "Please enter your street" }]}>
            <Input />
          </Form.Item>

          <div className="flex items-center gap-2">
            <Form.Item className="w-full" label="apt" name="apt">
              <Input />
            </Form.Item>

            <Form.Item
              label="zip"
              name="zip"
              rules={[{ required: true, message: "Please enter your zip" }]}>
              <Input maxLength={5} />
            </Form.Item>
          </div>

          <div className="flex items-center gap-2">
            <Form.Item
              className="w-full"
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter your city" }]}>
              <Input />
            </Form.Item>

            <Form.Item
              className="w-full"
              label="State"
              name="state"
              rules={[{ required: true, message: "Please enter your state" }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select your country" }]}>
            <Input
              type="text"
              // disabled
              variant="filled"
              readOnly
              minLength={2}
              // value="HELLO"
              // defaultValue="Hello"
            />
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

export default SignUp;

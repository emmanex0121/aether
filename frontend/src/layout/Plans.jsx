import { NavLink } from "react-router-dom";
import { FormOutlined } from "@ant-design/icons";

const Plans = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Plans</h1>
      <div className="max-w-[500px]">
        <div className="mb-4">
          <h2 className="text-2xl font-medium">Current Plan</h2>
          <div className="flex items-center justify-between">
            <p>Basic</p>
            <NavLink to="select" className="text-red-400">
              Change <FormOutlined />
            </NavLink>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-medium ">Interest Accrued</h2>
          <span>$400.56</span>
        </div>{" "}
        <div className="flex items-center justify-between font-bold">
          <h2 className="text-2xl">Current Balance</h2>
          <span>$9,000.42</span>
        </div>{" "}
      </div>
    </div>
  );
};

export default Plans;

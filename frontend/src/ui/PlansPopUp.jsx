import PropTypes from "prop-types";
import { Select, InputNumber } from "antd";
import useNotification from "../customHooks/useNotification";
// import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
// const onSearch = (value) => {
//   console.log("search:", value);
// };

const PlansPopUp = ({ onClose, plan, investment, interest, day }) => {
  const { onNotify } = useNotification();
  const navigate = useNavigate(); // Initialize the navigate hook

  const onSuccess = () => {
    onNotify("success", "Successful", "Sucecsully purchases a plan");
    setTimeout(() => {
      navigate("/user/plans");
    }, 2000);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full pb-2">
        <div className="flex justify-between items-center border-b-4 p-4">
          <span className="text-lg font-bold">Confirm {plan} Investment</span>
          <button
            onClick={onClose}
            className="exit-btn top-4 right-4 text-xl text-white rounded bg-red-700">
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="">
            <div className="text-md mb-2">Investment: {investment}</div>
            <div className="text-md mb-2">Interest: {interest}</div>
            <div className="text-md mb-4">Every 24 hours for {day} days</div>
          </div>
        </div>
        <div className="px-6 flex flex-col gap-4">
          <div>
            <p className="flex items-center gap-1 font-bold text-lg">
              Select Wallet <span className="text-red-700 text-xl">*</span>
            </p>
            <Select
              style={{
                width: "100%",
              }}
              showSearch
              defaultValue="deposit"
              onChange={onChange}
              // onSearch={onSearch}
              options={[
                {
                  value: "deposit",
                  label: "Deposit Wallet - $35,000.00",
                },
                {
                  value: "BTC",
                  label: "BITCOIN (BTC)",
                },
                {
                  value: "LTC",
                  label: "LITECOIN (LTC)",
                },
              ]}
            />
          </div>

          <div>
            <p className="flex items-center gap-1 font-bold text-lg">
              Investment Amount <span className="text-red-700 text-xl">*</span>
            </p>{" "}
            <InputNumber
              prefix="USD"
              style={{
                width: "100%",
              }}
            />
          </div>

          <div className="w-full flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="text-md font-bold bg-red-900 text-white py-2 px-4">
              Close
            </button>
            <button
              onClick={onSuccess}
              className="text-md font-bold bg-red-900 text-white py-2 px-4">
              OK
            </button>
          </div>
        </div>
        {/* Uncomment and style the Close button */}
        {/* <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded">
          Close
        </button> */}
      </div>
    </div>
  );
};

PlansPopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  plan: PropTypes.string.isRequired,
  investment: PropTypes.string.isRequired,
  interest: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
};

export default PlansPopUp;

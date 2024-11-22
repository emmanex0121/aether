import { NavLink } from "react-router-dom";

const WithdrawButton = () => {
  return (
    <div>
      <NavLink
        to="/user/wallet/withdraw"
        className="bg-[#A52A2A] rounded border-2 border-black mt-2 px-5 py-3">
        Withdraw
      </NavLink>
    </div>
  );
};

export default WithdrawButton;

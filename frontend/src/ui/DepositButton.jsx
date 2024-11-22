import { NavLink } from "react-router-dom";

const DepositButton = () => {
  return (
    <div>
      <NavLink
        to="/user/wallet/deposit"
        className="bg-[#A52A2A] rounded border-2 border-black mt-2 px-5 py-3">
        Deposit
      </NavLink>
    </div>
  );
};

export default DepositButton;

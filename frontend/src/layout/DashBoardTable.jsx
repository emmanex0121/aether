import { useContext, useEffect, useState } from "react";
import { Table, Dropdown, Button, message, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { GlobalContext } from "../contexts/useGlobalContext";
import { endpoints } from "../api/endpoints";

const DashBoardTable = () => {
  const { fetchData, postData, putData } = useContext(GlobalContext);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState({});

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const fetchUsers = await fetchData(endpoints.admin.getUsers);
        setFetchedUsers(fetchUsers);
        console.log(fetchUsers);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setDropdownOptions(["transactions", "plans", "verification"]);
    setSelectedOption(""); // Reset the selected option
    setVerificationStatus(user.verificationStatus || "pending");
  };

  // Handle option selection
  const handleOptionSelect = async (option) => {
    console.log(selectedUser);
    setSelectedOption(option);
    if (option === "transactions") {
      fetchTransactions(selectedUser._id);
    }
    if (option === "plans") {
      fetchPlans(selectedUser._id);
    }

    console.log(
      `Selected option for user ${selectedUser.firstName}: ${option}`
    );
  };

  // Fetch transactions for the selected user
  const fetchTransactions = async (userId) => {
    setLoading(true);
    try {
      const response = await postData(endpoints.admin.getUserTransactions, {
        userId,
      });
      setTransactions(response);
      console.log(response);
    } catch (error) {
      console.log(error.message);
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Update transaction status
  const updateTransactionStatus = async (record, newStatus) => {
    const key = `updating-${record._id}`;
    message.loading({ content: "Updating...", key });

    try {
      // Construct the data object
      const data = {
        name: record.name,
        description: record.description,
        price: record.price,
        orderNumber: record.orderNumber,
        userId: selectedUser._id, // Include the selected user's ID
        orderStatus: newStatus, // Include the new order status
      };

      // Make the API call with the updated data
      await putData(endpoints.admin.updateTransaction, data);

      // Update the transaction list locally
      setTransactions((prev) =>
        prev.map((item) =>
          item._id === record._id ? { ...item, orderStatus: newStatus } : item
        )
      );

      message.success({ content: "Transaction updated successfully!", key });
    } catch (error) {
      console.error(error.message);
      message.error({ content: "Failed to update transaction.", key });
    }
  };

  // Update verification status
  const updateVerificationStatus = async (newStatus) => {
    const key = `updating-verification-${selectedUser._id}`;
    message.loading({ content: "Updating...", key });

    try {
      // Make the API call with the updated status
      await putData(endpoints.admin.updateVerification, {
        userId: selectedUser._id,
        verificationStatus: newStatus,
      });

      // Update the verification status locally
      setVerificationStatus(newStatus);

      message.success({ content: "Verification status updated!", key });
    } catch (error) {
      console.error(error.message);
      message.error({ content: "Failed to update verification status.", key });
    }
  };

  // fetch plans
  const fetchPlans = async (userId) => {
    try {
      const fetchedPlans = await postData(endpoints.admin.getPlans, { userId });
      setPlans(fetchedPlans);
      console.log(fetchedPlans);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Define transaction table columns
  const transactionColumns = [
    {
      title: "Asset",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Transaction ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Desription",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        let color = "";

        if (status === "completed") {
          color = "green";
        } else if (status === "failed") {
          color = "red";
        } else if (status === "pending") {
          color = "blue"; // You can choose another color like "yellow"
        }

        return (
          <Tag color={color} key={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        const isCompletedOrFailed =
          record.orderStatus === "completed" || record.orderStatus === "failed";

        return (
          <Dropdown
            menu={{
              items: ["failed", "completed"].map((status) => ({
                key: status,
                label: (
                  <span
                    onClick={() =>
                      !isCompletedOrFailed &&
                      updateTransactionStatus(record, status)
                    }
                    style={{
                      color: isCompletedOrFailed ? "gray" : "black",
                      pointerEvents: isCompletedOrFailed ? "none" : "auto",
                    }}>
                    {status}
                  </span>
                ),
                disabled: isCompletedOrFailed,
              })),
            }}
            trigger={["click"]}>
            <Button disabled={isCompletedOrFailed}>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      {/* Dropdown for Users */}
      <div className="mb-4">
        <label htmlFor="user-select" className="block mb-2 font-semibold">
          Select a User:
        </label>
        <select
          id="user-select"
          className="border border-gray-300 rounded px-4 py-2 w-full"
          onChange={(e) => handleUserSelect(fetchedUsers[e.target.value])}
          defaultValue="">
          <option value="" disabled>
            Select a user
          </option>
          {fetchedUsers.map((user, index) => (
            <option key={user._id} value={index}>
              {user.firstName} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown for Related Options */}
      {selectedUser && (
        <div className="mb-4">
          <label htmlFor="option-select" className="block mb-2 font-semibold">
            Options for {selectedUser.firstName}:
          </label>
          <select
            id="option-select"
            className="border border-gray-300 rounded px-4 py-2 w-full"
            onChange={(e) => handleOptionSelect(e.target.value)}
            defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            {dropdownOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display Selected Option */}
      {selectedOption && (
        <div className="mt-4">
          <p className="font-semibold">
            Selected Option for {selectedUser.firstName}: {selectedOption}
          </p>

          {/* Render Transactions Table */}
          {selectedOption === "transactions" && (
            <Table
              dataSource={transactions}
              columns={transactionColumns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}

          {/* Render Plans */}
          {selectedOption === "plans" && (
            <div className="mt-4">
              <p className="font-semibold mb-4">Current Plans:</p>
              {plans &&
                Object.keys(plans).map((key) => {
                  const plan = plans[key]; // Access each plan object
                  return (
                    plan.initialValue && ( // Check if `initialValue` exists
                      <div key={key} className="mb-2 pl-20">
                        <strong>{key.toUpperCase()}:</strong>{" "}
                        {plan.initialValue}
                      </div>
                    )
                  );
                })}
            </div>
          )}

          {/* Render Verification Status */}
          {selectedOption === "verification" && (
            <div className="mt-4">
              <p className="font-semibold mb-4">
                Current Verification Status:{" "}
                <Tag
                  color={
                    verificationStatus === "verified"
                      ? "green"
                      : verificationStatus === "unverified"
                      ? "red"
                      : "blue"
                  }>
                  {verificationStatus.charAt(0).toUpperCase() +
                    verificationStatus.slice(1)}
                </Tag>
              </p>
              <Button
                onClick={() => updateVerificationStatus("verified")}
                disabled={verificationStatus === "verified"}
                className="mr-2">
                Mark Verified
              </Button>
              <Button
                onClick={() => updateVerificationStatus("unverified")}
                disabled={verificationStatus === "unverified"}>
                Mark Unverified
              </Button>
              <Button
                onClick={() => updateVerificationStatus("pending")}
                disabled={verificationStatus === "pending"}
                className="ml-2">
                Reset to Pending
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashBoardTable;

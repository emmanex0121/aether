// ./src/api/endpoints.js

export const endpoints = {
  auth: {
    signup: "auth/signup",
    signin: "auth/signin",
    adminsignin: "auth/admin/signin",
  },
  asset: {
    add: "asset/add",
    history: "asset/history",
  },
  wallet: {
    history: "wallet",
    update: "wallet/update",
  },
  address: "address",
  plans: {
    add: "user/plans/add",
    history: "user/plans/",
    // update: "user/plans/update"
  },
};

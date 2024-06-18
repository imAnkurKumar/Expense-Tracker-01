const express = require("express");
const router = express.Router();
const purchaseMembershipController = require("../controllers/purchaseMemberShip");
const userAuthentication = require("../middleware/auth");

router.get(
  "/premiumMembership",
  userAuthentication,
  purchaseMembershipController.purchaseMembership
);

router.post(
  "/updateTransactionstatus",
  userAuthentication,
  purchaseMembershipController.updateTransactionstatus
);
module.exports = router;

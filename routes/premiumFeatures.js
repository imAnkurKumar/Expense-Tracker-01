const express = require("express");
const premiumFeaturesController = require("../controllers/premiumFeatures");
const userAuthentication = require("../middleware/auth");
const router = express.Router();

router.get(
  "/showLeaderboard",
  userAuthentication,
  premiumFeaturesController.getUserLeaderboard
);
module.exports = router;

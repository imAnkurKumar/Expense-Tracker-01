const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/report");
const userAuthentication = require("../middleware/auth");

router.get("/getReportPage", reportsController.getReportPage);

router.post(
  "/dailyReports",
  userAuthentication,
  reportsController.dailyReports
);
router.post(
  "/weeklyReports",
  userAuthentication,
  reportsController.weeklyReport
);
router.post(
  "/monthlyReports",
  userAuthentication,
  reportsController.monthlyReport
);
router.post(
  "/yearlyReports",
  userAuthentication,
  reportsController.yearlyReport
);
module.exports = router;

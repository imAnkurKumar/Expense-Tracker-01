const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const userAuthentication = require("../middleware/auth");
router.use(express.static("public"));

router.get("/", expenseController.getHomePage);
router.post("/addExpense", userAuthentication, expenseController.addExpense);
router.get("/getAllExpense", userAuthentication, expenseController.getExpenses);
router.delete(
  "/deleteExpense/:id",
  userAuthentication,
  expenseController.deleteExpense
);
router.get(
  "/downloadExpense",
  userAuthentication,
  expenseController.downloadExpense
);
router.get(
  "/downloadHistory",
  userAuthentication,
  expenseController.downloadDate
);
module.exports = router;

const Expense = require("../models/expense");
const path = require("path");
const User = require("../models/user");
const sequelize = require("../util/database");
const S3services = require("../services/S3services");
const Download = require("../models/download");

const getHomePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "homePage.html"));
};

const downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3(stringifiedExpenses, fileName);

    const result = await Download.create({
      userId: req.user.id,
      fileURL: fileURL,
      downloadDate: new Date(),
    });
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileURL: "", success: false, err: err });
  }
};
const downloadDate = async (req, res) => {
  try {
    const downloadHistory = await Download.findAll({
      where: { userId: req.user.id },
      attributes: ["fileURL", "downloadDate"],
    });
    res.status(200).json(downloadHistory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in fetching Data" });
  }
};
const addExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, description, category } = req.body;
    const result = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );
    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    const updateUser = await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res
      .status(201)
      .json({ message: "Expense added successfully", expense: result });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = parseInt(req.query.perPage) || 5;
    const offset = (page - 1) * limit;
    const totalExpenses = await Expense.count({
      where: { userId: req.user.id },
    });
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: offset,
      limit: limit,
    });   
    res.json({ expenses, totalExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const expenseId = req.params.id;
    const expense = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id }, // Check both ID and userId
    });
    if (!expense) {
      t.rollback();
      return res.status(404).json({ message: "Expense not found" });
    }
    const deletedAmount = expense.amount;
    await expense.destroy({ transaction: t }); // Delete the expense
    const updateUser = await User.update(
      {
        totalExpenses: Number(req.user.totalExpenses) - Number(deletedAmount),
      },
      {
        where: {
          id: req.user.id,
        },
        transaction: t,
      }
    );

    await t.commit();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getHomePage,
  downloadExpense,
  downloadDate,
  addExpense,
  getExpenses,
  deleteExpense,
};

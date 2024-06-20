const Expense = require("../models/expense");

const path = require("path");
const { Op } = require("sequelize");

const getReportPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "report.html"));
};
const dailyReports = async (req, res) => {
  try {
    const dateFromFrontend = req.body.date;
    const satrtDate = new Date(`${dateFromFrontend} 00:00:00`);
    const endDate = new Date(`${dateFromFrontend} 23:59:59`);
    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [satrtDate, endDate],
        },
        userId: req.user.id,
      },
    });
    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }
    res.status(201).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};
const weeklyReport = async (req, res) => {
  try {
    const weekFromFrontend = req.body.week;

    const [year, week] = weekFromFrontend.split("-W");
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 6
    );

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });
    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }
    res.status(201).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
};

const monthlyReport = async (req, res) => {
  try {
    const monthFromFrontend = req.body.month;

    const startDate = new Date(`${monthFromFrontend}-01 00:00:00`);
    const year = startDate.getFullYear();
    const nextMonth = startDate.getMonth() + 1;
    const endDate = new Date(year, nextMonth, 0, 23, 59, 59);

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });
    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever error");
  }
};

const yearlyReport = async (req, res) => {
  try {
    const yearFromFrontend = req.body.year;

    const startDate = new Date(`${yearFromFrontend}-01-01 00:00:00`);
    const endDate = new Date(yearFromFrontend, 11, 31, 23, 59, 59);

    const expenses = await Expense.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
    });

    if (!expenses || expenses.length === 0) {
      return res.status(401).json({ msg: "No expenses found" });
    }

    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthStartDate = new Date(yearFromFrontend, i, 1, 0, 0, 0);
      const monthEndDate = new Date(yearFromFrontend, i + 1, 0, 23, 59, 59);

      const monthlyExpense = expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
      });

      const totalAmount = monthlyExpense.reduce(
        (accumulator, currentExpense) => accumulator + currentExpense.amount,
        0
      );

      monthlyData.push({
        month: new Date(monthStartDate).toLocaleString("default", {
          month: "long",
        }),
        amount: totalAmount,
      });
    }
    res.status(200).json(monthlyData);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
};
module.exports = {
  getReportPage,
  dailyReports,
  weeklyReport,
  monthlyReport,
  yearlyReport,
};

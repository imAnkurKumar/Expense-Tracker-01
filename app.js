const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
// const morgan = require("morgan");

const PORT = process.env.PORT;
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseRouter = require("./routes/purchaseMemberRoute");
const premiumRouter = require("./routes/premiumFeatures");
const forgotPassword = require("./routes/resetPassword");
const reportRouter = require("./routes/report");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ResetPassword = require("./models/resetPassword");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );
// app.use(morgan("combined", { stream: accessLogStream }));
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseRouter);
app.use("/premium", premiumRouter);
app.use("/password", forgotPassword);
app.use("/reports", reportRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

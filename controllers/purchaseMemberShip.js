const Razorpay = require("razorpay");
const Order = require("../models/order");
const userController = require("../controllers/user");
exports.purchaseMembership = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 5000;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong", error: err });
  }
};

exports.updateTransactionstatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    await order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    await req.user.update({ isPremiumUser: true });

    const token = userController.generateAccessToken(userId, undefined, true);
    return res.status(202).json({
      succes: true,
      message: "Transaction Successful",
      token: token
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "something went wrong" });
  }
};

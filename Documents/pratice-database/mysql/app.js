import express from "express";
import {
  getAllUser,
  createUser,
  getUser,
  deleteUser,
  getAllUndeliverOrder,
  fiveRecentOrder,
  topActiveUser,
  inActiveUser,
  mostPurchasedProduct,
  mostExpensiveOrder,
  leastExpensiveOrder,
  getUserData,
} from "./database.js";
const app = express();
import productRouter from "./product/productController.js";
import orderRouter from "./orders/orderController.js";
app.use(express.json());

// app.use(productRouter);
app.get("/users", async (req, res, next) => {
  try {
    const userData = await getAllUser();
    console.log(userData[0]);
    res.status(200).json({
      status: "success",
      users: userData[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/user/:id", async (req, res, next) => {
  try {
    const data = await getUser(req.params.id);
    res.status(200).json({
      staus: "success",
      userData: data[0],
    });
  } catch (err) {}
});

app.post("/user", async (req, res, next) => {
  try {
    const data = await createUser(req, res);
    const userData = await getUser(data[0].insertId);
    res.status(200).json({
      status: "success",
      user: userData[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.delete("/user/:id", async (req, res, next) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(204).json({
      status: "success",
      message: "User deleted successfully!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});
app.get("/user_data", async (req, res, next) => {
  try {
    const result = await getUserData();
    res.status(200).json({
      status: "success",
      user: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/undeliver-orders", async (req, res) => {
  try {
    const result = await getAllUndeliverOrder();
    res.status(200).json({
      status: "success",
      totalOrder: result[0].length,
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/most-recent-orders", async (req, res) => {
  try {
    const result = await fiveRecentOrder();
    res.status(200).json({
      status: "success",
      totalOrder: result[0].length,
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});
app.get("/top-active-user", async (req, res) => {
  try {
    const result = await topActiveUser();
    res.status(200).json({
      status: "success",
      totalUser: result[0].length,
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/inactive-user", async (req, res) => {
  try {
    const result = await inActiveUser();
    res.status(200).json({
      status: "success",
      totalUser: result[0].length,
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/most-purchased-product", async (req, res) => {
  try {
    const result = await mostPurchasedProduct();
    res.status(200).json({
      status: "success",
      totalProduct: result[0].length,
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/most-expensive-order", async (req, res) => {
  try {
    const result = await mostExpensiveOrder();
    res.status(200).json({
      status: "success",
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/least-expensive-order", async (req, res) => {
  try {
    const result = await leastExpensiveOrder();
    res.status(200).json({
      status: "success",
      orders: result[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.use(/^\/products?/, productRouter);
app.use(/^\/orders?/, orderRouter);

export default app;

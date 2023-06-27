import pool from "./server.js";
import bcrypt from "bcryptjs";

export async function getAllUser(req, res) {
  const result = await pool.query("SELECT * FROM user");
  return result;
}

export async function getUserData(req, res) {
  const result = await pool.query(
    "SELECT u.name , o.id as order_id , p.title as product_name , order_status, order_date , delivery_date , (delivery_date - order_date) as Expexted_delivery_day  from order_details od JOIN products p ON od.product_id = p.id JOIN orders o ON od.order_id = o.id JOIN user u ON o.user_id = u.id"
  );
  return result;
}

export async function createUser(req, res) {
  let { name, email, password, address } = req.body;
  password = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO user(name,email,address,password) VALUES(?,?,?,?)`,
    [name, email, address, password]
  );
  return result;
}

export async function getUser(id) {
  const result = await pool.query("SELECT * FROM user WHERE id = ?", id);
  return result;
}

export async function deleteUser(id) {
  const result = await pool.query("DELETE FROM user WHERE id = ?", id);
  return result;
}

/// products

export async function getAllProduct(req, res) {
  const result = await pool.query("SELECT * FROM products");
  return result;
}

export async function createProduct(req, res) {
  let { title, amount, description = null } = req.body;
  const result = await pool.query(
    `INSERT INTO products(title,amount,description) VALUES(?,?,?)`,
    [title, amount, description]
  );
  return result;
}

export async function getProduct(id) {
  const result = await pool.query("SELECT * FROM products WHERE id = ?", id);
  return result;
}

export async function deleteProduct(id) {
  const result = await pool.query("DELETE FROM products WHERE id = ?", id);
  return result;
}

/// orders
export async function getAllOrder(req, res) {
  const result = await pool.query("SELECT * FROM orders");
  return result;
}

export async function createOrder(req, res) {
  let {
    userId,
    orderStatus,
    orderDate = new Date().toISOString().slice(0, 10),
    deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    productId,
  } = req.body;
  console.log(orderDate);
  const createOrderData = await pool.query(
    `INSERT INTO orders(user_id,order_status,order_date,delivery_date) VALUES(?,?,?,?)`,
    [userId, orderStatus, orderDate, deliveryDate]
  );
  await pool.query(
    `INSERT INTO order_details(order_id,product_id) VALUES(?,?)`,
    [createOrderData[0].insertId, productId]
  );
  return createOrderData;
}

export async function getOrder(id) {
  const result = await pool.query("SELECT * FROM orders WHERE id = ?", id);
  return result;
}

export async function deleteOrder(id) {
  const result = await pool.query("DELETE FROM orders WHERE id = ?", id);
  return result;
}

export async function getAllUndeliverOrder() {
  const result = await pool.query(
    "SELECT u.name , o.id as order_id , p.title as product_name , order_status , delivery_date  from order_details od JOIN products p ON od.product_id = p.id JOIN orders o ON od.order_id = o.id JOIN user u ON o.user_id = u.id WHERE order_status = 'pending'"
  );
  return result;
}
export async function fiveRecentOrder() {
  const result = await pool.query(
    "SELECT u.name , o.id as order_id , p.title as product_name , order_status, order_date , delivery_date  from order_details od JOIN products p ON od.product_id = p.id JOIN orders o ON od.order_id = o.id JOIN user u ON o.user_id = u.id ORDER BY order_date DESC LIMIT 5"
  );
  return result;
}

export async function topActiveUser() {
  const result = await pool.query(
    "SELECT u.name ,count(u.id) as 'Total Orders' from orders o JOIN user u ON o.user_id = u.id group by u.id order by count(u.id) desc limit 5"
  );
  return result;
}

export async function inActiveUser() {
  const result = await pool.query(
    "SELECT u.id as 'User Id',name , email , address  FROM user u  LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL;"
  );
  return result;
}

export async function mostPurchasedProduct() {
  const result = await pool.query(
    "SELECT product_id, COUNT(product_id) AS 'Total Purchase', title, description, amount FROM order_details od  join products p  ON od.product_id = p.id GROUP BY product_id ORDER BY COUNT(product_ID) DESC LIMIT 5"
  );
  return result;
}

export async function mostExpensiveOrder() {
  const result = await pool.query(
    "SELECT od.order_id, SUM(p.amount) AS total_amount, GROUP_CONCAT(p.title SEPARATOR ', ') AS product_purchased FROM order_details od JOIN products p ON od.product_id = p.id GROUP BY od.order_id order by total_amount desc limit 1;"
  );
  return result;
}

export async function leastExpensiveOrder() {
  const result = await pool.query(
    "SELECT od.order_id, SUM(p.amount) AS total_amount, GROUP_CONCAT(p.title SEPARATOR ', ') AS product_purchased FROM order_details od JOIN products p ON od.product_id = p.id GROUP BY od.order_id order by total_amount limit 1;"
  );
  return result;
}

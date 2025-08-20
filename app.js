const express = require("express");
const mysql2 = require('mysql2');
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASS,
    database: 'bikes'
})

db.connect(err => {
    if (err) console.log(err);
    console.log('Connected successfully');
})

app.get('/', (req, res) => {
    res.send('Bike is on the gooo.');
})

app.listen(port, () => {
    console.log('Bike is running anyway.');
})


app.get('/datas', (req, res) => {
    const { search, order, company } = req.query;

    let sql = 'SELECT * FROM products';
    const values = [];
    const conditions = [];

    // Search filter
    if (search && search.trim() !== '') {
        conditions.push('(model LIKE ? OR company LIKE ? OR type LIKE ?)');
        values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Company filter (ignore if 'all')
    if (company && company.trim() !== '' && company.toLowerCase() !== 'all') {
        conditions.push('company = ?');
        values.push(company);
    }

    // Add WHERE if there are any conditions
    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting by price
    let orderBy = 'price ASC'; // default
    if (order && order.trim() !== '') {
        if (order.toLowerCase() === 'asc') orderBy = 'price ASC';
        else if (order.toLowerCase() === 'dsc') orderBy = 'price DESC';
    }

    sql += ' ORDER BY ' + orderBy;

    // Execute the query
    db.query(sql, values, (err, results) => {
        res.json(results);
    });
});



// app.get("/datas", (req, res) => {
//     const query = req.query;
//     db.query(`SELECT * FROM products WHERE model=${query} OR company=${query}`, (err, results) => {
//         console.log(results);
//         if (err) {
//             console.error("❌ Error while fetching:", err);
//             res.status(500).send("Error fetching data");
//             return;
//         }
//         res.send(results); // send back as JSON
//     });
// });











// await db.execute(`
//     CREATE TABLE items (id INT AUTO_INCREMENT PRIMARY KEY, model VARCHAR(100) NOT NULL, price INT NOT NULL, company VARCHAR(100) NOT NULL);`)
// await db.execute(`INSERT INTO items (model, price, company) VALUES ('Yamaha R15 V3', 550000, 'Yamaha');`)

// const [rows] = await db.execute(`select * from items`)
// console.log(rows);


// try {
//     const [rows] = await db.execute(`DELETE FROM items WHERE id=1`)
//     cnsole.log(rows);
// } catch (error) {
//     console.log(error);
// }
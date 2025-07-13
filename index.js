const express=require("express");
const cors=require("cors");
const {Client}=require("pg");
const fs = require("fs");
const app=express();


const client=new Client({
    host:"database-1.cwbw4yqcy2gc.us-east-1.rds.amazonaws.com",
    port:5432,
    user:"postgres",
    password:"Admin2001",
    database: "postgres",
    ssl: {
     ca: fs.readFileSync("global-bundle.pem")
  } 
})

client.connect()
  .then(() => console.log("Connected to PostgreSQL RDS"))
  .catch(err => console.error("PostgreSQL connection error:", err));

app.use(cors({
    origin:"*"
}));
app.get("/",(req,res)=>{
    res.status(200).send("ECS demo using fargate working fine like pro 🔥🔥🔥");
})

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.get("/api/create-db", async (req, res) => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      age INT
    );
  `;
  try {
    await client.query(query);
    res.status(200).send("✅ Table 'users' created successfully.");
  } catch (err) {
    console.error("❌ Error creating table:", err);
    res.status(500).send("❌ Failed to create table.");
  }
});

app.get("/api/create-boat-db",async(req,res)=>{
    const query=`
    CREATE TABLE IF NOT EXISTS boats(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    boat_name varchar(255)
    );`

    try {
    await client.query(query);
    res.status(200).send("✅ Table 'boats' created successfully.");
  } catch (err) {
    console.error("❌ Error creating table:", err);
    res.status(500).send("❌ Failed to create table.");
  }
})

app.post("/api/insert-boats", async (req, res) => {
  const query = `INSERT INTO boats (user_id, boat_name) VALUES (1,'Matrix')`;
  try {
    await client.query(query);
    res.status(200).send("✅ Boat inserted successfully.");
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  }
});


app.post("/api/update-boats-name", async (req, res) => {
  const query = `UPDATE boats set boat_name='ruicado' where user_id=1`;
  try {
    await client.query(query);
    res.status(200).send("✅ Boat updated successfully.");
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  }
});

app.post("/api/insert-users", async (req, res) => {
  const query = `INSERT INTO users (age, name) VALUES (25, 'sukanya')`;
  try {
    await client.query(query);
    res.status(200).send("✅ User inserted successfully.");
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  }
});

app.get("/api/get-users", async (req, res) => {
  const query = `SELECT * from users`;
  try {
    const fetchedUsers=await client.query(query);
    const users=fetchedUsers.rows;
    res.status(200).json({message:"✅ User fetched successfully.", users});
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  }
});

app.get("/api/get-boats", async (req, res) => {
  const query = `SELECT * from boats`;
  try {
    const fetchedBoats=await client.query(query);
    const boats=fetchedBoats.rows;
    res.status(200).json({message:"✅  Boats fetched successfully.", boats});
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  }
});

app.get("/api/join",async(req,res)=>{
    const query = `select boat_name, name from boats, users  where boats.user_id=users.id and boats.user_id=1;
`;
  try {
    const fetchedJoin=await client.query(query);
    const join=fetchedJoin.rows;
    res.status(200).json({message:"✅  Boats fetched successfully.", join});
  } catch (err) {
    console.error("❌ Error inserting user:", err);
    res.status(500).send("❌ Failed to insert user.");
  } 
})

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
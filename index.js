const express=require("express");
const cors=require("cors");
const app=express();

app.use(cors({
    origin:"*"
}));
app.get("/",(req,res)=>{
    res.status(200).send("ECS demo using fargate with working fine like pro 🔥🔥🔥");
})

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(3001, '0.0.0.0', () => {
  console.log('Server running on port 3001');
});
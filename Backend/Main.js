const express = require('express');
const app = express();
const cors = require('cors');
const { query, getPool } = require('./Db/db_connection');
const adminRoutes = require('./Routes/Admin_Routes/Admin');

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);


app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await getPool(); 
});

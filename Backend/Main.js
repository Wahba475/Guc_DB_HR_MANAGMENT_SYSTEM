const express = require('express');
const app = express();
const cors = require('cors');
const { query, getPool } = require('./Db/db_connection');
const adminRoutes = require('./Routes/Admin_Routes/Admin');
const AcademicRoutes=require('./Routes/Academic_Routes/Academic');
const HrRoutes=require('./Routes/Hr_Routes');


app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/academic', AcademicRoutes);
app.use('/HR',HrRoutes)



app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await getPool(); 
});

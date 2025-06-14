const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes will be added here
app.use('/api/marketers', require('./routes/marketers'));
app.use('/api/consultants', require('./routes/consultants'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/pocs', require('./routes/pocs'));
app.use('/api/ip', require('./routes/ip'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/offers', require('./routes/offers'));

const PORT = process.env.PORT || 5001;

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
}); 
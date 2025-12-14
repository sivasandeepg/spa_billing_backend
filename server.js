// server.js

import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

// Railway sets the PORT variable, which we will use.
// We also explicitly pass '0.0.0.0' for the host for container compatibility.
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// CRUCIAL CHANGE: Adding '0.0.0.0' or using the HOST variable
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT} at host ${HOST}`);
});
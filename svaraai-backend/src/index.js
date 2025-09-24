require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB("mongodb+srv://khandelwalprince612:123456Prince@cluster0.zbt6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/svaraai");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes.js';
import postRoutes from './routes/posts.routes.js';
import commentRoutes from './routes/comments.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const __dirname = path.resolve();

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'https://graceful-boa-belt.cyclic.app',
  credentials: true, 
}));

mongoose.connect(`${process.env.MONGODB_URL}`)
.then(() => console.log(`Database connected!`))
.catch((error) => console.log(error));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.use(express.static(path.join(__dirname, "./blogging-app/dist")));

app.get('*', function (_, res) {
  res.sendFile(path.join(__dirname, "/blogging-app/dist/index.html"), function(error) {
    res.status(500).send(error); 
  });
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port: ${process.env.PORT || 3001}`);
});


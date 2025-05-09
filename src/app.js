import express from 'express';
import { config } from 'dotenv';
import { DBconnect } from './config/db.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import courseRouter from './routes/course.routes.js';
import categoryRouter from './routes/category.routes.js';
import enrollmentRouter from './routes/enrollment.routes.js'
import reviewRouter from './routes/review.routes.js';
import logger from './utils/logger/logger.js';
config();

const app = express();
const PORT = process.env.PORT || 6060;

app.use(express.json());
app.use(cookieParser());
await DBconnect()

app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/category', categoryRouter);
app.use('/review', reviewRouter);
app.use('/enrollment', enrollmentRouter);

process.on('uncaughtException', (err) => {
    if (err) console.log(`Uncaught exception: ${err}`);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reasion, promise) => {
    console.log(`Unhandled rejection: ${reasion}`);
  });
  
  app.use((err, req, res, next) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err.message || 'Internal server error' });
    } else {
      return next();
    }
  });
  

app.listen(PORT, () => logger.info(`Server connecting on port: ${PORT}`));
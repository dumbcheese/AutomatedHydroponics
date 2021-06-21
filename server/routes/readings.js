import express from 'express';
import { createReading, latestReading, getLatestReading, getAllReadings } from '../controllers/readings.js'
const router = express.Router();



router.post('/', createReading);
router.put('/', latestReading);
router.get('/latest', getLatestReading);
router.get('/all', getAllReadings);




export default router;

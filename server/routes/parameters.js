import express from 'express';
import {getParameters, updateParameters, createParameters} from '../controllers/parameters.js'
const router = express.Router();

router.get('/', getParameters);
router.put('/', updateParameters);
router.post('/', createParameters);



export default router;
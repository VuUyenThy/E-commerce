const express = require('express');
const {
    createShipment,
    getShipmentById,
    updateShipmentStatus,
} = require('../controllers/shipment.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createShipment);
router.get('/:id', authMiddleware, getShipmentById);
router.put('/:id/status', authMiddleware, updateShipmentStatus);

module.exports = router;

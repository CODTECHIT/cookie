import ShippingZone from '../models/ShippingZone.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getShippingZones = async (req, res) => {
  try {
    const zones = await ShippingZone.find().sort({ zoneName: 1 });
    successResponse(res, zones);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const createShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.create(req.body);
    successResponse(res, zone, 'Shipping zone created', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const updateShippingZone = async (req, res) => {
  try {
    const zone = await ShippingZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!zone) return errorResponse(res, 'Zone not found', 404);
    successResponse(res, zone, 'Zone updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const deleteShippingZone = async (req, res) => {
  try {
    await ShippingZone.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Zone deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/shipping/check-pincode  (customer checks delivery availability)
export const checkPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    const zone = await ShippingZone.findOne({ pincodes: pincode, isActive: true });
    if (!zone) return res.json({ success: true, data: { available: false, message: 'Delivery not available in your area' } });
    successResponse(res, { available: true, deliveryCharge: zone.deliveryCharge, freeDeliveryAbove: zone.freeDeliveryAbove, estimatedDays: zone.estimatedDays, zoneName: zone.zoneName });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

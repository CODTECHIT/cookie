import SiteSetting from '../models/SiteSetting.js';

let _counter = null;

/**
 * Generates a human-readable order number like "DFA-2024-00045"
 * Uses the invoice prefix from SiteSetting and auto-increments
 */
export const generateOrderNumber = async () => {
  const settings = await SiteSetting.findOne();
  const prefix = settings?.invoice?.prefix || 'DFA';
  const year = new Date().getFullYear();

  // Simple incrementing counter using the max order number in DB
  const { default: Order } = await import('../models/Order.js');
  const lastOrder = await Order.findOne({}, { orderNumber: 1 }, { sort: { createdAt: -1 } });

  let seq = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const parts = lastOrder.orderNumber.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  const padded = String(seq).padStart(5, '0');
  return `${prefix}-${year}-${padded}`;
};

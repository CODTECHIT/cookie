import SiteSetting from '../models/SiteSetting.js';



/**
 * Generates a human-readable order number like "DFA-2024-00045"
 * Uses the invoice prefix from SiteSetting and auto-increments
 */
export const generateOrderNumber = async () => {
  // Atomic increment in SiteSetting to ensure unique sequence even in parallel requests
  const settings = await SiteSetting.findOneAndUpdate(
    {},
    { $inc: { orderSequence: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const prefix = settings?.invoice?.prefix || 'DFA';
  const year = new Date().getFullYear();
  const seq = settings.orderSequence;

  const padded = String(seq).padStart(5, '0');
  return `${prefix}-${year}-${padded}`;
};

'use strict';
/**
 * Scheme & discount logic.
 *
 * Scheme types:
 *  - Free-quantity scheme: buy N get M free (e.g. 10+1)
 *  - Percentage discount scheme: buy N, get D% off
 *
 * DPCO drugs: discount cannot exceed dpco_price_ceiling.
 */
const { Scheme, Product } = require('../models');
const { Op } = require('sequelize');

/**
 * Look up any active scheme for a product on a given date.
 * Returns the best matching scheme (highest free_qty or discount_pct).
 */
async function getSchemeForProduct(productId, date = new Date()) {
  const schemes = await Scheme.findAll({
    where: {
      product_id: productId,
      is_active:  true,
      [Op.or]: [
        { valid_from: null },
        { valid_from: { [Op.lte]: date } },
      ],
      [Op.or]: [
        { valid_to: null },
        { valid_to: { [Op.gte]: date } },
      ],
    },
    order: [['scheme_qty', 'ASC']],
  });
  return schemes;
}

/**
 * Apply scheme to a billing line.
 * Returns { freeQty, schemeDiscountPct, schemeDiscountAmt }.
 *
 * @param {object} params
 * @param {number} params.productId
 * @param {number} params.quantity        - ordered quantity
 * @param {number} params.rate
 * @param {boolean} params.isDpcoControlled
 * @param {number} params.dpcoMaxDiscount
 * @param {number} params.requestedDiscountPct
 * @param {Date}   params.date
 */
async function applyScheme({ productId, quantity, rate, isDpcoControlled, dpcoMaxDiscount = 0, requestedDiscountPct = 0, date = new Date() }) {
  const schemes = await getSchemeForProduct(productId, date);

  let freeQty            = 0;
  let schemeDiscountPct  = 0;

  for (const s of schemes) {
    if (quantity >= Number(s.scheme_qty)) {
      // How many complete scheme sets?
      const sets = Math.floor(quantity / Number(s.scheme_qty));
      if (s.scheme_free_qty > 0) {
        freeQty = sets * Number(s.scheme_free_qty);
      }
      if (s.discount_pct > 0) {
        schemeDiscountPct = Number(s.discount_pct);
      }
    }
  }

  // Clamp additional (trade/cash) discount for DPCO drugs
  let effectiveDiscountPct = requestedDiscountPct;
  if (isDpcoControlled) {
    effectiveDiscountPct = Math.min(requestedDiscountPct, dpcoMaxDiscount);
  }

  return {
    freeQty,
    schemeDiscountPct,
    effectiveDiscountPct,
    isDpcoLimited: isDpcoControlled && requestedDiscountPct > dpcoMaxDiscount,
  };
}

module.exports = { applyScheme, getSchemeForProduct };

'use strict';
const { Party, Area, Salesman } = require('../models');
const { Op } = require('sequelize');

const include = [
  { model: Area,     attributes: ['area_code', 'area_name'], required: false },
  { model: Salesman, attributes: ['salesman_code', 'salesman_name'], required: false },
];

async function list(req, res, next) {
  try {
    const { search, type, page = 1, limit = 50 } = req.query;
    const where = {};
    if (type)   where.party_type = { [Op.in]: [type, 'both'] };
    if (search) where[Op.or] = [
      { name:        { [Op.like]: `%${search}%` } },
      { party_code:  { [Op.like]: `%${search}%` } },
      { mobile:      { [Op.like]: `%${search}%` } },
      { gst_number:  { [Op.like]: `%${search}%` } },
    ];

    const { count, rows } = await Party.findAndCountAll({
      where, include,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['name', 'ASC']],
    });
    res.json({ success: true, data: rows, total: count, page: Number(page) });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const party = await Party.findByPk(req.params.id, { include });
    if (!party) return res.status(404).json({ success: false, message: 'Party not found' });
    res.json({ success: true, data: party });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const party = await Party.create(req.body);
    res.status(201).json({ success: true, data: party });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) return res.status(404).json({ success: false, message: 'Party not found' });
    await party.update(req.body);
    res.json({ success: true, data: party });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const party = await Party.findByPk(req.params.id);
    if (!party) return res.status(404).json({ success: false, message: 'Party not found' });
    await party.update({ is_active: false }); // soft delete
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };

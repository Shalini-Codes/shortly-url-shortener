const { customAlphabet } = require('nanoid');
const Link = require('../models/Link');
const Click = require('../models/Click');
const { isValidHttpUrl } = require('../utils/url');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);

async function uniqueCode(customCode) {
  if (customCode) {
    const clean = customCode.toLowerCase().replace(/[^a-z0-9-_]/g, '').slice(0, 30);
    if (!clean) throw Object.assign(new Error('Custom alias contains no valid characters'), { status: 400 });
    if (await Link.findOne({ shortCode: clean })) throw Object.assign(new Error('This custom alias is already in use'), { status: 409 });
    return clean;
  }
  let code;
  do { code = nanoid(); } while (await Link.findOne({ shortCode: code }));
  return code;
}

function serialize(link) {
  return link.toObject ? link.toObject() : link;
}

exports.createLink = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, title, expiresAt } = req.body;
    if (!isValidHttpUrl(originalUrl)) return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS URL' });
    const shortCode = await uniqueCode(customAlias);
    const link = await Link.create({
      userId: req.user._id,
      originalUrl: new URL(originalUrl).toString(),
      shortCode,
      title: title?.trim() || '',
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });
    res.status(201).json({ link: serialize(link) });
  } catch (error) { next(error); }
};

exports.getLinks = async (req, res, next) => {
  try {
    const { search = '', status = 'all', sort = 'newest' } = req.query;
    const filter = { userId: req.user._id };
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: regex }, { originalUrl: regex }, { shortCode: regex }];
    }
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (status === 'expired') filter.expiresAt = { $lt: new Date(), $ne: null };
    const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, clicks: { clicks: -1 } };
    const links = await Link.find(filter).sort(sortMap[sort] || sortMap.newest);
    res.json({ links });
  } catch (error) { next(error); }
};

exports.getLink = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    res.json({ link });
  } catch (error) { next(error); }
};

exports.updateLink = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    if (req.body.originalUrl && !isValidHttpUrl(req.body.originalUrl)) return res.status(400).json({ message: 'Enter a valid HTTP or HTTPS URL' });
    if (req.body.originalUrl) link.originalUrl = new URL(req.body.originalUrl).toString();
    if (typeof req.body.title === 'string') link.title = req.body.title.trim();
    if ('expiresAt' in req.body) link.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
    await link.save();
    res.json({ link });
  } catch (error) { next(error); }
};

exports.deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    await Click.deleteMany({ linkId: link._id });
    res.json({ message: 'Link deleted' });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    link.isActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : !link.isActive;
    await link.save();
    res.json({ link });
  } catch (error) { next(error); }
};

const mongoose = require('mongoose');
const Link = require('../models/Link');
const Click = require('../models/Click');

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

exports.overview = async (req, res, next) => {
  try {
    const linkIds = await Link.find({ userId: req.user._id }).distinct('_id');
    const now = new Date();
    const today = startOfDay(now);
    const sevenDays = new Date(today); sevenDays.setDate(sevenDays.getDate() - 6);
    const [totalLinks, activeLinks, totalClicks, recentClicks, daily, topLinks, recentLinks, recentEvents] = await Promise.all([
      Link.countDocuments({ userId: req.user._id }),
      Link.countDocuments({ userId: req.user._id, isActive: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] }),
      Click.countDocuments({ linkId: { $in: linkIds } }),
      Click.countDocuments({ linkId: { $in: linkIds }, clickedAt: { $gte: sevenDays } }),
      Click.aggregate([
        { $match: { linkId: { $in: linkIds }, clickedAt: { $gte: sevenDays } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } }, clicks: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Link.find({ userId: req.user._id }).sort({ clicks: -1 }).limit(5).lean(),
      Link.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(5).lean(),
      Click.find({ linkId: { $in: linkIds } }).sort({ clickedAt: -1 }).limit(8).populate('linkId', 'title shortCode').lean()
    ]);
    res.json({ stats: { totalLinks, totalClicks, clicks7d: recentClicks, activeLinks }, daily, topLinks, recentLinks, recentEvents });
  } catch (error) { next(error); }
};

exports.linkAnalytics = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });
    const days = Number(req.query.days) || 30;
    const since = new Date(); since.setDate(since.getDate() - days);
    const today = startOfDay();
    const week = new Date(today); week.setDate(week.getDate() - 6);
    const [totalClicks, clicksToday, clicksWeek, daily, devices, browsers, referrers, recent] = await Promise.all([
      Click.countDocuments({ linkId: link._id }),
      Click.countDocuments({ linkId: link._id, clickedAt: { $gte: today } }),
      Click.countDocuments({ linkId: link._id, clickedAt: { $gte: week } }),
      Click.aggregate([
        { $match: { linkId: link._id, clickedAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } }, clicks: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Click.aggregate([{ $match: { linkId: link._id, clickedAt: { $gte: since } } }, { $group: { _id: '$device', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: { linkId: link._id, clickedAt: { $gte: since } } }, { $group: { _id: '$browser', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }, { $limit: 8 }]),
      Click.aggregate([{ $match: { linkId: link._id, clickedAt: { $gte: since } } }, { $group: { _id: { $ifNull: ['$referrer', 'Direct'] }, clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }, { $limit: 10 }]),
      Click.find({ linkId: link._id }).sort({ clickedAt: -1 }).limit(20).lean()
    ]);
    res.json({ link, stats: { totalClicks, uniqueClicks: totalClicks, clicksToday, clicksWeek }, daily, devices, browsers, referrers, recent });
  } catch (error) { next(error); }
};

exports.clicks = async (req, res, next) => {
  try {
    const linkIds = await Link.find({ userId: req.user._id }).distinct('_id');
    const days = Number(req.query.days) || 30;
    const since = new Date(); since.setDate(since.getDate() - days);
    const [daily, devices, browsers, referrers, recent] = await Promise.all([
      Click.aggregate([{ $match: { linkId: { $in: linkIds }, clickedAt: { $gte: since } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } }, clicks: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Click.aggregate([{ $match: { linkId: { $in: linkIds }, clickedAt: { $gte: since } } }, { $group: { _id: '$device', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: { linkId: { $in: linkIds }, clickedAt: { $gte: since } } }, { $group: { _id: '$browser', clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }]),
      Click.aggregate([{ $match: { linkId: { $in: linkIds }, clickedAt: { $gte: since } } }, { $group: { _id: { $ifNull: ['$referrer', 'Direct'] }, clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }, { $limit: 10 }]),
      Click.find({ linkId: { $in: linkIds } }).sort({ clickedAt: -1 }).limit(30).populate('linkId', 'title shortCode').lean()
    ]);
    res.json({ daily, devices, browsers, referrers, recent });
  } catch (error) { next(error); }
};

exports.topLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ userId: req.user._id }).sort({ clicks: -1 }).limit(10).lean();
    res.json({ links });
  } catch (error) { next(error); }
};

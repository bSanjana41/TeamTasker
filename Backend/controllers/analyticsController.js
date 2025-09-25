import Task from "../models/taskSchema.js";

export const tasksPerDay = async (req, res) => {
  try {
    const days = parseInt(req.query.days || "7", 10);
    const since = new Date();
    since.setDate(since.getDate() - days + 1);

    const data = await Task.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json(data.map(d => ({ date: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const topCompleters = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "5", 10);
    const data = await Task.aggregate([
      { $match: { status: "Done", completedAt: { $ne: null } } },
      { $group: { _id: "$assignee", completed: { $sum: 1 } } },
      { $sort: { completed: -1 } },
      { $limit: limit }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const statusCounts = async (req, res) => {
  try {
    const data = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(data.map(d => ({ status: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



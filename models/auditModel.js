const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  modelName: String,
  documentId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
  changes: Object,
  user: String,
});

module.exports = mongoose.model('Audit', auditSchema);

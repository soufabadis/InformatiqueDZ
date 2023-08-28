const Audit = require('../models/auditModel'); 
const EventEmitter = require('events');
const logger = require("../config/logger");

// Create a custom event emitter for audit
class AuditEmitter extends EventEmitter {}
const auditEmitter = new AuditEmitter();


// Listen for audit events
auditEmitter.on('audit', async (auditData) => {
  try {
    await Audit.create(auditData);
    logger.info('Audit log stored:', auditData);
  } catch (error) {
    logger.error('Error storing audit log:', error);
  }
});


function emitAudit(action, modelName, documentId, changes, user) {
    auditEmitter.emit('audit', {
      action,
      modelName,
      documentId,
      changes,
      user,
    });
  }
  
  module.exports = emitAudit;
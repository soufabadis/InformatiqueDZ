const auditActions = {
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    ADMIN_LOGIN : 'admin_login',
    USER_REGISTER: 'user_register',
    USER_PASSWORD_RESET: 'user_password_reset',
    RECORD_CREATE: 'record_create',
    RECORD_UPDATE: 'record_update',
    RECORD_DELETE: 'record_delete',
    FILE_UPLOAD: 'file_upload',
    FILE_DOWNLOAD: 'file_download',
    PERMISSION_CHANGE: 'permission_change',
    CONFIG_CHANGE: 'config_change',
    SENSITIVE_DATA_ACCESS: 'sensitive_data_access',
    API_ACCESS: 'api_access',
    ERROR_LOG: 'error_log',
    SYSTEM_START: 'system_start',
    SYSTEM_STOP: 'system_stop',
    DATA_EXPORT: 'data_export',
    DATA_IMPORT: 'data_import',
    EMAIL_SENT: 'email_sent',
    PAYMENT_TRANSACTION: 'payment_transaction',
    AUDIT_CONFIG_CHANGE: 'audit_config_change',
    PAYMENT_CREATE : 'payment_create',
    PAYMENT_EXECUTE : 'payment_execute',
    PAYMENT_CANCEL : 'payment_cancel'
  };
  
  module.exports = auditActions;
  
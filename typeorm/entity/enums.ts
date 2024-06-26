export enum HospitalStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  PENDING = 'PENDING',
  DEACTIVATED = 'DEACTIVATED',
}

export enum SiteStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  DEACTIVATED = 'DEACTIVATED',
}

export enum AdminRoles {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  RECORDS = 'RECORDS',
  CASHIER = 'CASHIER',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  SITE_ADMIN = 'SITE_ADMIN',
  HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  HMO_ADMIN = 'HMO_ADMIN',
}

export enum ProviderStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  ON_LEAVE = 'ON_LEAVE',
  ON_BREAK = 'ON_BREAK',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ServiceAreaType {
  INPATIENT = 'INPATIENT',
  PROCEDURE = 'PROCEDURE',
  OUTPATIENT = 'OUTPATIENT',
  EMERGENCY = 'EMERGENCY',
  OTHERS = 'OTHERS',
}

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  DISCHARGED = 'DISCHARGED',
  DECEASED = 'DECEASED',
  INPATIENT = 'INPATIENT',
  OUTPATIENT = 'OUTPATIENT',
}

export enum MartialStatus {
  SINGLE = 'SINGLE',
  IN_A_RELATIONSHIP = 'IN_A_RELATIONSHIP',
  ENGAGED = 'ENGAGED',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED',
  COMPLICATED = 'COMPLICATED',
  OPEN_RELATIONSHIP = 'OPEN_RELATIONSHIP',
  CIVIL_UNION = 'CIVIL_UNION',
  DOMESTIC_PARTNERSHIP = 'DOMESTIC_PARTNERSHIP',
  OTHERS = 'OTHERS',
}

export enum QueryLogType {
  QUERY = 'QUERY',
  ERROR = 'ERROR',
  SLOW = 'SLOW',
  SCHEMA = 'SCHEMA',
  MIGRATION = 'MIGRATION',
  INFO = 'INFO',
  WARN = 'WARN',
  LOG = 'LOG',
}

// export enum QueryLogType {
//   QUERY = 'query',
//   ERROR = 'error',
//   SLOW = 'slow',
//   SCHEMA = 'schema',
//   MIGRATION = 'migration',
//   INFO = 'info',
//   WARN = 'warn',
// }

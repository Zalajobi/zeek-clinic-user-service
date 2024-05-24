import { z } from 'zod';

export const adminRoleSchema = z.preprocess((val) => {
  if (typeof val === 'string') return val.toUpperCase();

  return val;
}, z.enum(['ADMIN', 'SUPER_ADMIN', 'RECORDS', 'CASHIER', 'HOSPITAL_ADMIN', 'SITE_ADMIN', 'HUMAN_RESOURCES', 'HMO_ADMIN']));

export const globalStatusSchema = z.preprocess((val) => {
  if (typeof val === 'string') return val.toUpperCase();

  return val;
}, z.enum(['ALL', 'ACTIVE', 'PENDING', 'ON_LEAVE', 'ON_BREAK', 'SUSPENDED', 'TERMINATED', 'UNAVAILABLE', 'ARCHIVED', 'DEACTIVATED', 'CLOSED', 'DISCHARGED', 'DECEASED', 'INPATIENT', 'OUTPATIENT', 'SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'COMPLICATED', 'OPEN_RELATIONSHIP', 'CIVIL_UNION', 'DOMESTIC_PARTNERSHIP', 'OTHERS']));

export const maritalStatusSchema = z.preprocess((val) => {
  if (typeof val === 'string') return val.toUpperCase();

  return val;
}, z.enum(['SINGLE', 'IN_A_RELATIONSHIP', 'ENGAGED', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'COMPLICATED', 'OPEN_RELATIONSHIP', 'CIVIL_UNION', 'DOMESTIC_PARTNERSHIP', 'OTHERS']));

export const genderSchema = z.preprocess((val) => {
  if (typeof val === 'string') return val.toUpperCase();

  return val;
}, z.enum(['MALE', 'FEMALE', 'OTHERS']));

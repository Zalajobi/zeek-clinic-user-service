import fetch from "nodemailer/lib/fetch";

export const getDepartment = (department:string) => {
  switch (department) {
    case 'BREAST_SCREENING':
      return 'BREAST_SCREENING'
      break
    case 'BURN_CENTER':
      return 'BURN_CENTER'
      break
    case 'CARDIOLOGY':
      return 'CARDIOLOGY'
      break
    case 'CENTRAL_STERILE_SERVICES_DEPARTMENT':
      return 'CENTRAL_STERILE_SERVICES_DEPARTMENT'
      break
    case 'CHAPLAINCY':
      return 'CHAPLAINCY'
      break
    case 'CORONARY_CARE_UNIT':
      return 'CORONARY_CARE_UNIT'
      break
    case 'CRITICAL_CARE':
      return 'CRITICAL_CARE'
      break
    case 'DIAGNOSTIC_IMAGING':
      return 'DIAGNOSTIC_IMAGING'
      break
    case 'DISCHARGE_LOUNGE':
      return 'DISCHARGE_LOUNGE'
      break
    case 'ELDERLY_SERVICES':
      return 'ELDERLY_SERVICES'
      break
    case 'FINANCE_DEPARTMENT':
      return 'FINANCE_DEPARTMENT'
      break
    case 'GASTROENTEROLOGY':
      return 'GASTROENTEROLOGY'
      break
    case 'GENERAL_SERVICES':
      return 'GENERAL_SERVICES'
      break
    case 'GENERAL_SURGERY':
      return 'GENERAL_SURGERY'
      break
    case 'GYNECOLOGY':
      return 'GYNECOLOGY'
      break
    case 'HEMATOLOGY':
      return 'HEMATOLOGY'
      break
    case 'HEALTH_AND_SAFETY':
      return 'HEALTH_AND_SAFETY'
      break
    case 'INTENSIVE_CARE_UNIT':
      return 'INTENSIVE_CARE_UNIT'
      break
    case 'HUMAN_RESOURCES':
      return 'HUMAN_RESOURCES'
      break
    case 'INFECTION_CONTROL':
      return 'INFECTION_CONTROL'
      break
    case 'INFORMATION_MANAGEMENT':
      return 'INFORMATION_MANAGEMENT'
      break
    case 'MATERNITY':
      return 'MATERNITY'
      break
    case 'MEDICAL_RECORDS':
      return 'MEDICAL_RECORDS'
      break
    case 'MICROBIOLOGY':
      return 'MICROBIOLOGY'
      break
    case 'NEONATAL':
      return 'NEONATAL'
      break
    case 'NEPHROLOGY':
      return 'NEPHROLOGY'
      break
    case 'NEUROLOGY':
      return 'NEUROLOGY'
      break
    case 'NUTRITION_AND_DIETETICS':
      return 'NUTRITION_AND_DIETETICS'
      break
    case 'OCCUPATIONAL_THERAPY':
      return 'OCCUPATIONAL_THERAPY'
      break
    case 'ONCOLOGY':
      return 'ONCOLOGY'
      break
    case 'OPHTHALMOLOGY':
      return 'OPHTHALMOLOGY'
      break
    case 'ORTHOPEDICS':
      return 'ORTHOPEDICS'
      break
    case 'OTOLARYNGOLOGY':
      return 'OTOLARYNGOLOGY'
      break
    case 'PAIN_MANAGEMENT':
      return 'PAIN_MANAGEMENT'
      break
    case 'PATIENT_ACCOUNTS':
      return 'PATIENT_ACCOUNTS'
      break
    case 'PATIENT_SERVICES':
      return 'PATIENT_SERVICES'
      break
    case 'PHARMACY':
      return 'PHARMACY'
      break
    case 'PHYSIOTHERAPY':
      return 'PHYSIOTHERAPY'
      break
    case 'EMERGENCY':
      return 'EMERGENCY'
      break
    case 'ADMISSIONS':
      return 'ADMISSIONS'
      break
    case 'ANESTHETICS':
      return 'ANESTHETICS'
      break
    case 'UROLOGY':
      return 'UROLOGY'
      break
    case 'SOCIAL_WORK':
      return 'SOCIAL_WORK'
      break
    case 'SEXUAL_HEALTH':
      return 'SEXUAL_HEALTH'
      break
    case 'RHEUMATOLOGY':
      return 'RHEUMATOLOGY'
      break
    case 'RENAL':
      return 'RENAL'
      break
    case 'RADIOTHERAPY':
      return 'RADIOTHERAPY'
      break
    case 'RADIOLOGY':
      return 'RADIOLOGY'
      break
    case 'PURCHASING_AND_SUPPLIES':
      return 'PURCHASING_AND_SUPPLIES'
      break
    default:
      return 'OTHERS'
      break
  }
}

export const getProviderRole = (role:string) => {
  switch (role) {
    case 'DENTAL_ASSISTANT':
      return 'DENTAL_ASSISTANT'
      break
    case 'NURSING_ASSISTANT':
      return 'NURSING_ASSISTANT'
      break
    case 'MEDICAL_ASSISTANT':
      return 'MEDICAL_ASSISTANT'
      break
    case 'PHYSICIAN_ASSISTANT':
      return 'PHYSICIAN_ASSISTANT'
      break
    case 'PHYSICAL_THERAPY_ASSISTANT':
      return 'PHYSICAL_THERAPY_ASSISTANT'
      break
    case 'MRI_TECHNICIAN':
      return 'MRI_TECHNICIAN'
      break
    case 'PHARMACY_TECHNICIAN':
      return 'PHARMACY_TECHNICIAN'
      break
    case 'VETERINARY_TECHNICIAN':
      return 'VETERINARY_TECHNICIAN'
      break
    case 'LABORATORY_TECHNICIAN':
      return 'LABORATORY_TECHNICIAN'
      break
    case 'CARDIOVASCULAR_TECHNICIAN':
      return 'CARDIOVASCULAR_TECHNICIAN'
      break
    case 'RADIOLOGIC_TECHNICIAN':
      return 'RADIOLOGIC_TECHNICIAN'
      break
    case 'MEDICAL_TECHNICIAN':
      return 'MEDICAL_TECHNICIAN'
      break
    case 'PHYSIOTHERAPIST':
      return 'PHYSIOTHERAPIST'
      break
    case 'MASSAGE_THERAPIST':
      return 'MASSAGE_THERAPIST'
      break
    case 'RESPIRATORY_THERAPIST':
      return 'RESPIRATORY_THERAPIST'
      break
    case 'OCCUPATIONAL_THERAPIST':
      return 'OCCUPATIONAL_THERAPIST'
      break
    case 'PHYSICAL_THERAPIST':
      return 'PHYSICAL_THERAPIST'
      break
    case 'DENTAL_HYGIENIST':
      return 'DENTAL_HYGIENIST'
      break
    case 'PSYCHIATRIC_AIDE':
      return 'PSYCHIATRIC_AIDE'
      break
    case 'NURSE_ANESTHETIST':
      return 'NURSE_ANESTHETIST'
      break
    case 'DISPENSING_OPTICIAN':
      return 'DISPENSING_OPTICIAN'
      break
    case 'FAMILY_PRACTITIONER':
      return 'FAMILY_PRACTITIONER'
      break
    case 'MEDICAL_SONOGRAPHER':
      return 'MEDICAL_SONOGRAPHER'
      break
    case 'SURGICAL_TECHNOLOGIST':
      return 'SURGICAL_TECHNOLOGIST'
      break
    case 'MEDICAL_EQUIPMENT_MANAGER':
      return 'MEDICAL_EQUIPMENT_MANAGER'
      break
    case 'NURSE':
      return 'NURSE'
      break
    case 'DOCTOR':
      return 'DOCTOR'
      break
    case 'DENTIST':
      return 'DENTIST'
      break
    case 'SURGEON':
      return 'SURGEON'
      break
    case 'DIETITIAN':
      return 'DIETITIAN'
      break
    case 'PHYSICIAN':
      return 'PHYSICIAN'
      break
    case 'THERAPIST':
      return 'THERAPIST'
      break
    case 'DIETICIAN':
      return 'DIETICIAN'
      break
    case 'PHARMACIST':
      return 'PHARMACIST'
      break
    case 'PODIATRISTS':
      return 'PODIATRISTS'
      break
    case 'OPTOMETRIST':
      return 'OPTOMETRIST'
      break
    case 'RADIOLOGIST':
      return 'RADIOLOGIST'
      break
    case 'PHLEBOTOMIST':
      return 'PHLEBOTOMIST'
      break
    case 'VETERINARIAN':
      return 'VETERINARIAN'
      break
    case 'PEDIATRICIAN':
      return 'PEDIATRICIAN'
      break
    case 'CHIROPRACTOR':
      return 'CHIROPRACTOR'
      break
    case 'PSYCHIATRIST':
      return 'PSYCHIATRIST'
      break
    case 'OBSTETRICIAN':
      return 'OBSTETRICIAN'
      break
    case 'ANESTHESIOLOGIST':
      return 'ANESTHESIOLOGIST'
      break
    default:
      return 'DOCTOR'
      break
  }
}

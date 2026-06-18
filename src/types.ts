export interface AppointmentLetterData {
  companyName: string;
  companySubName: string;
  letterTitle: string;
  docRef: string;
  issueDate: string;
  
  // Recipient info
  recipientPrefix: string; // "Mr."
  recipientName: string; // "Muhammad Ibrahim"
  recipientFH: string; // "Shamnad H" (S/O or D/O or W/O)
  recipientFHPrefix: string; // "S/O:"
  recipientAddressLine1: string; // "Suhara Manzil, TC 35/384(3)"
  recipientAddressLine2: string; // "J M Road, Thiruvananthapuram"
  recipientAddressLine3: string; // "Kerala – 695008"
  
  // Subject & Salutation
  subject: string;
  salutation: string;
  welcomeIntro: string;
  associationText: string;
  roleResponsibilitiesText: string;
  
  // Appointment Details tabular data
  designation: string;
  dateOfJoining: string;
  reportingLocation: string;
  employmentType: string;
  serviceCategory: string;
  compensationStructure: string;
  
  // Terms & Conditions list
  terms: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  
  // Welcome Msg Section
  teamWelcomeMessage: string;
  closingSalutation: string;
  
  // Sender Details
  senderName: string; // "SHAHAS S"
  senderRole: string; // "Managing Partner"
  senderCompany: string; // "Compass Travel & Transportation"
  senderDate: string; // "17 June 2026"
  senderSignatureUrl: string; // base64 or empty string
  
  // Employee Acceptance
  acceptanceChecklist: string;
  employeeSignatureUrl: string; // base64 or empty string
  employeeName: string; // "Muhammad Ibrahim"
  employeeDate: string; // "17/06/2026"
  employeePlace: string; // "Thiruvananthapuram"
  
  // Footer text
  footerTagline: string;
  footerSlogan: string;
  footerDocStatus: string;

  // Accept Offer Config
  showAcceptButton: boolean;
  acceptOfferUrl: string;
  acceptBtnText: string;
  acceptInstructions: string;
}

export type ThemeVariant = 'royal-navy' | 'midnight-gold' | 'emperor-blue' | 'classic-indigo' | 'sophisticated-dark';

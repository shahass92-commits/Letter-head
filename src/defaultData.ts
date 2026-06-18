import { AppointmentLetterData } from './types';

export const initialLetterData: AppointmentLetterData = {
  companyName: "COMPASS TRAVEL & TRANSPORTATION",
  companySubName: "Professional Mobility Solutions • Corporate Transit Services",
  letterTitle: "OFFICIAL APPOINTMENT & JOINING LETTER",
  docRef: "CTT/APPT/FLEET/2026/001",
  issueDate: "17 June 2026",
  
  recipientPrefix: "Mr.",
  recipientName: "Muhammad Ibrahim",
  recipientFHPrefix: "S/O:",
  recipientFH: "Shamnad H",
  recipientAddressLine1: "Suhara Manzil, TC 35/384(3)",
  recipientAddressLine2: "J M Road, Thiruvananthapuram",
  recipientAddressLine3: "Kerala – 695008",
  
  subject: "APPOINTMENT & JOINING CONFIRMATION AS IQ DEVELOPER & TRAINER (IQDT)",
  salutation: "Dear Mr. Muhammad Ibrahim,",
  welcomeIntro: "We are pleased to formally welcome you to Compass Travel & Transportation and confirm your appointment as an IQ Developer & Trainer (IQDT), effective 17 June 2026.",
  associationText: "Your engagement with Compass Travel & Transportation represents the commencement of a professional association focused on custom AI application development for post-payment candidate services, delivering advanced AI application tutorials to our driving partners, and guiding GPS transit tracking with Google Geocoding exact point coordinates.",
  roleResponsibilitiesText: "In your capacity as an IQ Developer & Trainer (IQDT), you will be responsible for developing state-of-the-art AI applications for post-payment candidate management, training our driving partners on artificial intelligence systems, and leading exact GPS mapping utilizing Google Geocoding APIs to resolve pin-point pickup and drop-off coordinates for corporate employees.",
  
  designation: "IQ Developer & Trainer (IQDT)",
  dateOfJoining: "17 June 2026",
  reportingLocation: "Technopark Campus, Thiruvananthapuram",
  employmentType: "Full-Time",
  serviceCategory: "AI Development, Technology Training & GPS Mapping Coordination",
  compensationStructure: "As per company policy and mutually agreed remuneration structure",
  
  terms: [
    {
      id: 1,
      title: "Professional Conduct & Innovation",
      description: "The IQ Developer & Trainer (IQDT) shall consistently demonstrate high standards of professionalism, integrity, code security, and discipline while developing proprietary software and coordinating geocoding parameters."
    },
    {
      id: 2,
      title: "AI Training & Implementation",
      description: "The IQ Developer & Trainer (IQDT) shall be responsible for training and onboarding driving partners onto the new AI applications, ensuring smooth user adoption and seamless operations."
    },
    {
      id: 3,
      title: "GPS & Geocoding Standards",
      description: "The IQ Developer & Trainer (IQDT) is responsible for designing, testing, and implementing precise Google Geocoding APIs and GPS location mapping protocols to achieve complete pinpoint exact-point accuracy for employee routes."
    },
    {
      id: 4,
      title: "Performance & Discipline",
      description: "Any instance of misconduct, negligence, non-compliance with safety requirements, unauthorized absence, or violation of organizational policies may result in disciplinary action, including suspension or termination of employment."
    },
    {
      id: 5,
      title: "Compensation",
      description: "Compensation shall be processed in accordance with company policies, attendance records, completed assignments, verified operational records, and approved payment schedules."
    },
    {
      id: 6,
      title: "Confidentiality",
      description: "All client information, operational data, fleet records, route details, and proprietary business information accessed during the course of employment shall be treated as strictly confidential and shall not be disclosed without authorization."
    }
  ],
  
  teamWelcomeMessage: "At Compass Travel & Transportation, our IQ Developers & Trainers (IQDT) play a critical role in bridging technology, advanced AI application training, and logistics precision. Your commitment to coding robust after-payment tools, training our partner network, and ensuring precise exact-point GPS mapping will contribute directly to our digital transit goals.\n\nWe are pleased to welcome you to the team and look forward to a productive, technologically advanced professional association.",
  closingSalutation: "FOR COMPASS TRAVEL & TRANSPORTATION",
  
  senderName: "SHAHAS S",
  senderRole: "Managing Partner",
  senderCompany: "Compass Travel & Transportation",
  senderDate: "17 June 2026",
  senderSignatureUrl: "", // Start empty
  
  acceptanceChecklist: "I, Muhammad Ibrahim, hereby acknowledge and accept my appointment as IQ Developer & Trainer (IQDT) with Compass Travel & Transportation and agree to comply with all terms, conditions, operational guidelines, and organizational policies outlined in this document.",
  employeeSignatureUrl: "", // Start empty
  employeeName: "Muhammad Ibrahim",
  employeeDate: "17/06/2026",
  employeePlace: "Thiruvananthapuram",
  
  footerTagline: "Professional Mobility Solutions • Employee Transportation • Corporate Transit Services",
  footerSlogan: "“Driven by Safety. Powered by Service Excellence.”",
  footerDocStatus: "Official Appointment & Joining Confirmation Letter",

  // Accept Offer Config
  showAcceptButton: true,
  acceptOfferUrl: "https://compass-travels.in/portal/acceptOffer?ref=CTT-APPT-FLEET-2026-001",
  acceptBtnText: "ACCEPT APPOINTMENT & JOINING",
  acceptInstructions: "To accept this selection officially, please click the secure button above to log into our internal HR system. Verify your basic information and attach high-resolution copies of your valid driving license. Alternatively, you may sign and return this official document via response mail directly to registration@compasstravels.in."
};

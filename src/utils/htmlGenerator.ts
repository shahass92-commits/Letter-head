import { AppointmentLetterData, ThemeVariant } from '../types';

export function generateMailBodyHtml(data: AppointmentLetterData, theme: ThemeVariant = 'midnight-gold'): string {
  // Define comprehensive theme specifications mapping colors, borders, typography, buttons, and layout rules
  const themeStyles = {
    'sophisticated-dark': {
      outerBg: '#0c1322',
      letterBg: '#111827',
      primaryText: '#ffffff',
      secondaryText: '#cbd5e1',
      mutedText: '#94a3b8',
      accentGold: '#c5a059',
      accentBlue: '#0c1322',
      borderStyle: '12px solid #c5a059', // Beautiful Golden luxury boundary rule requested in theme
      borderCol: '#c5a059',
      borderColSub: 'rgba(197, 160, 89, 0.3)',
      headerBg: '#0c1322',
      headerText: '#c5a059',
      tableHeaderBg: '#0c1322',
      tableRowEven: '#1e293b',
      tableRowOdd: '#111827',
      highlightBoxBg: '#1e293b',
      accentLine: '4px solid #c5a059',
      btnBg: '#c5a059',
      btnText: '#0c1322',
      btnBorder: 'none',
      fontHead: "'Cinzel', Georgia, serif",
      fontBody: "'Inter', 'Segoe UI', sans-serif"
    },
    'royal-navy': {
      outerBg: '#0f172a', // Premium Dominant Dark Blue Background as requested
      letterBg: '#ffffff', // Pristine white elegant A4 page layout
      primaryText: '#0f294a',
      secondaryText: '#334155',
      mutedText: '#64748b',
      accentGold: '#c5a880',
      accentBlue: '#0f294a',
      borderStyle: '1px solid #cbd5e1',
      borderCol: '#cbd5e1',
      borderColSub: '#e2e8f0',
      headerBg: '#0f294a',
      headerText: '#ffffff',
      tableHeaderBg: '#0f294a',
      tableRowEven: '#f8fafc',
      tableRowOdd: '#ffffff',
      highlightBoxBg: '#fcfaf6',
      accentLine: '4px solid #c5a880',
      btnBg: '#0f294a',
      btnText: '#ffffff',
      btnBorder: '1px solid #c5a880',
      fontHead: "'Segoe UI', Arial, sans-serif",
      fontBody: "'Segoe UI', Arial, sans-serif"
    },
    'midnight-gold': {
      outerBg: '#f1f5f9', // Clean White light-blue wrapper
      letterBg: '#ffffff',
      primaryText: '#0d1e34',
      secondaryText: '#334155',
      mutedText: '#64748b',
      accentGold: '#c5a880',
      accentBlue: '#0d1e34',
      borderStyle: '1px solid #e2e8f0',
      borderCol: '#cbd5e1',
      borderColSub: '#f1f5f9',
      headerBg: '#0d1e34',
      headerText: '#ffffff',
      tableHeaderBg: '#0d1e34',
      tableRowEven: '#f8fafc',
      tableRowOdd: '#ffffff',
      highlightBoxBg: '#fcfaf6',
      accentLine: '4px solid #c5a880',
      btnBg: '#c5a880',
      btnText: '#0d1e34',
      btnBorder: 'none',
      fontHead: "'Segoe UI', Arial, sans-serif",
      fontBody: "'Segoe UI', Arial, sans-serif"
    },
    'emperor-blue': {
      outerBg: '#0d1e34', // Deep Royal Blue Background Wrapper
      letterBg: '#ffffff',
      primaryText: '#0d1e34',
      secondaryText: '#334155',
      mutedText: '#475569',
      accentGold: '#b48c36',
      accentBlue: '#1e3a8a',
      borderStyle: '2px solid #b48c36',
      borderCol: '#cbd5e1',
      borderColSub: '#fcf9f2',
      headerBg: '#1e3a8a',
      headerText: '#ffffff',
      tableHeaderBg: '#1e3a8a',
      tableRowEven: '#f8fafc',
      tableRowOdd: '#ffffff',
      highlightBoxBg: '#fcf9f2',
      accentLine: '4px solid #b48c36',
      btnBg: '#b48c36',
      btnText: '#ffffff',
      btnBorder: 'none',
      fontHead: "'Georgia', serif",
      fontBody: "'Segoe UI', Arial, sans-serif"
    },
    'classic-indigo': {
      outerBg: '#f1f5f9',
      letterBg: '#ffffff',
      primaryText: '#1e3a8a',
      secondaryText: '#334155',
      mutedText: '#64748b',
      accentGold: '#c5a880',
      accentBlue: '#1e40af',
      borderStyle: '1px solid #e2e8f0',
      borderCol: '#cbd5e1',
      borderColSub: '#f1f5f9',
      headerBg: '#1e40af',
      headerText: '#ffffff',
      tableHeaderBg: '#1e40af',
      tableRowEven: '#f8fafc',
      tableRowOdd: '#ffffff',
      highlightBoxBg: '#fcfaf6',
      accentLine: '4px solid #c5a880',
      btnBg: '#1e40af',
      btnText: '#ffffff',
      btnBorder: '1px solid #c5a880',
      fontHead: "'Segoe UI', Arial, sans-serif",
      fontBody: "'Segoe UI', Arial, sans-serif"
    }
  };

  const style = themeStyles[theme] || themeStyles['midnight-gold'];

  // Format welcome message paragraphs with inline styling aligned with the active theme font specs
  const formattedWelcomeMessage = data.teamWelcomeMessage
    .split('\n\n')
    .map(para => `<p style="margin: 0 0 10px 0; font-family: ${style.fontBody}; font-size: 12px; line-height: 1.5; color: ${style.secondaryText};">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const signatureStyle = "max-height: 48px; width: auto; display: block; filter: multiply(1.1); margin-bottom: 2px;";
  
  // Custom sign-off previews (uses uploaded signature image or renders digital styling fallback gracefully)
  const bossSignatureHtml = data.senderSignatureUrl 
    ? `<img src="${data.senderSignatureUrl}" style="${signatureStyle}" alt="${data.senderName} Signature" />`
    : `<div style="height: 42px; border-bottom: 1px dashed ${style.accentGold}; margin-bottom: 4px; font-family: 'Georgia', serif; font-style: italic; font-size: 18px; line-height: 44px; color: ${style.accentGold}; letter-spacing: 1px;">Shahas S</div>`;

  const employeeSignatureHtml = data.employeeSignatureUrl
    ? `<img src="${data.employeeSignatureUrl}" style="${signatureStyle}" alt="${data.employeeName} Signature" />`
    : `<div style="height: 42px; border-bottom: 1px dashed ${style.accentGold}; margin-bottom: 4px; font-family: 'Georgia', serif; font-style: italic; font-size: 18px; line-height: 44px; color: ${style.accentGold}; letter-spacing: 1px;">${data.employeeName}</div>`;

  // Pre-calculate terms template with theme specific variables
  const termsRows = data.terms.map(term => `
    <tr>
      <td valign="top" style="padding-bottom: 9px; width: 28px;">
        <span style="display: inline-block; background-color: ${style.headerBg}; color: ${style.headerText}; font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; line-height: 18px; width: 18px; height: 18px; border-radius: 50%; text-align: center; border: 1px solid ${style.accentGold};">
          ${term.id}
        </span>
      </td>
      <td valign="top" style="padding-bottom: 9px; padding-left: 4px;">
        <h4 style="margin: 0 0 2px 0; font-family: ${style.fontHead}; font-size: 13px; font-weight: 700; color: ${style.primaryText}; letter-spacing: 0.1px;">
          ${term.title}
        </h4>
        <p style="margin: 0; font-family: ${style.fontBody}; font-size: 12px; line-height: 1.4; color: ${style.mutedText};">
          ${term.description}
        </p>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${data.letterTitle}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style type="text/css">
    /* Outlook, Hotmail & Client layout resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${style.outerBg}; font-family: ${style.fontBody}; }
    
    /* Dedicated responsive design break points */
    @media screen and (max-width: 680px) {
      .container-table { width: 100% !important; max-width: 100% !important; border: none !important; }
      .mobile-padding { padding: 18px !important; }
      .col-split { display: block !important; width: 100% !important; margin-bottom: 18px !important; padding-left: 0 !important; border-left: none !important; }
      .signature-spacer { height: 10px !important; display: block !important; }
      .btn-responsive { width: 100% !important; max-width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${style.outerBg}; -webkit-font-smoothing: antialiased;">

  <!-- Outer wrapper table centered constraints -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${style.outerBg}; padding: 20px 8px;">
    <tr>
      <td align="center">
        
        <!-- Main Letter Canvas -->
        <table class="container-table" border="0" cellpadding="0" cellspacing="0" width="680" style="background-color: ${style.letterBg}; border: ${style.borderStyle}; border-radius: 6px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12); overflow: hidden;">
          
          <!-- CORPORATE IDENTITY BANNER -->
          <tr>
            <td style="background-color: ${style.headerBg}; padding: 22px 28px; border-bottom: 3px solid ${style.accentGold};" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0 0 2px 0; font-family: ${style.fontHead}; font-size: 21px; font-weight: 800; color: ${style.headerText}; letter-spacing: 0.8px; text-transform: uppercase; line-height: 1.2;">
                      ${data.companyName}
                    </h1>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 10px; font-weight: 600; color: ${style.accentGold}; letter-spacing: 1.5px; text-transform: uppercase;">
                      ${data.companySubName}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN DOCUMENT CONTENT SECTION -->
          <tr>
            <td style="padding: 24px 32px 20px 32px; background-color: ${style.letterBg};" class="mobile-padding">
              
              <!-- Ref / Date layout -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td align="left" style="padding-bottom: 8px;">
                    <span style="font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; color: ${style.accentGold}; letter-spacing: 1.2px; text-transform: uppercase; display: block; margin-bottom: 2px;">
                      Official Document Record
                    </span>
                    <h2 style="margin: 0; font-family: ${style.fontHead}; font-size: 17px; font-weight: 700; color: ${style.primaryText}; letter-spacing: 0.1px;">
                      ${data.letterTitle}
                    </h2>
                  </td>
                  <td align="right" valign="bottom" style="padding-bottom: 8px; text-align: right;">
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 12px; font-weight: 600; color: ${style.mutedText};">
                      Date: <b style="color: ${style.primaryText};">${data.issueDate}</b>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" height="1" style="background-color: ${style.borderColSub}; line-height: 1px; font-size: 1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- RECIPIENT BRIEFING CARD -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; background-color: ${theme === 'sophisticated-dark' ? '#1f2937' : '#f8fafc'}; border-left: 4px solid ${style.accentGold}; border-radius: 0 4px 4px 0;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0 0 4px 0; font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; color: ${style.accentGold}; text-transform: uppercase; letter-spacing: 0.8px;">TO THE CORRESPONDENT,</p>
                    <p style="margin: 0 0 2px 0; font-family: ${style.fontHead}; font-size: 15px; font-weight: 700; color: ${style.primaryText};">
                      ${data.recipientPrefix} ${data.recipientName}
                    </p>
                    <p style="margin: 0 0 4px 0; font-family: ${style.fontBody}; font-size: 12px; font-weight: 500; color: ${style.secondaryText};">
                      <span style="color: ${style.accentGold}; font-weight: 600;">${data.recipientFHPrefix}</span> ${data.recipientFH}
                    </p>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 12px; line-height: 1.4; color: ${style.mutedText};">
                      ${data.recipientAddressLine1}, ${data.recipientAddressLine2}, ${data.recipientAddressLine3}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- SUBJECT SUBJECT SUBJECT -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td style="background-color: ${style.highlightBoxBg}; padding: 10px 14px; border-radius: 4px; border: 1px solid ${style.borderColSub};">
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; text-transform: uppercase; letter-spacing: 0.3px; line-height: 1.3;">
                      SUBJECT: ${data.subject}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- LETTER PRIMARY PARAGRAPHS -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td style="font-family: ${style.fontBody}; font-size: 13px; line-height: 1.5; color: ${style.secondaryText};">
                    
                    <p style="margin: 0 0 10px 0; font-family: ${style.fontHead}; font-weight: 750; color: ${style.primaryText}; font-size: 14px;">
                      ${data.salutation}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      ${data.welcomeIntro}
                    </p>

                    <p style="margin: 0 0 8px 0;">
                      ${data.associationText}
                    </p>

                    <p style="margin: 0 0 12px 0;">
                      ${data.roleResponsibilitiesText}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- APPOINTMENT CONTRACT TABLE (Tabular Specs) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; border-collapse: collapse; border: 1px solid ${style.borderCol}; border-radius: 4px; overflow: hidden;">
                <thead>
                  <tr style="background-color: ${style.tableHeaderBg};">
                    <td colspan="2" style="padding: 10px 14px; border-bottom: 2px solid ${style.accentGold};">
                      <h3 style="margin: 0; font-family: ${style.fontHead}; font-size: 12px; font-weight: 700; color: ${style.headerText}; letter-spacing: 0.8px; text-transform: uppercase;">
                        APPOINTMENT PARTICULARS
                      </h3>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color: ${style.tableRowOdd};">
                    <td width="30%" style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-bottom: 1px solid ${style.borderColSub}; border-right: 1px solid ${style.borderColSub};">
                      Designation
                    </td>
                    <td width="70%" style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 600; color: ${style.secondaryText}; border-bottom: 1px solid ${style.borderColSub};">
                      ${data.designation}
                    </td>
                  </tr>
                  <tr style="background-color: ${style.tableRowEven};">
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-bottom: 1px solid ${style.borderColSub}; border-right: 1px solid ${style.borderColSub};">
                      Date of Joining
                    </td>
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.accentGold}; border-bottom: 1px solid ${style.borderColSub};">
                      ${data.dateOfJoining}
                    </td>
                  </tr>
                  <tr style="background-color: ${style.tableRowOdd};">
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-bottom: 1px solid ${style.borderColSub}; border-right: 1px solid ${style.borderColSub};">
                      Reporting Location
                    </td>
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; color: ${style.secondaryText}; border-bottom: 1px solid ${style.borderColSub};">
                      ${data.reportingLocation}
                    </td>
                  </tr>
                  <tr style="background-color: ${style.tableRowEven};">
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-bottom: 1px solid ${style.borderColSub}; border-right: 1px solid ${style.borderColSub};">
                      Employment Type
                    </td>
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; color: ${style.secondaryText}; border-bottom: 1px solid ${style.borderColSub};">
                      ${data.employmentType}
                    </td>
                  </tr>
                  <tr style="background-color: ${style.tableRowOdd};">
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-bottom: 1px solid ${style.borderColSub}; border-right: 1px solid ${style.borderColSub};">
                      Service Category
                    </td>
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; color: ${style.secondaryText}; border-bottom: 1px solid ${style.borderColSub};">
                      ${data.serviceCategory}
                    </td>
                  </tr>
                  <tr style="background-color: ${style.tableRowEven};">
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 700; color: ${style.primaryText}; border-right: 1px solid ${style.borderColSub};">
                      Compensation
                    </td>
                    <td style="padding: 8px 14px; font-family: ${style.fontBody}; font-size: 12px; font-style: italic; font-weight: 600; color: ${style.primaryText};">
                      ${data.compensationStructure}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- INTERACTIVE ACCEPT OFFER ACTION (Requested by User) -->
              ${data.showAcceptButton ? `
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; background-color: ${style.highlightBoxBg}; border: 1px dashed ${style.accentGold}; border-radius: 6px;">
                <tr>
                  <td style="padding: 14px 18px; text-align: center;" align="center">
                    <p style="margin: 0 0 10px 0; font-family: ${style.fontHead}; font-size: 14px; font-weight: 700; color: ${style.primaryText}; text-transform: uppercase; letter-spacing: 0.3px;">
                      Interactive Offer Response
                    </p>
                    
                    <!-- Call To Action Button -->
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
                      <tr>
                        <td align="center" style="background-color: ${style.btnBg}; border-radius: 4px; box-shadow: 0 3px 8px rgba(197, 160, 89, 0.15);" bgcolor="${style.btnBg}">
                          <a href="${data.acceptOfferUrl}" target="_blank" class="btn-responsive" style="display: inline-block; padding: 10px 20px; font-family: ${style.fontBody}; font-size: 12px; font-weight: 800; color: ${style.btnText}; text-decoration: none; text-transform: uppercase; letter-spacing: 0.8px; border: ${style.btnBorder}; border-radius: 4px;">
                            ${data.acceptBtnText} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Fallback Instructions -->
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 11px; line-height: 1.5; color: ${style.mutedText}; text-align: left;">
                      ${data.acceptInstructions}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- TERMS & CONDITIONS CLAUSES -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                <tr>
                  <td style="border-bottom: 2px solid ${style.accentBlue}; padding-bottom: 4px; margin-bottom: 10px; display: block;">
                    <h3 style="margin: 0; font-family: ${style.fontHead}; font-size: 13px; font-weight: 700; color: ${style.primaryText}; letter-spacing: 0.5px; text-transform: uppercase;">
                      Terms &amp; Conditions OF ENGAGEMENT
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${termsRows}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- WELCOME ENCLOSURE BLOCK -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px; background-color: ${style.highlightBoxBg}; border: 1px solid ${style.accentGold}; border-radius: 4px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 18px 10px 18px; font-family: ${style.fontBody};">
                    <span style="font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; color: ${style.accentGold}; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px;">
                      Executive Welcome Message
                    </span>
                    ${formattedWelcomeMessage}
                  </td>
                </tr>
              </table>

              <!-- DUAL SIGNATURE PLACEMENT (Employer & Employee) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                <tr>
                  <!-- Employer Signing Block -->
                  <td width="48%" valign="top" class="col-split">
                    <p style="margin: 0 0 6px 0; font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; color: ${style.accentGold}; letter-spacing: 0.5px; text-transform: uppercase;">
                      ${data.closingSalutation}
                    </p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                      <tr>
                        <td align="left" style="height: 48px; vertical-align: bottom;">
                          ${bossSignatureHtml}
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-family: ${style.fontHead}; font-size: 13px; font-weight: 700; color: ${style.primaryText};">
                      ${data.senderName}
                    </p>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 11px; font-weight: 600; color: ${style.mutedText}; text-transform: uppercase;">
                      ${data.senderRole}
                    </p>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 10px; color: ${style.mutedText}; font-weight: 500;">
                      ${data.senderCompany}
                    </p>
                    <p style="margin: 2px 0 0 0; font-family: ${style.fontBody}; font-size: 11px; color: ${style.accentGold};">
                      Date: ${data.senderDate}
                    </p>
                  </td>

                  <!-- Spacing cell spacer -->
                  <td width="4%" class="signature-spacer" style="font-size: 1px; line-height: 1px;">&nbsp;</td>

                  <!-- Employee Receipt Acknowledgement -->
                  <td width="48%" valign="top" class="col-split" style="border-left: 1px solid ${style.borderColSub}; padding-left: 16px;">
                    <p style="margin: 0 0 6px 0; font-family: ${style.fontBody}; font-size: 10px; font-weight: 700; color: ${style.accentGold}; letter-spacing: 0.5px; text-transform: uppercase;">
                      EMPLOYEE ACCEPTANCE RECORD
                    </p>
                    
                    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 8px;">
                      <tr>
                        <td align="left" style="height: 48px; vertical-align: bottom;">
                          ${employeeSignatureHtml}
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-family: ${style.fontHead}; font-size: 13px; font-weight: 700; color: ${style.primaryText};">
                      ${data.employeeName}
                    </p>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 11px; font-weight: 600; color: ${style.mutedText}; text-transform: uppercase;">
                      Employee Signature
                    </p>
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 11px; color: ${style.mutedText};">
                      Place: <b style="color: ${style.primaryText};">${data.employeePlace}</b>
                    </p>
                    <p style="margin: 2px 0 0 0; font-family: ${style.fontBody}; font-size: 11px; color: ${style.accentGold};">
                      Date: ${data.employeeDate}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- VERBATIM EMPLOYEE STATEMENT COMPLIANCE BOX -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${style.outerBg}; border: 1px dashed ${style.accentGold}; border-radius: 4px;">
                <tr>
                  <td style="padding: 12px 16px;">
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 11.5px; line-height: 1.5; color: ${style.secondaryText}; font-style: italic;">
                      "I, <b style="color: ${style.primaryText}; font-style: normal;">${data.employeeName}</b>, hereby acknowledge and accept my appointment as <b style="color: ${style.primaryText}; font-style: normal;">${data.designation}</b> with Compass Travel &amp; Transportation and agree to comply with all terms, conditions, operational guidelines, and organizational policies outlined in this document."
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Thin bottom golden border separator -->
          <tr>
            <td height="3" style="background-color: ${style.accentGold}; line-height: 3px; font-size: 3px;">&nbsp;</td>
          </tr>

          <!-- CORPORATE COGNIZANCE FOOTER -->
          <tr>
            <td style="background-color: ${style.headerBg}; padding: 18px 24px; text-align: center;" class="mobile-padding">
              <p style="margin: 0 0 3px 0; font-family: ${style.fontHead}; font-size: 11px; font-weight: 700; color: ${style.headerText}; letter-spacing: 1px; text-transform: uppercase;">
                ${data.companyName}
              </p>
              <p style="margin: 0 0 6px 0; font-family: ${style.fontBody}; font-size: 9px; color: ${style.mutedText}; letter-spacing: 0.5px;">
                ${data.footerTagline}
              </p>
              <p style="margin: 0 0 12px 0; font-family: 'Georgia', serif; font-style: italic; font-size: 11px; color: ${style.accentGold};">
                ${data.footerSlogan}
              </p>
              
              <!-- Footer Document Meta Codes -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid ${style.borderColSub}; padding-top: 10px;">
                <tr>
                  <td align="left" style="width: 50%;">
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 8.5px; text-transform: uppercase; color: ${style.mutedText}; letter-spacing: 0.5px;">
                      REF: <b style="color: ${style.secondaryText};">${data.docRef}</b>
                    </p>
                  </td>
                  <td align="right" style="width: 50%; text-align: right;">
                    <p style="margin: 0; font-family: ${style.fontBody}; font-size: 8.5px; text-transform: uppercase; color: ${style.mutedText}; letter-spacing: 0.5px;">
                      STATUS: <b style="color: ${style.accentGold};">${data.footerDocStatus}</b>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
`;
}

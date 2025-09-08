function doPost(e) {
  try {
    const data = e.parameter;
    
    const subject = `[NOUVEAU RSVP] ${data.firstName} ${data.lastName} - Mariage Paula & Pierre`;
    const htmlBody = createMainEmail(data);
    
    GmailApp.sendEmail(
      'pierrearnouxdmr@gmail.com',
      subject,
      '',
      { htmlBody: htmlBody }
    );
    
    // Email de confirmation (pour l'invité) - Style décoratif avec données dynamiques
    const replySubject = data.confirmationSubject || 'Confirmation RSVP - Paula & Pierre';
    const replyBodyText = data.confirmationBody || 'Merci pour votre RSVP !';
    const replyBodyHtml = createStyledAutoReply(data, replyBodyText);
    
    GmailApp.sendEmail(
      data.email,
      replySubject,
      replyBodyText, // Version texte
      { htmlBody: replyBodyHtml }
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createMainEmail(data) {
  const now = new Date();
  const ceremonyStatus = data.ceremony === 'oui' ? 'OUI' : 'NON';
  const receptionStatus = data.reception === 'oui' ? 'OUI' : 'NON';
  const total = parseInt(data.adults || 1) + parseInt(data.children || 0);
  
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: rgb(223, 224, 225); padding: 20px;">
    <div style="background: linear-gradient(135deg, #a8998a, #8b7d6b); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif;">NOUVEAU RSVP</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Mariage Paula & Pierre</p>
      <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 14px;">Recu le ${now.toLocaleDateString('fr-FR')} a ${now.toLocaleTimeString('fr-FR')}</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <div style="margin: 0 0 25px 0; padding: 20px; background: #f8f7f6; border-left: 4px solid #a8998a; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Informations personnelles</h3>
        <p style="margin: 8px 0; color: #333;"><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Email :</strong> ${data.email}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Telephone :</strong> ${data.phone || 'Non renseigne'}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Langue :</strong> ${data.language === 'fr' ? 'Francais' : 'Slovene'}</p>
      </div>
      
      <div style="margin: 0 0 25px 0; padding: 20px; background: #f8f7f6; border-left: 4px solid #a8998a; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Presence aux evenements</h3>
        <p style="margin: 8px 0; color: #333;">
          <strong>Messe Paris :</strong> 
          <span style="background: ${data.ceremony === 'oui' ? '#d6d0c8' : '#e8e6e3'}; color: ${data.ceremony === 'oui' ? '#6b5d54' : '#8a7d74'}; padding: 4px 12px; border-radius: 15px; font-weight: bold; font-size: 13px;">${ceremonyStatus}</span>
        </p>
        <p style="margin: 8px 0; color: #333;">
          <strong>Fete Cercanceaux :</strong> 
          <span style="background: ${data.reception === 'oui' ? '#d6d0c8' : '#e8e6e3'}; color: ${data.reception === 'oui' ? '#6b5d54' : '#8a7d74'}; padding: 4px 12px; border-radius: 15px; font-weight: bold; font-size: 13px;">${receptionStatus}</span>
        </p>
      </div>
      
      <div style="margin: 0 0 25px 0; padding: 20px; background: #f8f7f6; border-left: 4px solid #a8998a; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Nombre d'invites</h3>
        <p style="margin: 8px 0; color: #333;"><strong>Adultes :</strong> ${data.adults || 1}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Enfants :</strong> ${data.children || 0}</p>
        <p style="margin: 8px 0; color: #333;">
          <strong>TOTAL :</strong> 
          <span style="background: #a8998a; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">${total} personnes</span>
        </p>
      </div>
      
      ${data.guestNames ? `
      <div style="margin: 0 0 25px 0; padding: 20px; background: #f8f7f6; border-left: 4px solid #9a8c7f; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Autres invites</h3>
        <p style="background: #e8e6e3; padding: 15px; border-radius: 5px; margin: 0; color: #333; line-height: 1.5;">${data.guestNames}</p>
      </div>` : ''}
      
      ${data.allergies ? `
      <div style="margin: 0 0 25px 0; padding: 20px; background: #faf9f8; border-left: 4px solid #c4a484; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Allergies & restrictions</h3>
        <p style="background: #f0ede9; padding: 15px; border-radius: 5px; margin: 0; color: #333; line-height: 1.5;">${data.allergies}</p>
      </div>` : ''}
      
      ${data.comments ? `
      <div style="margin: 0 0 25px 0; padding: 20px; background: #f8f7f6; border-left: 4px solid #a8998a; border-radius: 5px;">
        <h3 style="color: #6b5d54; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Commentaires</h3>
        <p style="background: #e8e6e3; padding: 15px; border-radius: 5px; margin: 0; color: #333; line-height: 1.5;">${data.comments}</p>
      </div>` : ''}
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e8e6e3; color: #8a7d74; font-size: 14px;">
        <p style="margin: 5px 0;">Email automatique du site de mariage</p>
        <p style="margin: 5px 0; font-weight: 500;">Paula & Pierre - 2 mai 2026</p>
      </div>
    </div>
  </div>`;
}

function createStyledAutoReply(data, bodyText) {
  // Séparer le contenu du bodyText pour l'intégrer dans le design
  const lines = bodyText.split('\n').filter(line => line.trim() !== ''); // Enlever les lignes vides
  const greeting = lines[0] || `MERCI ${data.firstName.toUpperCase()} !`;
  
  // Trouver les sections principales
  const ceremonySectionStart = lines.findIndex(line => line.toLowerCase().includes('messe') || line.toLowerCase().includes('sv. maša'));
  const receptionSectionStart = lines.findIndex(line => line.toLowerCase().includes('fête') || line.toLowerCase().includes('slavje') || line.toLowerCase().includes('à partir'));
  const practicalSectionStart = lines.findIndex(line => line.toLowerCase().includes('pratique') || line.toLowerCase().includes('praktične'));
  
  let ceremonyDetails = '';
  let receptionDetails = '';
  let practicalInfo = [];
  
  // Extraire les détails de la messe - inclure la ligne de titre aussi
  if (ceremonySectionStart !== -1) {
    const ceremonyEndIndex = receptionSectionStart !== -1 ? receptionSectionStart : practicalSectionStart;
    for (let i = ceremonySectionStart; i < (ceremonyEndIndex || lines.length); i++) {
      if (lines[i].trim() && !lines[i].toLowerCase().includes('rappel') && !lines[i].toLowerCase().includes('opomnik')) {
        // Convertir les \n littéraux en <br> pour l'HTML
        ceremonyDetails += lines[i].replace(/\\n/g, '<br>') + '<br>';
      }
    }
  }
  
  // Extraire les détails de la réception - inclure la ligne de titre aussi
  if (receptionSectionStart !== -1) {
    const receptionEndIndex = practicalSectionStart !== -1 ? practicalSectionStart : lines.length;
    for (let i = receptionSectionStart; i < receptionEndIndex; i++) {
      if (lines[i].trim() && !lines[i].toLowerCase().includes('pratique') && !lines[i].toLowerCase().includes('praktične')) {
        // Convertir les \n littéraux en <br> pour l'HTML
        receptionDetails += lines[i].replace(/\\n/g, '<br>') + '<br>';
      }
    }
  }
  
  // Extraire les informations pratiques
  if (practicalSectionStart !== -1) {
    for (let i = practicalSectionStart + 1; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].toLowerCase().includes('question') && !lines[i].includes('pierrearnouxdmr@gmail.com') && !lines[i].toLowerCase().includes('paula in pierre') && !lines[i].toLowerCase().includes('paula & pierre') && !lines[i].includes('mai 2026')) {
        practicalInfo.push(lines[i]);
      }
    }
  }
  
  // Extraire les informations de contact et instructions
  const questionsStart = lines.findIndex(line => line.toLowerCase().includes('question') || line.toLowerCase().includes('vprašanja'));
  let contactInfo = [];
  if (questionsStart !== -1) {
    for (let i = questionsStart; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].toLowerCase().includes('paula in pierre') && !lines[i].toLowerCase().includes('paula & pierre') && !lines[i].includes('mai 2026')) {
        contactInfo.push(lines[i]);
      }
    }
  }
  
  // Statuts de présence
  const ceremonyStatus = data.ceremony === 'oui';
  const receptionStatus = data.reception === 'oui';
  
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: rgb(223, 224, 225); padding: 20px;">
    <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="background: #a8998a; background: linear-gradient(135deg, #a8998a, #8b7d6b); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-family: 'Cormorant Garamond', Georgia, serif; color: white !important; font-size: 28px;">${greeting}</h1>
        <p style="margin: 10px 0 0 0; color: white !important; font-size: 16px;">${lines[1] || ''}</p>
      </div>
      
      <div style="padding: 40px 30px;">
        ${(ceremonyStatus || receptionStatus) && lines[2] ? `
        <div style="background: #f8f7f6; padding: 25px; border-left: 4px solid #a8998a; margin: 0 0 25px 0; border-radius: 5px;">
          <p style="margin: 0; color: #333; font-weight: 600;">${lines[2]}</p>
        </div>` : ''}

        <div style="background: #f0ede9; border: 2px solid #d6d0c8; border-radius: 8px; padding: 25px; margin: 0 0 25px 0;">
          <h3 style="margin: 0 0 20px 0; color: #6b5d54; text-transform: uppercase; letter-spacing: 1px;">${lines.find(l => l.toLowerCase().includes('rappel') || l.toLowerCase().includes('opomnik')) || 'RAPPEL DES ÉVÉNEMENTS'}</h3>
          
          ${ceremonyDetails ? `
          <div style="margin: 0 0 20px 0; padding: 15px; background: white; border-radius: 5px; border-left: 3px solid #a8998a;">
            <div style="margin: 0; color: #333; line-height: 1.4;">${ceremonyDetails}</div>
          </div>` : ''}
          
          ${receptionDetails ? `
          <div style="margin: 0; padding: 15px; background: white; border-radius: 5px; border-left: 3px solid #a8998a;">
            <div style="margin: 0; color: #333; line-height: 1.4;">${receptionDetails}</div>
          </div>` : ''}
        </div>

        ${practicalInfo.length > 0 ? `
        <h3 style="margin: 0 0 15px 0; color: #6b5d54; text-transform: uppercase; letter-spacing: 1px;">${lines.find(l => l.toLowerCase().includes('pratique') || l.toLowerCase().includes('praktične')) || 'INFORMATIONS PRATIQUES'}</h3>
        <div style="line-height: 1.8; color: #333; margin: 0 0 25px 0;">
          ${practicalInfo.map(info => `<div style="margin: 5px 0;">${info}</div>`).join('')}
        </div>` : ''}

        <div style="background: #f8f7f6; padding: 20px; border-left: 4px solid #a8998a; margin: 25px 0 0 0; border-radius: 5px;">
          <div style="margin: 0; color: #333; line-height: 1.6;">
            ${contactInfo.join('<br>')}
          </div>
        </div>
      </div>

      <div style="background: #f8f7f6; padding: 30px; text-align: center; color: #8a7d74; border-top: 1px solid #e8e6e3;">
        <p style="margin: 0 0 5px 0; font-weight: 600; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px;">Paula & Pierre</p>
        <p style="margin: 0; font-size: 14px;">2 mai 2026</p>
      </div>
    </div>
  </div>`;
}


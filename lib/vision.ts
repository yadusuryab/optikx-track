/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/vision-ocrspace.ts - Using OCR.space Free API

// ✅ Interface now includes all fields
export interface ExtractedData {
  name?: string;
  phoneNumber?: string;
  address?: string;
  trackingId?: string;
  courier?: string;
  trackingUrl?: string;
  otherText?: string;
  rawText: string;
}

async function callOCRSpaceAPI(base64Image: string): Promise<any> {
  const apiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';
  
  const formData = new URLSearchParams();
  formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
  formData.append('apikey', apiKey);
  formData.append('language', 'eng');
  formData.append('isOverlayRequired', 'false');
  formData.append('OCREngine', '2');
  formData.append('scale', 'true');
  formData.append('isTable', 'true');

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OCR.space API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  if (result.IsErroredOnProcessing) {
    throw new Error(result.ErrorMessage[0] || 'OCR.space processing failed');
  }

  return result;
}

// ── Courier detection ──────────────────────────────────────────────────────
const COURIER_PATTERNS: {
  name: string;
  textMatches: RegExp[];
  trackingPrefix?: RegExp;
  trackingUrl: (id: string) => string;
}[] = [
  {
    name: 'DTDC',
    textMatches: [/\bdtdc\b/i],
    trackingPrefix: /^[RZD]\d{7,}/i,
    trackingUrl: (id) => `https://www.dtdc.in/tracking.asp?podNo=${id}`,
  },
  {
    name: 'BlueDart',
    textMatches: [/blue\s*dart/i],
    trackingPrefix: /^\d{9,11}$/,
    trackingUrl: (id) => `https://www.bluedart.com/tracking?trackfor=${id}`,
  },
  {
    name: 'Delhivery',
    textMatches: [/delhivery/i],
    trackingPrefix: /^\d{12,18}$/,
    trackingUrl: (id) => `https://www.delhivery.com/track/package/${id}`,
  },
  {
    name: 'Ekart',
    textMatches: [/ekart/i, /flipkart/i],
    trackingPrefix: /^FMPP\d+/i,
    trackingUrl: (id) => `https://ekartlogistics.com/track?trackingId=${id}`,
  },
  {
    name: 'XpressBees',
    textMatches: [/xpress\s*bees/i],
    trackingPrefix: /^\d{12}$/,
    trackingUrl: (id) => `https://www.xpressbees.com/shipment/tracking?awbNo=${id}`,
  },
  {
    name: 'Ecom Express',
    textMatches: [/ecom\s*express/i],
    trackingPrefix: /^[A-Z]{3}\d{10}/i,
    trackingUrl: (id) => `https://ecomexpress.in/tracking/?awb_field=${id}`,
  },
  {
    name: 'Shadowfax',
    textMatches: [/shadowfax/i],
    trackingPrefix: /^SF\d+/i,
    trackingUrl: (id) => `https://tracker.shadowfax.in/?order_number=${id}`,
  },
  {
    name: 'Amazon',
    textMatches: [/amazon\s*logistics/i, /\bamazon\b/i],
    trackingPrefix: /^TBA\d+/i,
    trackingUrl: (id) => `https://track.amazon.in/tracking/${id}`,
  },
  {
    name: 'India Post',
    textMatches: [/india\s*post/i, /speed\s*post/i],
    trackingPrefix: /^[A-Z]{2}\d{9}IN$/i,
    trackingUrl: (id) => `https://www.indiapost.gov.in/vas/Pages/IndiaPostHome.aspx?q=${id}`,
  },
];

function detectCourier(rawText: string, trackingId: string): {
  courier: string;
  trackingUrl: string;
} {
  for (const c of COURIER_PATTERNS) {
    const textMatch = c.textMatches.some(p => p.test(rawText));
    const prefixMatch = c.trackingPrefix ? c.trackingPrefix.test(trackingId) : false;

    if (textMatch || prefixMatch) {
      return {
        courier: c.name,
        trackingUrl: c.trackingUrl(trackingId),
      };
    }
  }

  // Fallback — Google search
  return {
    courier: '',
    trackingUrl: `https://www.google.com/search?q=${encodeURIComponent(trackingId + ' tracking')}`,
  };
}

// ── Main parse function ────────────────────────────────────────────────────
function parseExtractedData(rawText: string): ExtractedData {
  if (!rawText || rawText.trim().length === 0) {
    return { rawText: '' };
  }

  console.log('Parsing extracted text, length:', rawText.length);

  const lines = rawText.split('\n').filter(line => line.trim().length > 0);

  // ✅ Typed as ExtractedData from the start — no more `any` casting
  const extractedData: ExtractedData = { rawText };

  // ── 1. Tracking ID ───────────────────────────────────────────────────────
  const trackingPattern = /\b([A-Z]{1,3}\d{7,})\b/g;
  const trackingMatches = rawText.match(trackingPattern);
  if (trackingMatches && trackingMatches.length > 0) {
    extractedData.trackingId = trackingMatches[0];
    console.log('Extracted tracking ID:', extractedData.trackingId);

    const { courier, trackingUrl } = detectCourier(rawText, extractedData.trackingId);
    extractedData.courier = courier;
    extractedData.trackingUrl = trackingUrl;
    console.log('Detected courier:', courier);
  }

  // ── 2. Phone number ──────────────────────────────────────────────────────
  const indianPhonePattern = /(?<![A-Z0-9])(\+91[\s-]?|0)?[6-9]\d{9}(?!\d)/g;
  const trackingLinePattern = /\b[A-Z]{1,3}\d{7,}\b/g;

  const phoneMatches: string[] = [];
  for (const line of lines) {
    trackingLinePattern.lastIndex = 0;
    if (trackingLinePattern.test(line)) {
      console.log('Skipping tracking number line:', line);
      continue;
    }

    const cleanLine = line.replace(/ph[:\s]*/i, '').replace(/phone[:\s]*/i, '').trim();
    const matches = cleanLine.match(indianPhonePattern);
    if (matches) {
      phoneMatches.push(...matches.map(m => m.replace(/[\s-]/g, '')));
    }
  }

  if (phoneMatches.length > 0) {
    extractedData.phoneNumber = phoneMatches[phoneMatches.length - 1];
    console.log('Extracted phone number:', extractedData.phoneNumber);
  }

  // ── 3. Email ─────────────────────────────────────────────────────────────
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = rawText.match(emailPattern);
  if (emailMatches && emailMatches.length > 0) {
    extractedData.otherText = `Emails: ${emailMatches.join(', ')}\n`;
  }

  // ── 4. Name ──────────────────────────────────────────────────────────────
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    const words = line.split(/\s+/);

    if (words.length >= 2 && words.length <= 4) {
      const hasUpperCase = words.some(word => /^[A-Z][a-z]*$/.test(word));
      const hasDigits = /\d/.test(line);

      if (hasUpperCase && !hasDigits) {
        extractedData.name = line;
        console.log('Name found:', extractedData.name);
        break;
      }
    }
  }

  // ── 5. Address ───────────────────────────────────────────────────────────
  const addressIndicators = [
    /\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|court|ct|way|highway|hwy)/i,
    /(?:p\.?o\.?\s+box|post\s+office\s+box)/i,
    /[A-Za-z\s]+,\s*[A-Z]{2}\s+\d{5}(-\d{4})?/,
    /\d+\s+[A-Za-z\s]+\s+(?:apt|apartment|unit|suite|ste|#)\s*\w+/i,
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (addressIndicators.some(p => p.test(trimmedLine))) {
      extractedData.address = trimmedLine;
      console.log('Address found:', extractedData.address);
      break;
    }
  }

  // Fallback address
  if (!extractedData.address) {
    for (const line of lines) {
      const trimmedLine = line.trim();
      const wordCount = trimmedLine.split(/\s+/).length;
      if (wordCount >= 3 && wordCount <= 8 && /\d/.test(trimmedLine) && trimmedLine.length > 15) {
        extractedData.address = trimmedLine;
        console.log('Fallback address found:', extractedData.address);
        break;
      }
    }
  }

  // ── 6. Other text ────────────────────────────────────────────────────────
  const otherLines = lines.filter(line => {
    const t = line.trim();
    return t !== extractedData.name &&
           t !== extractedData.phoneNumber &&
           t !== extractedData.address &&
           t.length > 3;
  });

  if (otherLines.length > 0) {
    extractedData.otherText = (extractedData.otherText || '') + otherLines.join('\n');
  }

  console.log('Final extracted data:', {
    hasName: !!extractedData.name,
    hasPhone: !!extractedData.phoneNumber,
    hasAddress: !!extractedData.address,
    hasTrackingId: !!extractedData.trackingId,
    courier: extractedData.courier,
  });

  return extractedData;
}

// ── Exported functions (unchanged signatures) ─────────────────────────────
export async function extractTextFromImage(imageBuffer: Buffer | string): Promise<ExtractedData> {
  try {
    console.log('Starting text extraction from image with OCR.space...');

    let imageContent: string;
    if (typeof imageBuffer === 'string') {
      imageContent = imageBuffer.startsWith('data:')
        ? imageBuffer.split(',')[1] ?? (() => { throw new Error('Invalid base64 data URI'); })()
        : imageBuffer;
    } else {
      imageContent = imageBuffer.toString('base64');
    }

    const result = await callOCRSpaceAPI(imageContent);
    const parsedResults = result.ParsedResults;
    let rawText = '';

    if (parsedResults?.length > 0) {
      rawText = (parsedResults[0].ParsedText || '').replace(/\r\n/g, '\n').trim();
      console.log('Raw text extracted, length:', rawText.length);
    }

    return parseExtractedData(rawText);
  } catch (error: any) {
    console.error('Error extracting text:', error.message);
    return { rawText: '' };
  }
}

export async function detectDocumentType(imageBuffer: Buffer | string): Promise<string> {
  try {
    let imageContent: string;
    if (typeof imageBuffer === 'string') {
      imageContent = imageBuffer.startsWith('data:') ? imageBuffer.split(',')[1] || '' : imageBuffer;
    } else {
      imageContent = imageBuffer.toString('base64');
    }

    const result = await callOCRSpaceAPI(imageContent);
    const text = (result.ParsedResults?.[0]?.ParsedText || '').toLowerCase();

    if (text.includes('invoice')) return 'invoice';
    if (text.includes('receipt')) return 'receipt';
    if (text.includes('business card')) return 'business_card';
    if (text.includes('license')) return 'license';
    if (text.includes('contract')) return 'contract';
    if (text.includes('resume')) return 'resume';
    if (text.includes('prescription')) return 'prescription';
    if (text.includes('medical')) return 'medical';
    if (text.includes('bill')) return 'bill';
    return 'general';
  } catch (error: any) {
    console.error('Error detecting document type:', error.message);
    return 'general';
  }
}

export async function extractTextWithOCRSpaceAdvanced(imageBuffer: Buffer | string): Promise<ExtractedData> {
  try {
    let imageContent: string;
    if (typeof imageBuffer === 'string') {
      imageContent = imageBuffer.startsWith('data:') ? imageBuffer.split(',')[1] || '' : imageBuffer;
    } else {
      imageContent = imageBuffer.toString('base64');
    }

    const engines = [1, 2];
    let bestRawText = '';

    for (const engine of engines) {
      try {
        const formData = new URLSearchParams();
        formData.append('base64Image', `data:image/jpeg;base64,${imageContent}`);
        formData.append('apikey', process.env.OCR_SPACE_API_KEY || 'helloworld');
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', engine.toString());

        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const text = result.ParsedResults?.[0]?.ParsedText?.replace(/\r\n/g, '\n').trim() || '';
          if (text.length > bestRawText.length) bestRawText = text;
        }
      } catch (e) {
        console.warn(`OCR Engine ${engine} failed:`, e);
      }
    }

    return parseExtractedData(bestRawText);
  } catch (error: any) {
    console.error('Error in advanced OCR extraction:', error.message);
    return { rawText: '' };
  }
}
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Shared Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Lab Legal Analysis Endpoint
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const {
        prompt,
        model = 'gemini-3.8-flash',
        systemInstruction = 'أنت مساعد قانوني متخصص في قانون العمل العُماني (Royal Decree 53/2023). أجب بالعربية مع الاستشهاد بالمواد (37، 55، 58، 66، 114، 120).',
        fileData,
        mimeType
      } = req.body;

      const parts: any[] = [];
      if (fileData && mimeType) {
        parts.push({
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        });
      }
      parts.push({ text: prompt || 'قم بتحليل النزاع العمالي ومستندات الدعوى وفق قانون العمل العماني.' });

      const response = await ai.models.generateContent({
        model: model,
        contents: { parts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('AI Lab API Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to generate legal analysis'
      });
    }
  });

  // Dedicated Legal Research & Judgment Study Lab Endpoint
  app.post('/api/ai/research-document', async (req, res) => {
    try {
      const {
        fileData,
        mimeType = 'application/pdf',
        fileName = 'legal_document.pdf',
        studyType = 'comprehensive_study',
        customNotes = '',
        language = 'ar'
      } = req.body;

      const systemInstruction = `You are a Senior Judicial Research Expert, Forensic Legal Auditor, and Omani Labour Law Specialist (Royal Decree No. 53/2023). You specialize in evaluating court judgments, legal submissions, bank WPS statements, absconding reports, handwritten ledgers, and employer notices in the Sultanate of Oman.

Case Background:
- Plaintiff: Habibur Rahman Abdul Barak (Maruf), Civil ID: 103352388, 11 continuous years (July 2015 – Sept 2026), Actual Barka Branch Manager (visa mismatch: Waiter/Loader).
- Defendant: Al Yarmook Modern Trading LLC (CR: 1834525).
- Courts: Seeb Primary Court (Case CTR2601-3344) & Barka Primary Court (Case 1005/1215/2026).
- Statutory Claims: 7,642 OMR (EOSB 2,125 OMR, COVID Arrears 3,000 OMR, Arbitrary Deductions 1,417 OMR, Accrued Leave 1,100 OMR).
- Statutory Violations: WPS salary mismatch (250 OMR WPS vs 60 OMR contract), passport retention 11 years (RD 53/2023 Art. 6), malicious absconding report DCA-20260802114 filed after formal labor dispute (violating Art. 114), third-party loan contamination (Nazar diary inserting Shah Jahan 300 OMR & Hafez 100 OMR into Maruf account).

Task & Instructions:
1. Conduct an authoritative forensic and statutory research study on the provided document/file/judgment.
2. Structure your study into clear sections:
   - 📑 ملخص الوثيقة والبيانات الأساسية (Document Summary & Identification)
   - 🔍 التحليل الجنائي والقانوني المفصل (Detailed Forensic & Legal Breakdown)
   - ⚖️ السند القانوني من قانون العمل العماني (RD 53/2023 Articles: 6, 37, 53-59, 114, 120, MD 729/2024)
   - ⚠️ التناقضات وتلوث السجلات وعناصر التزوير (Discrepancies, Tampering, Contamination & Fraud Risks)
   - 💼 التوصيات العملية ودفوع مذكرة المحكمة الابتدائية (Actionable Court Defense & Judicial Recommendations)
   - 🎯 نقاط استجواب الخصم أمام القاضي (Cross-Examination Points for the Judge)
3. If language is 'bn', deliver the study in Bengali with Arabic statutory terms in parentheses. If 'ar', deliver in polished Arabic judicial terminology. If 'en', deliver in authoritative legal English.`;

      const parts: any[] = [];
      if (fileData && mimeType) {
        parts.push({
          inlineData: {
            data: fileData,
            mimeType: mimeType
          }
        });
      }

      const promptText = `Conduct a ${studyType} research study on this document ("${fileName}").
User Custom Notes / Specific Questions: ${customNotes || 'Provide a thorough legal and evidentiary study for submission to the Omani courts.'}
Target Language: ${language}.
Focus specifically on its evidentiary value, authenticity, statutory basis under Oman Royal Decree 53/2023, and how it strengthens Habibur Rahman (Maruf)'s 7,642 OMR claim.`;

      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.25,
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web?.title || 'Oman Legal Reference',
          uri: chunk.web?.uri || ''
        }));

      res.json({
        text,
        sources,
        studyType,
        fileName
      });
    } catch (error: any) {
      console.error('Document Research Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to conduct legal research study on the document'
      });
    }
  });

  // Audio Transcription Endpoint using gemini-3.5-transcribe
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const { audioData, mimeType = 'audio/webm', languageHint } = req.body;
      if (!audioData) {
        return res.status(400).json({ error: 'Audio data is required' });
      }

      const promptText = languageHint
        ? `Transcribe this audio recording verbatim. Spoken context: ${languageHint}. Provide the clean transcription without conversational preamble.`
        : 'Transcribe this audio recording verbatim and accurately in its spoken language (Arabic, Bengali, or English). Provide the clean transcription without conversational preamble.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                data: audioData,
                mimeType: mimeType
              }
            },
            {
              text: promptText
            }
          ]
        }
      });

      res.json({ text: response.text || '' });
    } catch (error: any) {
      console.error('Audio Transcription Error (gemini-3.5-transcribe):', error);
      res.status(500).json({
        error: error.message || 'Failed to transcribe audio using gemini-3.5-transcribe'
      });
    }
  });

  // Oman Labour Law AI Advisor with Google Search Grounding (RD 53/2023)
  app.post('/api/ai/oman-law-advisor', async (req, res) => {
    try {
      const { scenario, scenarioType, language = 'ar' } = req.body;
      if (!scenario) {
        return res.status(400).json({ error: 'Scenario description is required' });
      }

      const systemInstruction = `You are a certified Senior Omani Labour Law Expert and Judicial Advisor specializing in Oman Labour Law promulgated by Royal Decree No. 53/2023, along with all recent Ministerial Decisions (e.g. MD 729/2024 on Wage Protection System, Ministerial Decisions on Omanisation, non-compete clauses, end-of-service gratuity calculations, sick leaves, and unlawful termination).

Your role:
1. Provide accurate, real-time legal interpretations and statutory advice grounded in Royal Decree 53/2023 and the latest official Omani Ministry of Labour regulations.
2. Specifically cite the exact articles of Royal Decree 53/2023 (e.g., Article 6 on passport retention & fines of 500-1000 OMR, Article 37 on EOSB calculation, Articles 53-59 on wages & maximum deduction caps of 15%-25%, Article 66 on sick leaves, Article 114 on protection during labour disputes, Article 120 on exemption from court fees, MD 729/2024 for 3-day WPS compliance).
3. If the user prompts in Arabic, answer in professional, authoritative Arabic. If in Bengali, provide Bengali with Arabic statutory terms. If in English, provide authoritative English.
4. Structure your response into:
   - 📌 الملخص التنفيذي والحكم القانوني (Executive Legal Finding)
   - ⚖️ المواد القانونية الواجبة التطبيق من المرسوم السلطاني 53/2023 (Applicable Statutory Articles)
   - 🔍 التحديثات والقرارات الوزارية الحديثة والبحث الفوري (Real-Time Search & Ministerial Decisions)
   - 💼 خطوات عملية للمحكمة أو وزارة العمل (Practical Court / Ministry of Labour Action Steps)
   - ⚠️ تحذيرات ومخاطر قانونية (Legal Pitfalls & Warnings).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Legal Scenario / Query: "${scenario}". Scenario Category: ${scenarioType || 'General Labour Dispute'}. Provide a thorough legal opinion referencing Oman Royal Decree 53/2023 and recent official ministerial decisions.`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      // Extract verified sources from Search Grounding
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web?.title || 'Oman Labour Regulation Reference',
          uri: chunk.web?.uri || '',
        }));

      res.json({
        text,
        sources,
        searchQueries,
      });
    } catch (error: any) {
      console.error('Oman Law Advisor Error:', error);
      res.status(500).json({
        error: error.message || 'Failed to consult Oman Labour Law AI Advisor',
      });
    }
  });

  // Serve static single-file standalone HTML if requested directly
  app.get('/marufedge-forensic-lab.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'marufedge-forensic-lab.html'));
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

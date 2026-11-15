const { z } = require('zod');
const xss = require('xss');
const mongoose = require('mongoose');

// Helper to sanitize any string field
const sanitizeText = (str) => {
  if (typeof str !== 'string') return str;
  return xss(str.trim(), {
    whiteList: {}, // Empty whitelist removes all HTML tags
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
};

// Zod Schema for Login
const loginSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username cannot exceed 50 characters')
      .transform(sanitizeText),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
  })
  .strict(); // Reject unknown fields

// Zod Schema for Event
const eventSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters')
      .transform(sanitizeText),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Valid date string is required (YYYY-MM-DD or ISO 8601)',
      }),
    time: z
      .string()
      .min(1, 'Time is required')
      .max(50, 'Time cannot exceed 50 characters')
      .transform(sanitizeText),
    venue: z
      .string()
      .min(2, 'Venue must be at least 2 characters')
      .max(200, 'Venue cannot exceed 200 characters')
      .transform(sanitizeText),
    description: z
      .string()
      .min(5, 'Description must be at least 5 characters')
      .max(5000, 'Description cannot exceed 5000 characters')
      .transform(sanitizeText),
  })
  .strict();

// Schema for updating Event (all fields optional)
const eventUpdateSchema = eventSchema.partial();

// Zod Schema for Notice
const noticeSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title cannot exceed 200 characters')
      .transform(sanitizeText),
    message: z
      .string()
      .min(5, 'Message must be at least 5 characters')
      .max(5000, 'Message cannot exceed 5000 characters')
      .transform(sanitizeText),
    isPinned: z.preprocess((val) => {
      if (typeof val === 'string') return val === 'true' || val === '1';
      return Boolean(val);
    }, z.boolean().default(false)),
    expiryDate: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: 'Expiry date must be a valid date or null' }
      ),
  })
  .strict();

const noticeUpdateSchema = noticeSchema.partial();

// Zod Schema for Prayers (Japamala and Kurisinte Vazhi)
const prayerSchema = z
  .object({
    type: z.enum(['japamala', 'kurisinte-vazhi']),
    title: z.string().min(2, 'Title must be at least 2 characters').max(250).transform(sanitizeText),
    titleMl: z.string().max(250).transform(sanitizeText).optional().default(''),
    body: z.string().min(3, 'Body must be at least 3 characters').max(10000).transform(sanitizeText),
    order: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    }, z.number().int()).default(0),
  })
  .strict();

const prayerUpdateSchema = prayerSchema.partial();

// Zod Schema for Timings
const timingSchema = z
  .object({
    type: z.enum(['japamala', 'kurisinte-vazhi']),
    text: z.string().min(2, 'Timings text must be at least 2 characters').max(2000).transform(sanitizeText),
  })
  .strict();

// Zod Schema for Settings
const settingSchema = z
  .object({
    churchName: z.string().min(2).max(200).transform(sanitizeText).optional(),
    churchNameMalayalam: z.string().min(2).max(200).transform(sanitizeText).optional(),
    address: z.string().min(5).max(500).transform(sanitizeText).optional(),
    phone: z.string().min(5).max(100).transform(sanitizeText).optional(),
    email: z.string().email().max(100).optional(),
    historyText: z.string().min(10).max(5000).transform(sanitizeText).optional(),
    historyTextMalayalam: z.string().min(10).max(5000).transform(sanitizeText).optional(),
    mapEmbedUrl: z.string().url().max(1000).optional(),
    massTimings: z
      .array(
        z.object({
          day: z.string().min(2).max(50).transform(sanitizeText),
          time: z.string().min(2).max(50).transform(sanitizeText),
          description: z.string().max(200).transform(sanitizeText).optional().default(''),
        })
      )
      .optional(),
  })
  .strict();

// Middleware generator for Zod schemas
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return res.status(400).json({
        error: 'Validation failed',
        details: errorMessages,
      });
    }
    next(error);
  }
};

// Validate MongoDB ObjectId in params
const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `Invalid ${paramName} parameter. Must be a valid 24-character hexadecimal ID.` });
  }
  next();
};

module.exports = {
  validate,
  validateObjectId,
  loginSchema,
  eventSchema,
  eventUpdateSchema,
  noticeSchema,
  noticeUpdateSchema,
  settingSchema,
  prayerSchema,
  prayerUpdateSchema,
  timingSchema,
  sanitizeText,
};

import type { ConversationContext, ConversationState } from "./types";

export interface ProcessMessageResult {
  newState: ConversationState;
  newContext: ConversationContext;
  replyText: string;
}

const SERVICE_PATTERNS: Array<{ service: string; patterns: RegExp[] }> = [
  {
    service: "haircut",
    patterns: [/\bhair\s?cut\b/i, /\bcut\b/i, /\btrim hair\b/i],
  },
  {
    service: "beard trim",
    patterns: [/\bbeard\b/i, /\bbeard trim\b/i, /\bshave\b/i],
  },
  {
    service: "color",
    patterns: [/\bcolor\b/i, /\bcolour\b/i, /\bdye\b/i],
  },
];

const WEEKDAYS: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  tues: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  thurs: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
};

const SLOT_SETS: string[][] = [
  ["10:00", "12:30", "14:00", "16:30"],
  ["09:30", "11:00", "13:30", "15:00"],
  ["10:30", "12:00", "14:30", "17:00"],
  ["09:00", "11:30", "14:00", "18:00"],
];

function normalize(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

function dateAtMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function parseService(message: string): string | null {
  for (const { service, patterns } of SERVICE_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(message))) {
      return service;
    }
  }
  return null;
}

function parseWeekday(normalizedMessage: string, now: Date): Date | null {
  for (const [key, weekdayIndex] of Object.entries(WEEKDAYS)) {
    const pattern = new RegExp(`\\b${key}\\b`, "i");
    if (!pattern.test(normalizedMessage)) {
      continue;
    }

    const todayIndex = now.getDay();
    let diff = weekdayIndex - todayIndex;
    if (diff < 0) {
      diff += 7;
    }
    return addDays(dateAtMidnight(now), diff);
  }
  return null;
}

function parseIsoDate(normalizedMessage: string): Date | null {
  const isoMatch = normalizedMessage.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (!isoMatch) {
    return null;
  }

  const year = Number(isoMatch[1]);
  const month = Number(isoMatch[2]);
  const day = Number(isoMatch[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function parseSlashDate(normalizedMessage: string, now: Date): Date | null {
  const slashMatch = normalizedMessage.match(
    /\b(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?\b/,
  );
  if (!slashMatch) {
    return null;
  }

  const month = Number(slashMatch[1]);
  const day = Number(slashMatch[2]);
  let year = slashMatch[3] ? Number(slashMatch[3]) : now.getFullYear();

  if (year < 100) {
    year += 2000;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function parseDayChoice(
  message: string,
  referenceDate: Date = new Date(),
): { isoDate: string; label: string } | null {
  const normalizedMessage = normalize(message);
  const now = dateAtMidnight(referenceDate);

  if (normalizedMessage.includes("today")) {
    return { isoDate: formatDateOnly(now), label: formatDayLabel(now) };
  }

  if (normalizedMessage.includes("tomorrow")) {
    const tomorrow = addDays(now, 1);
    return { isoDate: formatDateOnly(tomorrow), label: formatDayLabel(tomorrow) };
  }

  const isoDate = parseIsoDate(normalizedMessage);
  if (isoDate) {
    return { isoDate: formatDateOnly(isoDate), label: formatDayLabel(isoDate) };
  }

  const slashDate = parseSlashDate(normalizedMessage, now);
  if (slashDate) {
    return { isoDate: formatDateOnly(slashDate), label: formatDayLabel(slashDate) };
  }

  const weekdayDate = parseWeekday(normalizedMessage, now);
  if (weekdayDate) {
    return {
      isoDate: formatDateOnly(weekdayDate),
      label: formatDayLabel(weekdayDate),
    };
  }

  return null;
}

function generateMockSlots(isoDate: string): Record<string, string> {
  const daySeed = Number(isoDate.replace(/-/g, "")) || 0;
  const slots = SLOT_SETS[daySeed % SLOT_SETS.length];
  const count = 3 + (daySeed % 2);
  const selectedSlots = slots.slice(0, count);

  return selectedSlots.reduce<Record<string, string>>((acc, slot, index) => {
    const key = String(index + 1);
    acc[key] = slot;
    return acc;
  }, {});
}

function normalizeTo24Hour(timeInput: string): string | null {
  const trimmed = normalize(timeInput);
  const match = trimmed.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const period = match[3]?.toLowerCase();

  if (!Number.isInteger(hour) || !Number.isInteger(minute) || minute > 59) {
    return null;
  }

  if (period) {
    if (hour < 1 || hour > 12) {
      return null;
    }
    if (period === "pm" && hour !== 12) {
      hour += 12;
    }
    if (period === "am" && hour === 12) {
      hour = 0;
    }
  } else if (hour > 23) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseTimeChoice(
  message: string,
  availableSlots: Record<string, string> | undefined,
): string | null {
  if (!availableSlots) {
    return null;
  }

  const normalized = normalize(message);
  const exactOption = normalized.match(/^(?:option\s*)?([1-9]\d*)$/i);
  if (exactOption) {
    const optionKey = exactOption[1];
    return availableSlots[optionKey] ?? null;
  }

  const optionInText = normalized.match(/\boption\s*([1-9]\d*)\b/i);
  if (optionInText) {
    const optionKey = optionInText[1];
    if (availableSlots[optionKey]) {
      return availableSlots[optionKey];
    }
  }

  const parsedTime = normalizeTo24Hour(message);
  if (!parsedTime) {
    return null;
  }

  const slotValues = Object.values(availableSlots).map((slot) => normalizeTo24Hour(slot));
  const matchedIndex = slotValues.findIndex((slot) => slot === parsedTime);
  if (matchedIndex === -1) {
    return null;
  }

  const matchedSlot = Object.values(availableSlots)[matchedIndex];
  return matchedSlot ?? null;
}

function formatSlotsForReply(availableSlots: Record<string, string>): string {
  return Object.entries(availableSlots)
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");
}

function sanitizeName(message: string): string | null {
  const name = message.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    return null;
  }
  return name;
}

export function buildAppointmentStartTime(
  context: ConversationContext,
): string | null {
  if (!context.dayChoice || !context.timeChoice) {
    return null;
  }

  const dayMatch = context.dayChoice.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = context.timeChoice.match(/^(\d{2}):(\d{2})$/);

  if (!dayMatch || !timeMatch) {
    return null;
  }

  const year = Number(dayMatch[1]);
  const month = Number(dayMatch[2]);
  const day = Number(dayMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export function processMessage(
  currentState: ConversationState,
  currentContext: ConversationContext,
  userMessage: string,
): ProcessMessageResult {
  const message = userMessage.trim();
  const context: ConversationContext = { ...currentContext };

  if (currentState === "NEW") {
    return {
      newState: "WAIT_SERVICE",
      newContext: context,
      replyText:
        "Welcome to Barber Pro. What service would you like?\n- Haircut\n- Beard trim\n- Color",
    };
  }

  if (currentState === "WAIT_SERVICE") {
    const service = parseService(message);
    if (!service) {
      return {
        newState: "WAIT_SERVICE",
        newContext: context,
        replyText:
          "Please choose one of these services: haircut, beard trim, or color.",
      };
    }

    return {
      newState: "WAIT_DAY",
      newContext: {
        ...context,
        service,
        dayChoice: undefined,
        dayLabel: undefined,
        timeChoice: undefined,
        availableSlots: undefined,
      },
      replyText:
        "Great. What day do you prefer? (Example: tomorrow, Monday, or 2026-02-12)",
    };
  }

  if (currentState === "WAIT_DAY") {
    const parsedDay = parseDayChoice(message);
    if (!parsedDay) {
      return {
        newState: "WAIT_DAY",
        newContext: context,
        replyText:
          "I couldn't read that day. Please send a weekday, 'tomorrow', or a date like 2026-02-12.",
      };
    }

    const availableSlots = generateMockSlots(parsedDay.isoDate);
    return {
      newState: "WAIT_TIME",
      newContext: {
        ...context,
        dayChoice: parsedDay.isoDate,
        dayLabel: parsedDay.label,
        timeChoice: undefined,
        availableSlots,
      },
      replyText: `Available times for ${parsedDay.label}:\n${formatSlotsForReply(
        availableSlots,
      )}\nReply with a number (for example, 1) or a time (for example, 10:00 AM).`,
    };
  }

  if (currentState === "WAIT_TIME") {
    const selectedTime = parseTimeChoice(message, context.availableSlots);
    if (!selectedTime) {
      const slots = context.availableSlots ? formatSlotsForReply(context.availableSlots) : "";
      return {
        newState: "WAIT_TIME",
        newContext: context,
        replyText: `Please choose a valid time from the options:\n${slots}`,
      };
    }

    return {
      newState: "WAIT_NAME",
      newContext: {
        ...context,
        timeChoice: selectedTime,
      },
      replyText: "Perfect. What's your full name for the booking?",
    };
  }

  if (currentState === "WAIT_NAME") {
    const customerName = sanitizeName(message);
    if (!customerName) {
      return {
        newState: "WAIT_NAME",
        newContext: context,
        replyText: "Please send a valid name (at least 2 characters).",
      };
    }

    const nextContext: ConversationContext = {
      ...context,
      customerName,
    };

    return {
      newState: "CONFIRMED",
      newContext: nextContext,
      replyText: `Thanks ${customerName}. Your ${nextContext.service ?? "service"} is booked for ${
        nextContext.dayChoice ?? "your selected day"
      } at ${nextContext.timeChoice ?? "your selected time"}. Reply anytime to start a new booking.`,
    };
  }

  return {
    newState: "WAIT_SERVICE",
    newContext: {},
    replyText:
      "If you'd like another booking, tell me the service: haircut, beard trim, or color.",
  };
}

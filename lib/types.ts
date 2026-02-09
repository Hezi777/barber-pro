export type ConversationState =
  | "NEW"
  | "WAIT_SERVICE"
  | "WAIT_DAY"
  | "WAIT_TIME"
  | "WAIT_NAME"
  | "CONFIRMED";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export type MessageDirection = "IN" | "OUT";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface ConversationContext {
  service?: string;
  dayChoice?: string;
  dayLabel?: string;
  timeChoice?: string;
  customerName?: string;
  availableSlots?: Record<string, string>;
}

export interface WhatsAppWebhookRequest {
  from: string;
  body: string;
  timestamp?: string;
  provider?: string;
  raw?: Json;
}

export interface WhatsAppWebhookResponse {
  ok: boolean;
  replyText?: string;
  error?: string;
  details?: unknown;
}

export interface CustomerRow {
  id: string;
  phone: string;
  name: string | null;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  phone: string;
  state: ConversationState;
  context: ConversationContext;
  updated_at: string;
}

export interface AppointmentRow {
  id: string;
  phone: string;
  customer_name: string;
  service: string;
  start_time: string;
  status: AppointmentStatus;
  created_at: string;
}

export interface MessageRow {
  id: string;
  phone: string;
  direction: MessageDirection;
  body: string | null;
  raw_payload: Json | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: CustomerRow & Record<string, unknown>;
        Insert: Record<string, unknown> & {
          id?: string;
          phone: string;
          name?: string | null;
          created_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          phone?: string;
          name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: ConversationRow & Record<string, unknown>;
        Insert: Record<string, unknown> & {
          id?: string;
          phone: string;
          state?: ConversationState;
          context?: ConversationContext;
          updated_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          phone?: string;
          state?: ConversationState;
          context?: ConversationContext;
          updated_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: AppointmentRow & Record<string, unknown>;
        Insert: Record<string, unknown> & {
          id?: string;
          phone: string;
          customer_name: string;
          service: string;
          start_time: string;
          status?: AppointmentStatus;
          created_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          phone?: string;
          customer_name?: string;
          service?: string;
          start_time?: string;
          status?: AppointmentStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: MessageRow & Record<string, unknown>;
        Insert: Record<string, unknown> & {
          id?: string;
          phone: string;
          direction: MessageDirection;
          body?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
        };
        Update: Record<string, unknown> & {
          id?: string;
          phone?: string;
          direction?: MessageDirection;
          body?: string | null;
          raw_payload?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

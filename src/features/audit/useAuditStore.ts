import { create } from "zustand";
import { AuditEvent, AuditEventType } from "@/app/types";
import { initialAuditEvents } from "@/mocks/audit";
import { pushAuditEvent } from "@/services/amplify/apiAdapter";

type AuditState = {
  events: AuditEvent[];
  addEvent: (type: AuditEventType, actor: string, message: string) => void;
};

export const useAuditStore = create<AuditState>((set) => ({
  events: initialAuditEvents,
  addEvent: (type, actor, message) => {
    const event: AuditEvent = {
      id: `audit-${Date.now()}`,
      type,
      actor,
      message,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({ events: [event, ...state.events] }));
    void pushAuditEvent(event);
  },
}));

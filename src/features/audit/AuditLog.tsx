import { Card } from "@/components/ui/Card";
import { useAuditStore } from "@/features/audit/useAuditStore";

export function AuditLog() {
  const events = useAuditStore((s) => s.events);

  return (
    <Card id="audit">
      <h3 className="mb-3 text-base font-semibold">Auditoria (UI mock)</h3>
      <div className="space-y-2 text-sm">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg border bg-brand-muted/40 p-3">
            <p className="font-medium">{event.message}</p>
            <p className="text-xs text-slate-500">
              {event.actor} - {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

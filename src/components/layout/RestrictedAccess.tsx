import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";

export function RestrictedAccess({ message }: { message: string }) {
  const openRolePicker = useDemoRoleStore((s) => s.openRolePicker);

  return (
    <Card>
      <h2 className="text-xl font-bold">Acceso restringido</h2>
      <p className="mt-2 text-sm text-brand-muted">{message}</p>
      <Button className="mt-4" onClick={openRolePicker}>Cambiar rol</Button>
    </Card>
  );
}

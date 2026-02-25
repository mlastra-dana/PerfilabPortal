# Resultados Médicos

Plataforma moderna para consulta, validacion y trazabilidad de estudios clinicos de un laboratorio independiente.

## Enfoque del producto

Este repositorio esta enfocado exclusivamente en **Resultados Médicos**.

Incluye solo:

- Informacion general del paciente
- Historial de ordenes y examenes (timeline)
- Resultados medicos con rangos, alertas fuera de rango, PDF y tendencias
- Documentacion clinica asociada
- Compartir resultados por enlace temporal mock (`/r/:token`)
- Panel demo para admin/staff: pacientes, carga de resultados, auditoria

No incluye:

- Citas
- Facturacion/pagos
- Seguridad avanzada visible (2FA/politicas avanzadas)

## Modo demostración (sin autenticacion real)

- No hay login obligatorio.
- `RoleSwitch` visible en layout autenticado.
- Rol persistido en `localStorage`.
- Restriccion visual de rutas:
  - `patient` no accede a `/admin/*`
  - `staff` y `admin` acceden a admin
- Banner global: `Modo demostración`.

## Rutas

### Publicas

- `/` landing
- `/r/:token` enlace temporal mock
- `/login` redireccion a `/results/overview` (compatibilidad)

### Paciente

- `/results/overview` Resumen
- `/results/labs` Mis Resultados Médicos
- `/results/orders` Ordenes y Examenes
- `/results/clinical-docs` Documentos Clinicos
- `/results/share` Compartir Resultados

### Admin demo

- `/admin/patients`
- `/admin/uploads`
- `/admin/audit`

## Auditoria mock

Se registran eventos:

- `role_changed`
- `page_view`
- `document_view`
- `download_clicked`
- `upload`

## Desarrollo

```bash
npm install
npm run dev
npm run build
```

## Estructura clave

- `src/features/patient/pages.tsx`
- `src/features/admin/pages.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/AuthedLayout.tsx`
- `src/components/layout/RoleSwitch.tsx`
- `src/features/demo/useDemoRoleStore.ts`
- `src/services/mock/tokenValidator.ts`
- `src/styles/tokens.css`

## Futuro: activacion de auth real

1. Reintroducir autenticacion Cognito.
2. Mapear claims de grupos a roles.
3. Enforzar RBAC en backend (API/Lambda).
4. Reemplazar token mock por enlaces firmados con expiracion real.

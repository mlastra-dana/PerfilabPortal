# DANAconnect Multiempresa - Portal de Documentos

Plataforma demo multiempresa para visualizacion, descarga y comparticion de documentos
por industria (Laboratorio/Perfilab, Universidad, RRHH, Aseguradora).

## Enfoque del producto (demo multiindustria)

Este repositorio implementa un selector multiempresa y flujos demo por industria.
El flujo de Laboratorio reutiliza el portal Perfilab existente sin modificar datos.

Incluye:

- Landing multiempresa con selector de industria
- Acceso por identificador (cedula / poliza segun industria)
- Administrador de documentos (lista, preview, descargar, compartir)
- Laboratorio (Perfilab): resultados medicos, ordenes, examenes y documentos clinicos
- Universidad: notas, constancias, pagos (mock)
- RRHH: recibos, contratos, constancias (mock)
- Aseguradora: polizas, cartas aval, reembolsos, anexos (mock)
- Compartir por enlace temporal mock (`/r/:token`)
- Panel demo para admin/staff: pacientes, carga de resultados, auditoria

No incluye:

- Citas
- Facturacion/pagos
- Seguridad avanzada visible (2FA/politicas avanzadas)

## Modo demostracion (sin autenticacion real)

- No hay login obligatorio.
- `RoleSwitch` visible en layout autenticado.
- Rol persistido en `localStorage`.
- Restriccion visual de rutas:
  - `patient` no accede a `/admin/*`
  - `staff` y `admin` acceden a admin
- Banner global: `Modo demostración`.

## Rutas

### Publicas

- `/` landing multiempresa
- `/multi` landing multiempresa (alias)
- `/r/:token` enlace temporal mock
- `/login` redireccion a `/results/overview` (compatibilidad)

### Acceso multiempresa

- `/access/:industry` acceso por industria (universidad/rrhh/aseguradora)
- `/documents/:industry` document manager por industria
- Laboratorio: `/access` y rutas Perfilab existentes

### Perfilab (Laboratorio)

- `/results/overview` Resumen
- `/results/labs` Mis Resultados Medicos
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

- `src/features/multi/pages.tsx` (landing + accesos + documentos multiempresa)
- `src/features/patient/pages.tsx` (Perfilab)
- `src/features/admin/pages.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/AuthedLayout.tsx`
- `src/components/layout/RoleSwitch.tsx`
- `src/features/demo/useDemoRoleStore.ts`
- `src/features/demo/useCompanySession.ts`
- `src/services/mock/tokenValidator.ts`
- `src/styles/tokens.css`

## Futuro: activacion de auth real

1. Reintroducir autenticacion Cognito.
2. Mapear claims de grupos a roles.
3. Enforzar RBAC en backend (API/Lambda).
4. Reemplazar token mock por enlaces firmados con expiracion real.

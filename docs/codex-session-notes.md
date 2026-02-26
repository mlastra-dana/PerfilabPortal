Portal Perfilab – Resultados Médicos Demo
Sesión Técnica – Resumen Codex
🎯 Objetivo del Portal

Construir un portal demo de Resultados Médicos individuales donde el paciente:

Ingresa con su cédula

Visualiza únicamente sus documentos

Puede ver, descargar y compartir resultados

El enfoque es una demo funcional, sin backend, desplegada en AWS Amplify, con archivos reales.

🏗 Arquitectura (Demo Actual)

Frontend: React + TypeScript

Estilos: TailwindCSS

Hosting: AWS Amplify

Datos: Mock local

Archivos: Servidos desde carpeta pública /public/assets

Sin backend

Sin autenticación real

Acceso por cédula en modo demo

👤 Paciente Demo Configurado
Datos:

Nombre: Sarina Salas

Cédula: V-16004539

Empresa: danaconnect

Correo: ssalas@danaconnect.com

Funcionamiento:

Si el usuario ingresa V-16004539 → se muestran únicamente sus documentos

Otras cédulas mantienen comportamiento actual demo

📂 Gestión de Documentos Reales

Se abandonaron documentos mock.

Archivos reales cargados en:

public/assets/demo/sarina-salas/

Ejemplos:

laboratorio-sanguineo.pdf

rx-torax.png

composicion-corporal.jpg

Acceso público vía:

/assets/demo/sarina-salas/<archivo>

Amplify publica automáticamente tras commit.

🖼 Mejora Importante – Preview PDF Real

Antes:

PDF mostraba placeholder gris “PDF Vista previa”

Ahora:

Implementado thumbnail real usando PDF.js

Renderiza la primera página del PDF

Imágenes siguen usando <img>

Fallback si falla render

Resultado:
✔ Vista previa profesional
✔ No más bloques vacíos
✔ Experiencia realista

🔄 Ajustes de UX Aplicados
Cambios realizados:

Badge "nuevo" → cambiado a "no visto"

Corrección de error 404 en preview

Corrección de rutas mal configuradas

Eliminación de secciones innecesarias:

Órdenes activas

Rol demo

Consentimientos

Gráficas y tendencias

Portal simplificado a:

Información del paciente

Mis Resultados (document manager)

🏠 Landing Ajustada

Se mantuvo pantalla hero naranja

Agregado botón:

Entrar a la demo

Solo navegación (sin duplicar lógica)

Eliminado exceso de textos redundantes “Resultados Médicos”

Flujo:

Landing → Pantalla de acceso por cédula → Mis Resultados

🔎 Filtros Implementados

Buscar por nombre de documento

Filtrar por tipo

Filtrar por rango de fecha

Contador actualizado:

“Mostrados últimos X documentos”

Soporte singular/plural

📤 Funcionalidades Activas

Cada documento permite:

Ver (modal preview)

Descargar

Compartir

Compartir permite:

WhatsApp

Email (según implementación actual)

🎨 Branding Perfilab

Logo integrado

Colores alineados a identidad

Limpieza visual

Eliminado header redundante

UI más enfocada en experiencia clínica

🧠 Decisión Estratégica

Para esta demo:

No backend

No autenticación real

No S3 dinámico

Todo servido como asset público

Flujo demostrable y estable

Enfocado en experiencia visual y realismo

🔮 Posibles Mejoras Futuras

Marcar como visto automáticamente al abrir

Contador de documentos no vistos

Enlaces temporales firmados para compartir

Backend con Lambda + S3

Firma digital real

Watermark “Demo”

Token seguro por paciente

Control de acceso real

📊 Estado Actual

✔ Funciona en local
✔ Funciona en Amplify
✔ PDFs con thumbnail real
✔ Imágenes preview correcto
✔ Filtrado por cédula funcional
✔ Compartir activo
✔ UX simplificada
✔ Branding Perfilab aplicado

Resultado

El portal ya no es mock visual.
Es una demo funcional con documentos reales, flujo coherente y experiencia profesional.

Fin del resumen.
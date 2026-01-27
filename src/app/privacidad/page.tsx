import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad | Vistta",
  description: "Política de privacidad y protección de datos de Vistta",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-label text-neutral-400 mb-4 block">Legal</span>
          <h1 className="text-[32px] font-medium text-neutral-900 text-editorial leading-[1.1] mb-4">
            Política de Privacidad
          </h1>
          <p className="text-[14px] text-neutral-500">
            Última actualización: {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">1. Introducción</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              En Vistta nos comprometemos a proteger tu privacidad y tus datos personales. Esta Política de Privacidad
              explica cómo recopilamos, utilizamos, almacenamos y protegemos tu información cuando utilizas nuestra
              plataforma de home staging virtual.
            </p>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Esta política cumple con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea
              y la Ley Orgánica de Protección de Datos y garantía de los derechos digitales (LOPDGDD) de España.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">2. Responsable del Tratamiento</h2>
            <div className="p-4 bg-neutral-50 border border-neutral-200 mb-4">
              <p className="text-[14px] text-neutral-700">
                <strong>Responsable:</strong> Vistta<br />
                <strong>Email de contacto:</strong> legal@visttahome.com<br />
                <strong>Dirección:</strong> Santa Cruz de Tenerife, España
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">3. Datos que Recopilamos</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Recopilamos los siguientes tipos de datos:
            </p>

            <h3 className="text-[16px] font-medium text-neutral-800 mb-3 mt-6">3.1 Datos de registro</h3>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Foto de perfil (si usas Google para registrarte)</li>
            </ul>

            <h3 className="text-[16px] font-medium text-neutral-800 mb-3 mt-6">3.2 Datos de uso</h3>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Imágenes que subes a la plataforma para su procesamiento</li>
              <li>Imágenes generadas por nuestro sistema de IA</li>
              <li>Preferencias de estilo y configuración</li>
              <li>Historial de generaciones</li>
            </ul>

            <h3 className="text-[16px] font-medium text-neutral-800 mb-3 mt-6">3.3 Datos técnicos</h3>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de uso</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">4. Finalidad del Tratamiento</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Utilizamos tus datos para:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Prestar el servicio:</strong> Procesar tus imágenes y generar transformaciones mediante IA</li>
              <li><strong>Gestión de cuenta:</strong> Crear y mantener tu cuenta de usuario</li>
              <li><strong>Comunicaciones:</strong> Enviarte información sobre tu cuenta, actualizaciones del servicio y soporte técnico</li>
              <li><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para mejorar su funcionamiento</li>
              <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales aplicables</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">5. Base Legal del Tratamiento</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              El tratamiento de tus datos se basa en:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Ejecución del contrato:</strong> Para prestarte el servicio que has contratado</li>
              <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales (si lo has autorizado)</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
              <li><strong>Obligación legal:</strong> Para cumplir con requisitos legales aplicables</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">6. Tratamiento de Imágenes</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Las imágenes que subes a Vistta son procesadas de la siguiente manera:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Se almacenan de forma segura en servidores cifrados</li>
              <li>Son procesadas por nuestros sistemas de IA para generar las transformaciones solicitadas</li>
              <li>Las imágenes originales y generadas están asociadas a tu cuenta</li>
              <li>No compartimos tus imágenes con terceros sin tu consentimiento</li>
              <li>Puedes eliminar tus imágenes en cualquier momento desde tu panel de control</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              <strong>Importante:</strong> No utilizamos tus imágenes para entrenar nuestros modelos de IA ni las compartimos
              públicamente sin tu autorización expresa.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">7. Destinatarios de los Datos</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Podemos compartir tus datos con:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting, procesamiento de pagos, IA)</li>
              <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger nuestros derechos</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              Nuestros proveedores de servicios incluyen:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2 mt-2">
              <li>Supabase (autenticación y base de datos) - Servidores en la UE</li>
              <li>Google Cloud / Anthropic (procesamiento de IA)</li>
              <li>Proveedores de pago (para procesar transacciones)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">8. Transferencias Internacionales</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo.
              En estos casos, nos aseguramos de que existan garantías adecuadas para proteger tus datos, como las
              Cláusulas Contractuales Tipo aprobadas por la Comisión Europea o certificaciones equivalentes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">9. Conservación de Datos</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Conservamos tus datos durante el tiempo necesario para:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Datos de cuenta:</strong> Mientras mantengas tu cuenta activa</li>
              <li><strong>Imágenes:</strong> Hasta que las elimines o canceles tu cuenta</li>
              <li><strong>Datos de facturación:</strong> Durante el período legalmente requerido (mínimo 6 años)</li>
              <li><strong>Datos de uso:</strong> Máximo 24 meses para análisis estadísticos anonimizados</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">10. Tus Derechos</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Conforme al RGPD, tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos (&quot;derecho al olvido&quot;)</li>
              <li><strong>Limitación:</strong> Restringir el tratamiento de tus datos en ciertas circunstancias</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado y transferirlos a otro responsable</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para determinados fines</li>
              <li><strong>Retirar consentimiento:</strong> Retirar tu consentimiento en cualquier momento</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              Para ejercer estos derechos, contacta con nosotros en <strong>legal@visttahome.com</strong>.
              Responderemos a tu solicitud en un plazo máximo de 30 días.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">11. Seguridad</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Cifrado de datos en tránsito (HTTPS/TLS) y en reposo</li>
              <li>Autenticación segura y gestión de accesos</li>
              <li>Monitorización y detección de amenazas</li>
              <li>Copias de seguridad periódicas</li>
              <li>Formación del personal en protección de datos</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">12. Cookies</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del servicio (autenticación, seguridad)</li>
              <li><strong>Cookies funcionales:</strong> Recuerdan tus preferencias</li>
              <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo se usa la plataforma</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              Puedes gestionar tus preferencias de cookies desde la configuración de tu navegador.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">13. Menores</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Vistta no está dirigido a menores de 16 años. No recopilamos intencionadamente datos de menores.
              Si descubrimos que hemos recopilado datos de un menor sin el consentimiento parental verificable,
              eliminaremos esa información lo antes posible.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">14. Cambios en esta Política</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre cambios
              significativos mediante un aviso en la plataforma o por email. Te recomendamos revisar esta
              página regularmente para estar informado sobre cómo protegemos tus datos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">15. Reclamaciones</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Si consideras que el tratamiento de tus datos no es conforme a la normativa, tienes derecho a
              presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en{" "}
              <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-neutral-900 hover:underline">
                www.aepd.es
              </a>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">16. Contacto</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Para cualquier consulta relacionada con esta Política de Privacidad o el tratamiento de tus datos:
            </p>
            <div className="p-4 bg-neutral-50 border border-neutral-200">
              <p className="text-[14px] text-neutral-700">
                <strong>Email:</strong> legal@visttahome.com<br />
                <strong>Delegado de Protección de Datos:</strong> legal@visttahome.com<br />
                <strong>Dirección:</strong> Santa Cruz de Tenerife, España
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="text-[13px] text-neutral-500">
            © {new Date().getFullYear()} Vistta. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

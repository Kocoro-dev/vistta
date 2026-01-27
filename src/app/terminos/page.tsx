import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Términos de Servicio | Vistta",
  description: "Términos y condiciones de uso de la plataforma Vistta",
};

export default function TerminosPage() {
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
            Términos de Servicio
          </h1>
          <p className="text-[14px] text-neutral-500">
            Última actualización: {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">1. Introducción</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Bienvenido a Vistta. Estos Términos de Servicio (&quot;Términos&quot;) regulan el acceso y uso de la plataforma
              Vistta (&quot;Servicio&quot;), una herramienta de home staging virtual basada en inteligencia artificial,
              operada por Vistta (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Empresa&quot;).
            </p>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Al acceder o utilizar nuestro Servicio, aceptas estar vinculado por estos Términos. Si no estás de acuerdo
              con alguna parte de estos términos, no podrás acceder al Servicio.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">2. Descripción del Servicio</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Vistta proporciona una plataforma de home staging virtual que utiliza tecnología de inteligencia artificial
              para transformar fotografías de propiedades inmobiliarias. Nuestros servicios incluyen:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li><strong>Vistta Enhance:</strong> Mejora de fotografías existentes (iluminación, limpieza visual, pequeños ajustes)</li>
              <li><strong>Vistta Vision:</strong> Amueblamiento virtual de espacios vacíos con diferentes estilos de decoración</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">3. Registro y Cuenta</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Para utilizar el Servicio, debes crear una cuenta proporcionando información veraz y completa. Eres responsable de:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Mantener la confidencialidad de tu cuenta</li>
              <li>Todas las actividades que ocurran bajo tu cuenta</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
              <li>Proporcionar información actualizada y precisa</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">4. Uso Aceptable</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Al utilizar Vistta, te comprometes a:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Usar el Servicio únicamente para fines legales y relacionados con la promoción inmobiliaria</li>
              <li>No subir contenido que infrinja derechos de terceros</li>
              <li>No utilizar las imágenes generadas para engañar a compradores o inquilinos sobre el estado real de una propiedad</li>
              <li>No intentar vulnerar la seguridad del Servicio</li>
              <li>No utilizar el Servicio para generar contenido ilegal, ofensivo o inapropiado</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              Las imágenes generadas por Vistta deben utilizarse como representaciones virtuales y promocionales.
              Recomendamos indicar claramente que se trata de renders o staging virtual cuando se presenten a potenciales clientes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">5. Propiedad Intelectual</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              <strong>Tu contenido:</strong> Conservas todos los derechos sobre las imágenes originales que subas a la plataforma.
              Al subir contenido, nos otorgas una licencia limitada para procesarlo y generar las transformaciones solicitadas.
            </p>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              <strong>Imágenes generadas:</strong> Las imágenes resultantes del procesamiento de IA son de tu propiedad y puedes
              utilizarlas para fines comerciales relacionados con la promoción de propiedades inmobiliarias.
            </p>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              <strong>Nuestra plataforma:</strong> Todo el código, diseño, marcas y tecnología de Vistta son propiedad exclusiva
              de la Empresa y están protegidos por las leyes de propiedad intelectual aplicables.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">6. Planes y Pagos</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              Vistta ofrece diferentes planes de suscripción. Los precios y características de cada plan están disponibles
              en nuestra página web. Al suscribirte:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>Autorizas el cargo según el plan seleccionado</li>
              <li>Los créditos no utilizados pueden tener fecha de caducidad según el plan</li>
              <li>Las suscripciones mensuales se renuevan automáticamente</li>
              <li>Puedes cancelar tu suscripción en cualquier momento desde tu panel de control</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed mb-4">
              El Servicio se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;. No garantizamos que:
            </p>
            <ul className="list-disc pl-6 text-[15px] text-neutral-600 space-y-2">
              <li>El Servicio funcione de manera ininterrumpida o libre de errores</li>
              <li>Los resultados de la IA sean siempre satisfactorios o fotorrealistas</li>
              <li>El Servicio cumpla con todas tus expectativas específicas</li>
            </ul>
            <p className="text-[15px] text-neutral-600 leading-relaxed mt-4">
              En ningún caso seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados
              del uso del Servicio.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">8. Modificaciones del Servicio</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del Servicio en cualquier momento.
              También podemos actualizar estos Términos periódicamente. Te notificaremos sobre cambios significativos mediante
              email o mediante un aviso en la plataforma.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">9. Terminación</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Podemos suspender o terminar tu acceso al Servicio si incumples estos Términos o si consideramos que tu uso
              del Servicio puede causar daños a nosotros o a terceros. Puedes cancelar tu cuenta en cualquier momento
              contactándonos a través de los canales indicados.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">10. Legislación Aplicable</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de España. Cualquier disputa relacionada
              con estos Términos estará sujeta a la jurisdicción exclusiva de los tribunales de Santa Cruz de Tenerife, España.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-[20px] font-medium text-neutral-900 mb-4">11. Contacto</h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos en:
            </p>
            <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200">
              <p className="text-[14px] text-neutral-700">
                <strong>Email:</strong> legal@visttahome.com<br />
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

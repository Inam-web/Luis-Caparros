import { Link, Navigate, useParams } from "react-router-dom";
import { usePageFX, useSEO } from "../hooks/hooks";
import { useI18n } from "../i18n";
import { ChevronDown } from "../components/Icons";

const DOCS = {
  accessibility: {
    en: {
      title: "Accessibility",
      intro: "This site aspires to let anyone read the work of Luis Caparrós, regardless of ability or device.",
      sections: [
        {
          h: "Our commitment",
          p: [
            "We work to meet the Web Content Accessibility Guidelines (WCAG 2.1, level AA): sufficient contrast between text and background, full keyboard navigation, alternative text on images and an ordered heading hierarchy.",
          ],
        },
        {
          h: "What you will find here",
          p: [
            "Every feature — navigation, store, basket and forms — can be used without a mouse. Animations are automatically disabled when your system has reduced-motion enabled.",
            "Font sizes adapt to browser zoom up to 200 % without loss of content.",
          ],
        },
        {
          h: "Reports and suggestions",
          p: [
            "If you find any barrier to access, write to us through the contact page indicating the page and the problem: we will correct it as a priority.",
          ],
        },
      ],
    },
    es: {
      title: "Accesibilidad",
      intro: "Este sitio aspira a que cualquier persona pueda leer la obra de Luis Caparrós, independientemente de sus capacidades o de su dispositivo.",
      sections: [
        {
          h: "Compromiso",
          p: [
            "Trabajamos para cumplir las Pautas de Accesibilidad para el Contenido Web (WCAG 2.1, nivel AA): contraste suficiente entre texto y fondo, navegación completa mediante teclado, textos alternativos en las imágenes y una jerarquía de encabezados ordenada.",
          ],
        },
        {
          h: "Qué encontrarás aquí",
          p: [
            "Todas las funciones —navegación, tienda, carrito y formularios— son utilizables sin ratón. Las animaciones se desactivan automáticamente si tu sistema tiene activada la preferencia de movimiento reducido.",
            "Los tamaños de letra se adaptan al zoom del navegador hasta el 200 % sin pérdida de contenido.",
          ],
        },
        {
          h: "Avisos y sugerencias",
          p: [
            "Si encuentras alguna barrera de acceso, escríbenos a través de la página de contacto indicando la página y el problema: lo corregiremos con prioridad.",
          ],
        },
      ],
    },
  },
  "legal-notice": {
    en: {
      title: "Legal notice",
      intro: "General terms of use of the website luiscaparrosescritor.com, owned by the writer Luis Caparrós.",
      sections: [
        {
          h: "Site owner",
          p: [
            "This website belongs to Luis Caparrós, based in Andalusia (Spain). You can get in touch through the contact page or the email shown in the footer.",
          ],
        },
        {
          h: "Terms of use",
          p: [
            "Access to the site is free and confers the status of user, who undertakes to make lawful use of its contents. Texts, covers, photographs and logos are protected by intellectual-property rights; reproduction without express authorisation is not permitted.",
          ],
        },
        {
          h: "Store and prices",
          p: [
            "Prices shown include VAT. The order is confirmed by email and shipping conditions are detailed on the store page. For claims, write to the site's email quoting the order number.",
          ],
        },
        {
          h: "Liability",
          p: [
            "The owner is not responsible for the content of external linked sites nor for temporary interruption of the service due to force majeure.",
          ],
        },
      ],
    },
    es: {
      title: "Aviso legal",
      intro: "Condiciones generales de uso del sitio web luiscaparrosescritor.com, titularidad del escritor Luis Caparrós.",
      sections: [
        {
          h: "Titular del sitio",
          p: [
            "Este sitio web pertenece a Luis Caparrós, con domicilio en Andalucía (España). Puedes contactar a través de la página de contacto o del correo indicado en el pie de página.",
          ],
        },
        {
          h: "Condiciones de uso",
          p: [
            "El acceso al sitio es gratuito y atribuye la condición de usuario, que se compromete a hacer un uso lícito de sus contenidos. Los textos, portadas, fotografías y logotipos están protegidos por derechos de propiedad intelectual; no está permitida su reproducción sin autorización expresa.",
          ],
        },
        {
          h: "Tienda y precios",
          p: [
            "Los precios indicados incluyen IVA. El pedido queda confirmado mediante correo electrónico y las condiciones de envío se detallan en la página de la tienda. Para reclamaciones, escribe al correo del sitio indicando el número de pedido.",
          ],
        },
        {
          h: "Responsabilidad",
          p: [
            "El titular no se hace responsable del contenido de sitios externos enlazados ni de la interrupción temporal del servicio por causas de fuerza mayor.",
          ],
        },
      ],
    },
  },
  "cookie-policy": {
    en: {
      title: "Cookie policy",
      intro: "A clear explanation of what is stored in your browser when you visit this site.",
      sections: [
        {
          h: "What we use — and what we don't",
          p: [
            "This site only uses local storage that is essential for the shop to work: the contents of your basket and the last confirmed order. We do not use advertising or third-party tracking cookies.",
          ],
        },
        {
          h: "How to manage it",
          p: [
            "You can delete this data at any time from your browser settings (history and site data). If you do, the basket will be emptied, but you can keep shopping normally.",
          ],
        },
      ],
    },
    es: {
      title: "Política de cookies",
      intro: "Explicación clara de qué se guarda en tu navegador cuando visitas este sitio.",
      sections: [
        {
          h: "Qué usamos y qué no",
          p: [
            "Este sitio utiliza únicamente almacenamiento local imprescindible para el funcionamiento de la tienda: el contenido de tu cesta de la compra y el último pedido confirmado. No empleamos cookies publicitarias ni de seguimiento de terceros.",
          ],
        },
        {
          h: "Cómo gestionarlo",
          p: [
            "Puedes borrar estos datos en cualquier momento desde la configuración de tu navegador (historial y datos de sitios). Si lo haces, la cesta quedará vacía, pero podrás seguir comprando con normalidad.",
          ],
        },
      ],
    },
  },
  "privacy-policy": {
    en: {
      title: "Privacy policy",
      intro: "How we handle the personal data you provide through the forms and the store.",
      sections: [
        {
          h: "Controller and purpose",
          p: [
            "The data controller is Luis Caparrós. Contact-form data is used exclusively to answer your message; order data is used to manage the shipping and payment of your purchase. We do not pass data to third parties except the courier, in what is strictly necessary for delivery.",
          ],
        },
        {
          h: "Retention and rights",
          p: [
            "Data is kept for as long as necessary to handle your request and meet legal obligations. You may exercise the rights of access, rectification, erasure and objection by writing to the site's email, stating the right you wish to exercise.",
          ],
        },
        {
          h: "Security",
          p: [
            "Forms travel encrypted over HTTPS and payment data is never stored on this site: the bank gateway manages it directly.",
          ],
        },
      ],
    },
    es: {
      title: "Política de privacidad",
      intro: "Cómo tratamos los datos personales que nos facilitas a través de los formularios y de la tienda.",
      sections: [
        {
          h: "Responsable y finalidad",
          p: [
            "El responsable del tratamiento es Luis Caparrós. Los datos del formulario de contacto se usan exclusivamente para responder a tu mensaje; los datos del pedido, para gestionar el envío y el cobro de tu compra. No cedemos datos a terceros salvo a la empresa de mensajería, en lo imprescindible para la entrega.",
          ],
        },
        {
          h: "Conservación y derechos",
          p: [
            "Los datos se conservan durante el tiempo necesario para atender tu solicitud y cumplir las obligaciones legales. Puedes ejercer los derechos de acceso, rectificación, supresión y oposición escribiendo al correo del sitio, indicando el derecho que deseas ejercer.",
          ],
        },
        {
          h: "Seguridad",
          p: [
            "Los formularios viajan cifrados mediante HTTPS y los datos de pago no se almacenan en este sitio: la pasarela bancaria es quien los gestiona directamente.",
          ],
        },
      ],
    },
  },
};

const ORDER = ["accessibility", "legal-notice", "cookie-policy", "privacy-policy"];

export default function Legal() {
  const { page } = useParams();
  const { lang, t } = useI18n();
  const doc = page ? DOCS[page]?.[lang] : undefined;

  useSEO(doc ? `${doc.title} - LUIS CAPARRÓS` : "Legal - LUIS CAPARRÓS", doc?.intro ?? "Legal information.");
  usePageFX([page, lang]);

  if (!doc) return <Navigate to="/" replace />;

  return (
    <>
      <div className="bg-pine-950 text-paper-100 pt-[104px]">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-paper-100/70">
          <Link to="/" className="hover:text-gold-300 transition-colors">{t("legal.home")}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gold-400">{doc.title}</span>
        </div>
      </div>

      <section className="paper-grain py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 grid lg:grid-cols-[0.72fr_1.28fr] gap-12">
          {/* sticky index */}
          <aside className="lg:sticky lg:top-32 self-start">
            <p className="rv text-[11px] font-bold tracking-[0.3em] uppercase text-wine-600">{t("legal.eyebrow")}</p>
            <h1 className="mt-3 font-display font-semibold text-pine-900 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.05]">
              <span className="line-mask"><span>{doc.title}</span></span>
            </h1>
            <p className="rv mt-4 text-sm text-pine-700/80">{t("legal.updated", { date: t("legal.updatedDate") })}</p>
            <nav className="rv mt-8 space-y-2" aria-label="Other legal pages">
              {ORDER.filter((o) => o !== page).map((o) => (
                <Link key={o} to={`/${o}`} className="link-ink block text-sm font-semibold text-pine-700 hover:text-wine-600 transition-colors w-fit">
                  → {DOCS[o][lang].title}
                </Link>
              ))}
            </nav>
          </aside>

          {/* body */}
          <div>
            <p className="rv font-display italic text-xl text-pine-800 leading-relaxed">{doc.intro}</p>
            <div className="mt-8 space-y-9">
              {doc.sections.map((s, i) => (
                <div key={s.h} className="rv" style={{ transitionDelay: `${i * 60}ms` }}>
                  <h2 className="font-display font-bold text-xl text-pine-900 flex items-center gap-3">
                    <span className="font-body font-bold text-xs tracking-widest text-wine-600">{String(i + 1).padStart(2, "0")}</span>
                    {s.h}
                  </h2>
                  {s.p.map((p, j) => (
                    <p key={j} className="mt-3 text-[15px] leading-relaxed text-pine-700">{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
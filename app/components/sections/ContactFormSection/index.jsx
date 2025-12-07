import ContactForm from "../../../contacto/ContactForm";

export default function ContactFormSection({ title, subtitle }) {
  return (
    <section className="mx-2 py-8 md:mx-12">
      <div className="max-w-4xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl font-bold text-plumPrimaryPurple mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

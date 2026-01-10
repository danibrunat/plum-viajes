import Image from "next/image";
import { MAINTENANCE_CONFIG } from "../constants/maintenance";

export const metadata = {
  title: "En Mantenimiento | Plum Viajes",
  description: "El sitio se encuentra en mantenimiento temporalmente",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Contenido principal */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono o ilustración */}
          <div className="mb-8 mx-auto">
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/images/maintenance-illustration.svg`}
              alt="Mantenimiento en progreso"
              width={300}
              height={300}
              className="mx-auto"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-plumPrimaryPurple mb-4">
            {MAINTENANCE_CONFIG.title}
          </h1>

          <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
            <p className="text-xl mb-4">{MAINTENANCE_CONFIG.message}</p>
            <p className="text-lg mb-6">{MAINTENANCE_CONFIG.submessage}</p>

            {MAINTENANCE_CONFIG.estimatedTime && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                <p className="text-amber-800 font-medium">
                  {MAINTENANCE_CONFIG.estimatedTime}
                </p>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <p className="text-gray-700">{MAINTENANCE_CONFIG.contactInfo}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="bg-plumPrimaryPurple text-white py-6 px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Plum Viajes - Legajo 18.156
        </p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

const SocialWidget = ({ whatsappLink, facebookLink, instagramLink }) => {
  return (
    <div className="hidden fixed left-0 top-1/3 md:flex flex-col space-y-4 bg-white p-1 rounded shadow-lg">
      <Link href={whatsappLink} target="_blank" aria-label="Contactanos por WhatsApp">
        <FaWhatsapp className="text-green-500 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
      <Link href={facebookLink} target="_blank" aria-label="Visitá nuestro Facebook">
        <FaFacebook className="text-blue-600 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
      <Link href={instagramLink} target="_blank" aria-label="Visitá nuestro Instagram">
        <FaInstagram className="text-pink-500 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
    </div>
  );
};

export default SocialWidget;

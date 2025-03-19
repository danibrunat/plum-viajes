import Link from "next/link";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

const SocialWidget = ({ whatsappLink, facebookLink, instagramLink }) => {
  return (
    <div className="fixed left-0 top-1/3 flex flex-col space-y-4 bg-white p-1 rounded shadow-lg">
      <Link href={whatsappLink} target="_blank">
        <FaWhatsapp className="text-green-500 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
      <Link href={facebookLink} target="_blank">
        <FaFacebook className="text-blue-600 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
      <Link href={instagramLink} target="_blank">
        <FaInstagram className="text-pink-500 w-10 h-10 hover:scale-110 transition-transform" />
      </Link>
    </div>
  );
};

export default SocialWidget;

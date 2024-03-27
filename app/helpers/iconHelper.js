import { FaPhone, FaUser, FaSuitcase, FaBan } from "react-icons/fa";

export const getIconByName = (name) => {
  const icons = {
    default: <FaBan />,
    FaPhone: <FaPhone />,
    FaUser: <FaUser />,
    FaSuitcase: <FaSuitcase />,
  };

  if (name) return icons[name];

  return icons.default;
};

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: "bottom-left" | "bottom-right";
  className?: string;
}

export function WhatsAppFloatingButton({
  phoneNumber,
  message,
  position = "bottom-left",
  className = "",
}: WhatsAppFloatingButtonProps) {
  const [activeNumber, setActiveNumber] = useState<string>(phoneNumber || "6305729867");
  const [activeMessage, setActiveMessage] = useState<string>(
    message || "Hi Detective Zone Team, I have an inquiry."
  );
  const [activePosition, setActivePosition] = useState<"bottom-left" | "bottom-right">(position);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // If not explicitly passed as prop, load from live CMS site settings
    if (!phoneNumber) {
      api
        .getSettings()
        .then((s) => {
          if (s) {
            if (s.whatsapp_enabled === "false" || s.whatsapp_enabled === false) {
              setIsEnabled(false);
            }
            if (s.whatsapp_position === "bottom-right" || s.whatsapp_position === "bottom-left") {
              setActivePosition(s.whatsapp_position as "bottom-left" | "bottom-right");
            }
            if (s.whatsapp_phone_number) {
              setActiveNumber(s.whatsapp_phone_number);
            } else if (s.contact_phone) {
              setActiveNumber(s.contact_phone);
            }
            if (s.whatsapp_message) {
              setActiveMessage(s.whatsapp_message);
            }
          }
        })
        .catch(() => {});
    }
  }, [phoneNumber]);

  if (!isEnabled) return null;

  // Format international number (India country code 91 default if 10 digits)
  const cleanNumber = activeNumber.replace(/[^0-9]/g, "");
  const formattedNumber =
    cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber || "916305729867";
  const encodedText = encodeURIComponent(activeMessage);
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedText}`;

  const posClasses =
    activePosition === "bottom-left"
      ? "bottom-6 left-6"
      : "bottom-6 right-6";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Detective Zone on WhatsApp"
      title={`Chat on WhatsApp (${activeNumber})`}
      className={`fixed z-[999] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 ${posClasses} ${className}`}
      style={{
        backgroundColor: "#25D366",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(37, 211, 102, 0.3)",
        textDecoration: "none",
      }}
    >
      {/* Clean Solid Crisp Official WhatsApp SVG Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="#FFFFFF"
      >
        <path d="M16 2C8.28 2 2 8.28 2 16c0 2.65.74 5.14 2.03 7.28L2 30l6.95-1.99C11.02 29.28 13.43 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.65c-2.31 0-4.47-.67-6.3-1.83l-.45-.29-4.22 1.21 1.23-4.11-.31-.47C4.7 20.3 4 18.22 4 16 4 9.38 9.38 4 16 4s12 5.38 12 12-5.38 11.65-12 11.65zm6.54-8.87c-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.61-.81-.62-.21-.01-.45-.01-.69-.01-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3.01s1.29 3.49 1.47 3.73c.18.24 2.54 3.88 6.16 5.44.86.37 1.53.59 2.06.76.87.28 1.66.24 2.28.15.7-.1 2.12-.87 2.42-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42z" />
      </svg>
    </a>
  );
}

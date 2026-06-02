/**
 * Creates a prefilled WhatsApp deep-link URL.
 * 
 * @param phone International format phone number.
 * @param message Prefilled text message to send.
 * @returns Prefilled WhatsApp API URL string.
 */
export function createWhatsAppLink(
  phone: string,
  message: string
): string {
  // Clean phone number to ensure Wa.me compatibility (keep only digits)
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}


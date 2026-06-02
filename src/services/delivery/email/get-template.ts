import { birthdayTemplate } from "./templates/birthday";
import { anniversaryTemplate } from "./templates/anniversary";
import { promotionTemplate } from "./templates/promotion";
import { festivalTemplate } from "./templates/festival";
import { genericTemplate } from "./templates/generic";

/**
 * Resolves the appropriate email template function based on the event type.
 */
export function getTemplate(type: string) {
  switch (type) {
    case "birthday":
      return birthdayTemplate;
    case "anniversary":
      return anniversaryTemplate;
    case "promotion":
      return promotionTemplate;
    case "festival":
      return festivalTemplate;
    default:
      return genericTemplate;
  }
}

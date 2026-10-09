import jerryImage from "@/assets/team/jeremiah-adeyemi.webp";
import gideonImage from "@/assets/team/gideon-olawuyi.webp";

export interface Leader {
  id: string;
  name: string;
  role: string;
  title: string;
  line: string;
  quote: string;
  image: string;
  link?: { label: string; href: string };
}

/** Bios supplied by DCH, cut to one line and one quote each. Editable from /admin. */
export const LEADERS: Leader[] = [
  {
    id: "jeremiah-adeyemi",
    name: "Jeremiah Adeyemi",
    role: "Founder & Lead Architect",
    title: "The DigiTech Strategist",
    line: "Founded DCH on one idea: real growth needs the vision of a creative and the precision of an engineer.",
    quote: "He doesn\u2019t just draw the map. He builds the road, the car and the fuel.",
    image: jerryImage,
    link: { label: "Connect with Jeremiah", href: "https://thedigitechstrategist.lovable.app" },
  },
  {
    id: "gideon-olawuyi",
    name: "Gideon Olawuyi",
    role: "Chief Operating Officer",
    title: "Development practitioner",
    line: "Works where corporate business meets African development, building the systems, organisations and partnerships that create lasting social and economic impact across Africa and beyond.",
    quote: "\u201cBusiness is the most sustainable solution to global challenges.\u201d",
    image: gideonImage,
  },
];

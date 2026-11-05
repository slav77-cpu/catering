// Central place for site-wide facts (contacts, hours, socials).
// Fields marked TODO are not in the spec yet — see "Отворени въпроси" /
// "Съдържание, което трябва да се събере от клиента" in the brief.
// Update these once the client confirms them; nothing else in the code
// needs to change.

export const site = {
  restaurantName: "MAKA RAMEN",
  cateringName: "MAKA CATERING",
  city: "Пловдив",

  phoneCatering: "0894 691 614",
  instagramHandle: "@maka.ramen.plovdiv",
  instagramUrl: "https://www.instagram.com/maka.ramen.plovdiv",

  phoneRestaurant: "0896 029 971",

  // TODO: exact street address for Google Maps pin + "Navigate" button.
  addressText: "гр. Пловдив",
  // Falls back to a text search embed until a precise address/place ID
  // is supplied — swap for a "place_id:" embed once known.
  mapsQuery: "MAKA RAMEN, Пловдив",
  mapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=MAKA+RAMEN+Plovdiv",

  // TODO: confirm working hours per day.
  hours: [
    {
      day: "Понеделник – Петък",
      time: "11:00 – 22:00",
      schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "11:00",
      closes: "22:00",
    },
    {
      day: "Събота – Неделя",
      time: "12:00 – 23:00",
      schemaDays: ["Saturday", "Sunday"],
      opens: "12:00",
      closes: "23:00",
    },
  ],

  // TODO: confirm — no restaurant/catering email given in the brief yet.
  email: "info@makaramen.bg",

  // TODO: Facebook link, if any.
  facebookUrl: "",
};

export const navLinks = [
  { href: "/restaurant", label: "Ресторант" },
  { href: "/catering", label: "Кетъринг" },
  { href: "/contacts", label: "Контакти" },
] as const;

const buildPlaceholder = (label) =>
  `https://placehold.co/800x600?text=${encodeURIComponent(label)}`;

export const galleryImages = [
  {
    src: buildPlaceholder('Cafe Interior'),
    alt: 'Café Fausse interior ambiance'
  },
  {
    src: buildPlaceholder('Signature Dish'),
    alt: 'Signature dish served at Café Fausse'
  },
  {
    src: buildPlaceholder('Ribeye Steak'),
    alt: 'Ribeye steak from the dinner menu'
  },
  {
    src: buildPlaceholder('Special Event'),
    alt: 'Special event at Café Fausse'
  }
];

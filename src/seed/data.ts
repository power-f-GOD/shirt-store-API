import { ShirtSeed } from './schemas';

export const shirtSeeds: ShirtSeed[] = [
  'Alexander McQueen',
  'Amiri',
  'Burberry',
  'Givenchy',
  'Saint Laurent'
].map((name) => ({
  name,
  image_url: `/images/${name.replace(/\s/g, '-')}.png`,
  price: 8
}));

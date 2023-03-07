import { CreateOrderDto } from 'src/domains/orders/dtos';
import { ShirtSeed } from '../schemas';

export const shirtSeedsMock: ShirtSeed[] = [
  {
    _id: '6402e0636a92495f6fed179c',
    name: 'Burberry',
    price: 8,
    image_url: '/Burberry.png'
  },
  {
    _id: '6402e0636a92495f6fed179b',
    name: 'Amiri',
    price: 8,
    image_url: '/Amiri.png'
  },
  {
    _id: '6402e0636a92495f6fed179e',
    name: 'Saint Laurent',
    price: 8,
    image_url: '/Saint-Laurent.png'
  },
  {
    _id: '6402e0636a92495f6fed179a',
    name: 'Alexander McQueen',
    price: 8,
    image_url: '/Alexander-McQueen.png'
  },
  {
    _id: '6402e0636a92495f6fed179d',
    name: 'Givenchy',
    price: 8,
    image_url: '/Givenchy.png'
  }
];

export const createOrderDtosMock: CreateOrderDto[] = [
  {
    items: {
      Givenchy: { count: 2 },
      'Alexander McQueen': { count: 2 },
      'Saint Laurent': { count: 2 },
      Amiri: { count: 1 },
      Burberry: { count: 1 }
    }
  },
  {
    items: {
      Givenchy: { count: 30 },
      'Alexander McQueen': { count: 5 },
      'Saint Laurent': { count: 3 },
      Amiri: { count: 5 },
      Burberry: { count: 2 }
    }
  }
];

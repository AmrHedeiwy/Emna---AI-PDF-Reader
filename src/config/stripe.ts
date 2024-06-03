export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 30,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: ''
      }
    }
  },
  {
    name: 'Pro',
    slug: 'pro',
    quota: 50,
    pagesPerPdf: 50,
    price: {
      amount: 10,
      priceIds: {
        test: 'price_1PKiAc2LjyjFMFLmQQlgLrS2',
        production: ''
      }
    }
  }
];

export type TPLANS = (typeof PLANS)[number];

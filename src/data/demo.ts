/**
 * Illustrative product mock data for marketing UI only.
 * These figures are not ACOMI customer statistics.
 */
export const DEMO_LABEL = 'Illustrative product data';
export const DEMO_VIEW = 'Illustrative product view';
export const DEMO_WORKSPACE = 'Example workspace';

export const DEMO = {
  ownerName: 'Ketan',
  hostel: {
    name: 'Sunrise Hostel',
    type: 'Hostel',
    beds: { total: 240, occupied: 214 },
  },
  lodging: {
    name: 'Sunrise PG',
    type: 'PG',
    beds: { total: 120, occupied: 96, vacant: 18, reserved: 6 },
    occupancyPct: 80,
    vacantPct: 15,
    reservedPct: 5,
    members: [
      { name: 'Rahul Sharma', room: 'Room 204', bed: 'Bed A', status: 'Occupied' },
      { name: 'Amit Patil', room: 'Room 203', bed: 'Bed B', status: 'Occupied' },
      { name: 'Sneha Joshi', room: 'Room 301', bed: 'Bed A', status: 'Occupied' },
    ],
  },
  mess: {
    name: 'Sunrise Mess',
    type: 'Mess',
    customers: 86,
    poll: 'Open poll',
    noResponse: 8,
    meals: [
      { name: 'Breakfast', prepare: 78, expected: 86 },
      { name: 'Lunch', prepare: 62, expected: 86 },
      { name: 'Dinner', prepare: 48, expected: 86 },
    ],
    breakfastDetail: {
      date: '22 Aug',
      expected: 86,
      prepare: 78,
      noResponse: 8,
      options: [
        { name: 'Vegetable Thali', count: 42 },
        { name: 'Rice + Dal', count: 21 },
        { name: 'Extra Roti', count: 15 },
      ],
      locations: [
        { name: 'Main dining', plates: 46 },
        { name: 'Block B', plates: 32 },
        { name: 'Other', plates: 8 },
      ],
    },
    customersList: [
      { name: 'Rahul Sharma', breakfast: true, lunch: true, dinner: false },
      { name: 'Vikram Kulkarni', breakfast: true, lunch: false, dinner: true },
      { name: 'Priya Desai', breakfast: false, lunch: true, dinner: true },
    ],
  },
  dues: {
    expected: '₹1,28,450',
    collected: '₹1,10,130',
    underReview: '₹8,320',
    pending: '₹10,000',
    collectedPct: 86,
    rows: [
      { name: 'Rahul Sharma', amount: '₹12,000' },
      { name: 'Amit Patil', amount: '₹10,000' },
      { name: 'Sneha Joshi', amount: '₹11,500' },
    ],
  },
  share: {
    menu: [
      { name: 'Breakfast', items: 'Poha, Chutney, Tea' },
      { name: 'Lunch', items: 'Veg Thali, Dal, Rice, Roti, Salad' },
      { name: 'Dinner', items: 'Paneer Curry, Jeera Rice, Roti, Salad' },
    ],
    payment: {
      name: 'Rahul Sharma',
      place: 'Room 204 · Bed A',
      month: 'August 2026',
      due: '25 Aug 2026',
      amount: '₹12,000',
    },
    mealPayment: {
      name: 'Priya Desai',
      place: 'Sunrise Mess',
      month: 'August 2026',
      due: '25 Aug 2026',
      amount: '₹4,800',
    },
    pollCustomer: {
      name: 'Vikram Kulkarni',
      choices: [
        { name: 'Breakfast', selected: true },
        { name: 'Lunch', selected: false },
        { name: 'Dinner', selected: true },
      ],
    },
  },
  complaints: {
    lodging: { title: 'AC not working', detail: 'Room 204', status: 'In progress' },
    mess: { title: 'Food quality', detail: 'Lunch', status: 'Open' },
  },
  inventory: {
    mess: [
      { name: 'Rice', status: 'Available' },
      { name: 'Dal', status: 'Available' },
      { name: 'Oil', status: 'Low' },
    ],
    lodging: [
      { name: 'Bed', status: 'In use' },
      { name: 'Furniture', status: 'Available' },
      { name: 'Appliance', status: 'Maintenance' },
    ],
  },
} as const;

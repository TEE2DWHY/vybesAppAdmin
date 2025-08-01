export interface User {
  _id: string;
  accountType: string;
  fullName: string;
  bio: string;
  email: string;
  location: string;
  premiumRate: string;
  userName: string;
  gender: string;
  phoneNumber: string;
  walletBalance: string;
  active: boolean;
  image: string;
  dateOfBirth: string;
  followers: {
    baddies: [string];
    vybers: [string];
  };
  following: {
    baddies: [string];
    vybers: [string];
  };
  hobbies: string[];
  height: string;
  weight: string;
  giftedCoins: string;
  isVerified: boolean;
  monthlySubscribers: any[];
  newUser: boolean;
  bookmarks: any[];
  cards: any[];
}

export interface Event {
  _id: string;
  eventType: string;
  name: string;
  location: string;
  description: string;
  ticketPurchased: number;
  dj: string[];
  image: string;
  tickets: Array<{
    type: string;
    price: number;
    available: number;
    _id: string;
  }>;
}

export interface Transaction {
  _id: string;
  sender: string;
  amount: string;
  transactionId: string;
  // status: string;
  transactionType: string;
  receiver: string;
  createdAt: string;
}

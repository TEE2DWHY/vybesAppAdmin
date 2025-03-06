export interface User {
  id: string;
  accountType: string;
  fullName: string;
  userName: string;
  gender: string;
  phoneNumber: string;
  walletBalance: string;
  active: boolean;
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

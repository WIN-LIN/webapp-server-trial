export interface User {
  id: number;
  username: string;
  email: string;
  passkey_type: string;
}

export interface Account {
  owner_id: User;
  chain_id: number;
  salt: string;
  account_address: string;
  entry_address: string;
}

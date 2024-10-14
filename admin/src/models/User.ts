export interface User {
  address: String,
  city: string,
  date: string,
  district: String,
  dob: string,
  email: string;
  gender: string,
  isVerified: boolean,
  phoneNumber: string;
  role?: Role;
  username: string;
  _id: string;
}

export interface Role {
  name: string;
}

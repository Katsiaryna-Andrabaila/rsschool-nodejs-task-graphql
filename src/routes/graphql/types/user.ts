export type UserType = {
  id: string;
  name: string;
  balance: number;
};

export type CreateUserType = Omit<UserType, 'id'>;

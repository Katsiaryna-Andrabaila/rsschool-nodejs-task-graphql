export type ProfileType = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export type CreateProfileType = Omit<ProfileType, 'id'>;

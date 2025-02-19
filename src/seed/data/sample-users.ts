import { Role } from '../../auth/interfaces';

export const sampleUsers = [
  {
    password: 'Super1234', // Plain text for demonstration; will be hashed during seeding
    full_name: 'Super User',
    roles: [Role.SUPER, Role.ADMIN, Role.USER],
  },
  {
    password: 'Admin1234', // Plain text for demonstration; will be hashed during seeding
    full_name: 'Admin User',
    roles: [Role.ADMIN, Role.USER],
  },
  {
    password: 'User1234', // Plain text for demonstration; will be hashed during seeding
    full_name: 'Regular User',
    roles: [Role.USER],
  },
];

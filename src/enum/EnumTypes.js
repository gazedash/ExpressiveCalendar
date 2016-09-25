export const USER_CONNECT = 'USER_CONNECT';
export const USER_DISCONNECT = 'USER_DISCONNECT';
export const USER_FIRST_CONNECT = 'USER_FIRST_CONNECT';

export const BOTH_WEEK = 'BOTH_WEEK';
export const ODD_WEEK = 'ODD_WEEK';
export const EVEN_WEEK = 'EVEN_WEEK';

// No auth required, can be found
export const PRIVACY_LEVEL_PUBLIC = 'PUBLIC';
// No auth, only by link
export const PRIVACY_LEVEL_LINK = 'LINK';
// Auth, only group of people (redis sets)
export const PRIVACY_LEVEL_GROUP = 'GROUP';
// Auth, only for user
export const PRIVACY_LEVEL_PRIVATE = 'PRIVATE';

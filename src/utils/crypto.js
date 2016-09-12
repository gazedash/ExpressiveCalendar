import crypto from 'crypto';
import { SECRET } from '../config/constant';

export function hash(data) {
  return crypto.createHmac('sha256', SECRET)
    .update(data)
    .digest('hex');
}

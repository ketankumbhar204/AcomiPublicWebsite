import { postJson } from './client';
import type { CreateMessRegistrationRequest, MessRegistrationResponse } from './types';

export function createMessRegistration(
  request: CreateMessRegistrationRequest,
): Promise<MessRegistrationResponse> {
  return postJson<MessRegistrationResponse>('/mess-registrations', request);
}

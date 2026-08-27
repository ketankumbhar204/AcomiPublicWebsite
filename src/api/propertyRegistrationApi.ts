import { postJson } from './client';
import type { CreatePropertyRegistrationRequest, PropertyRegistrationResponse } from './types';

export function createPropertyRegistration(
  request: CreatePropertyRegistrationRequest,
): Promise<PropertyRegistrationResponse> {
  return postJson<PropertyRegistrationResponse>('/property-registrations', request);
}

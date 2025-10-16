// types/tenant.types.ts

import { Plot } from './plot.types';
import { Room } from './room.types';

export interface TenantAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface TenantAddresses {
  permanent?: TenantAddress;
  current?: TenantAddress;
}

export interface TenantEmergency {
  name: string;
  relation: string;
  contact: string;
}

export interface TenantProfession {
  occupation?: string;
  officeAddress?: TenantAddress;
}

export interface TenantIdDocument {
  url: string;
  type: string;
}

export interface TenantIds {
  aadhar?: {
    front?: string;
    back?: string;
  };
  pan?: string;
  photo?: string;
  others?: TenantIdDocument[];
}

export interface TenantFamilyMember {
  name: string;
  age: number;
  relation: string;
  photo?: string;
  contact?: string;
}

export interface TenantAgreement {
  start: string;
  end: string;
  rent: number;
  deposit: number;
  document?: string;
  termsAccepted?: boolean;
}

export interface TenantAdditionalCharge {
  type: string;
  amount: number;
}

export interface TenantFinances {
  rent: number;
  billType?: 'included' | 'separate';
  additionalCharges?: TenantAdditionalCharge[];
  paymentMode?: 'cash' | 'online' | 'cheque';
}

export interface Tenant {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  addresses?: TenantAddresses;
  emergency: TenantEmergency;
  profession?: TenantProfession;
  ids?: TenantIds;
  family?: TenantFamilyMember[];
  agreement: TenantAgreement;
  finances: TenantFinances;
  roomId: string | Room;
  plotId: string | Plot;
  createdAt: string;
}

export interface CreateTenantData {
  name: string;
  mobile: string;
  email: string;
  addresses?: TenantAddresses;
  emergency: TenantEmergency;
  profession?: TenantProfession;
  family?: TenantFamilyMember[];
  agreement: TenantAgreement;
  finances: TenantFinances;
  roomId: string;
  plotId: string;
}

export interface UpdateTenantData {
  name?: string;
  mobile?: string;
  email?: string;
  addresses?: TenantAddresses;
  emergency?: TenantEmergency;
  profession?: TenantProfession;
  family?: TenantFamilyMember[];
  agreement?: TenantAgreement;
  finances?: TenantFinances;
}

export interface TenantFormData {
  // Basic Info
  name: string;
  mobile: string;
  email: string;
  
  // Addresses
  permanentStreet: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;
  permanentPincode: string;
  currentStreet: string;
  currentCity: string;
  currentState: string;
  currentCountry: string;
  currentPincode: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyRelation: string;
  emergencyContact: string;
  
  // Profession
  occupation: string;
  officeStreet: string;
  officeCity: string;
  officeState: string;
  officeCountry: string;
  officePincode: string;
  
  // Family Members
  familyMembers: TenantFamilyMember[];
  
  // Agreement
  agreementStart: string;
  agreementEnd: string;
  agreementRent: string;
  agreementDeposit: string;
  
  // Finances
  rent: string;
  billType: 'included' | 'separate';
  paymentMode: 'cash' | 'online' | 'cheque';
  additionalCharges: TenantAdditionalCharge[];
  
  // Assignment
  roomId: string;
  plotId: string;
}

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccessUserPayload = {
  __typename?: 'AccessUserPayload';
  access_token?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Role>>;
};

export type Attachment = {
  __typename?: 'Attachment';
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isLocked: Scalars['Boolean'];
  key?: Maybe<Scalars['String']>;
  metaType: MetaType;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type: AttachmentType;
  typeId: Scalars['String'];
  updatedAt: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type AttachmentMediaPayload = {
  __typename?: 'AttachmentMediaPayload';
  preSignedUrl?: Maybe<Scalars['String']>;
  response?: Maybe<ResponsePayload>;
};

export type AttachmentPayload = {
  __typename?: 'AttachmentPayload';
  attachment?: Maybe<Attachment>;
  response?: Maybe<ResponsePayload>;
};

/** The type is assigned */
export enum AttachmentType {
  BocaDocument = 'BOCA_DOCUMENT',
  Highlight = 'HIGHLIGHT',
  Location = 'LOCATION',
  Property = 'PROPERTY',
  Request = 'REQUEST'
}

export type AttachmentsPayload = {
  __typename?: 'AttachmentsPayload';
  attachments?: Maybe<Array<Maybe<Attachment>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type ContactInfo = {
  __typename?: 'ContactInfo';
  address1: Scalars['String'];
  address2?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  individualName: Scalars['String'];
  socialSecurityNumber: Scalars['String'];
  state: Scalars['String'];
  updatedAt: Scalars['String'];
  userId: Scalars['String'];
};

export type ContactInfoInput = {
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  individualName?: Maybe<Scalars['String']>;
  socialSecurityNumber?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  userId: Scalars['String'];
};

export type ContactInfoPayload = {
  __typename?: 'ContactInfoPayload';
  contactInfo?: Maybe<ContactInfo>;
  response?: Maybe<ResponsePayload>;
};

export type Content = {
  __typename?: 'Content';
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['String'];
  order: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ContentInput = {
  paginationOptions: PaginationInput;
};

export type ContentPayload = {
  __typename?: 'ContentPayload';
  content?: Maybe<Content>;
  response?: Maybe<ResponsePayload>;
};

export type ContentsPayload = {
  __typename?: 'ContentsPayload';
  content?: Maybe<Array<Maybe<Content>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type CreateAttachmentInput = {
  description?: Maybe<Scalars['String']>;
  /** enum type for document meta type - Upload Media */
  metaType: MetaType;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** enum type for module type - Upload Media */
  type: AttachmentType;
  typeId: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type CreateContentInput = {
  description: Scalars['String'];
  order: Scalars['Float'];
  title: Scalars['String'];
};

export type CreateEnvelopeInput = {
  envelopeArgs: EnvelopeArgs;
  membershipId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateFeatureInput = {
  name: Scalars['String'];
};

export type CreateHighLightInput = {
  description?: Maybe<Scalars['String']>;
  locationId: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type CreateLocationInput = {
  address: Scalars['String'];
  description: Scalars['String'];
  detailOverview: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type CreateMembershipInput = {
  annualManagementFee: Scalars['Float'];
  annualOperatingFee: Scalars['Float'];
  initialPayment: Scalars['Float'];
  name: Scalars['String'];
  noOfAdvanceNightsReservations: Scalars['Float'];
  noOfAllowedNights: Scalars['Float'];
  noOfConsecutiveNightsAllowed: Scalars['Float'];
  noOfProperties: Scalars['Float'];
  phaseId: Scalars['String'];
};

export type CreatePhaseInput = {
  name: Scalars['String'];
};

export type CreatePropertyInput = {
  address: Scalars['String'];
  description: Scalars['String'];
  detailOverview: Scalars['String'];
  features: Array<Scalars['String']>;
  locationId: Scalars['String'];
  name: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type CreateRequestInput = {
  description?: Maybe<Scalars['String']>;
  docuSignEnvelopeId?: Maybe<Scalars['String']>;
  membershipId: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateTagInput = {
  name: Scalars['String'];
};

export type EnvelopeArgs = {
  accountId?: Maybe<Scalars['String']>;
  basePath?: Maybe<Scalars['String']>;
  docFile?: Maybe<Scalars['String']>;
  dsPingUrl?: Maybe<Scalars['String']>;
  dsReturnUrl?: Maybe<Scalars['String']>;
  signerClientId: Scalars['String'];
  signerEmail: Scalars['String'];
  signerName: Scalars['String'];
  state?: Maybe<Scalars['String']>;
};

export type Feature = {
  __typename?: 'Feature';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type FeaturePayload = {
  __typename?: 'FeaturePayload';
  feature?: Maybe<Feature>;
  response?: Maybe<ResponsePayload>;
};

export type FeaturesInput = {
  paginationOptions: PaginationInput;
};

export type FeaturesPayload = {
  __typename?: 'FeaturesPayload';
  features?: Maybe<Array<Maybe<Feature>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type ForgotPasswordInput = {
  email: Scalars['String'];
};

export type ForgotPasswordPayload = {
  __typename?: 'ForgotPasswordPayload';
  response?: Maybe<ResponsePayload>;
};

export type GetAttachment = {
  typeId: Scalars['String'];
};

export type GetContent = {
  id: Scalars['String'];
};

export type GetFeature = {
  id: Scalars['String'];
};

export type GetHighLight = {
  id: Scalars['String'];
};

export type GetLocation = {
  id: Scalars['String'];
};

export type GetMedia = {
  id?: Maybe<Scalars['String']>;
};

export type GetMembership = {
  id: Scalars['String'];
};

export type GetPhase = {
  id: Scalars['String'];
};

export type GetProperty = {
  id: Scalars['String'];
};

export type GetRequest = {
  id: Scalars['String'];
};

export type GetTag = {
  id: Scalars['String'];
};

export type GetUser = {
  id: Scalars['String'];
};

export type GetUserRequest = {
  userId: Scalars['String'];
};

export type HighLight = {
  __typename?: 'HighLight';
  attachments?: Maybe<Array<Attachment>>;
  createdAt: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  location?: Maybe<Array<Location>>;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  url: Scalars['String'];
};

export type HighLightInput = {
  paginationOptions: PaginationInput;
};

export type HighLightPayload = {
  __typename?: 'HighLightPayload';
  highlight?: Maybe<HighLight>;
  response?: Maybe<ResponsePayload>;
};

export type HighLightsPayload = {
  __typename?: 'HighLightsPayload';
  highlights?: Maybe<Array<Maybe<HighLight>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type Location = {
  __typename?: 'Location';
  address: Scalars['String'];
  attachments?: Maybe<Array<Attachment>>;
  createdAt: Scalars['String'];
  description: Scalars['String'];
  detailOverview: Scalars['String'];
  highlights?: Maybe<Array<HighLight>>;
  id: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LocationPayload = {
  __typename?: 'LocationPayload';
  location?: Maybe<Location>;
  response?: Maybe<ResponsePayload>;
};

export type LocationsInput = {
  paginationOptions: PaginationInput;
};

export type LocationsPayload = {
  __typename?: 'LocationsPayload';
  locations?: Maybe<Array<Maybe<Location>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

export type LoginUserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Membership = {
  __typename?: 'Membership';
  annualManagementFee: Scalars['Float'];
  annualOperatingFee: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['String'];
  initialPayment: Scalars['Float'];
  name: Scalars['String'];
  noOfAdvanceNightsReservations: Scalars['Float'];
  noOfAllowedNights: Scalars['Float'];
  noOfConsecutiveNightsAllowed: Scalars['Float'];
  noOfProperties: Scalars['Float'];
  phase?: Maybe<Phase>;
  phaseId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type MembershipPayload = {
  __typename?: 'MembershipPayload';
  membership?: Maybe<Membership>;
  response?: Maybe<ResponsePayload>;
};

export type MembershipsInput = {
  id?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
};

export type MembershipsPayload = {
  __typename?: 'MembershipsPayload';
  memberships?: Maybe<Array<Maybe<Membership>>>;
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
};

/** The type is assigned */
export enum MetaType {
  BannerImage = 'BANNER_IMAGE',
  CollageImage = 'COLLAGE_IMAGE'
}

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: UserPayload;
  changeRequestStatus: RequestPayload;
  createAttachmentData: AttachmentPayload;
  createContent: ContentPayload;
  createEnvelopeForEmbeddedSigning: RequestPayload;
  createFeature: FeaturePayload;
  createHighLight: HighLightPayload;
  createLocation: LocationPayload;
  createMembership: MembershipPayload;
  createPhase: PhasePayload;
  createProperty: PropertyPayload;
  createRequest: RequestPayload;
  createTag: TagPayload;
  createUserContactInfo: ContactInfoPayload;
  deactivateUser: UserPayload;
  forgotPassword: ForgotPasswordPayload;
  getDocusignUrl: RequestPayload;
  initiateRequest: RequestPayload;
  login: AccessUserPayload;
  registerUser: UserPayload;
  removeAttachmentData: AttachmentPayload;
  removeContent: ContentPayload;
  removeEnvelopeId: RequestPayload;
  removeFeature: FeaturePayload;
  removeHighLight: HighLightPayload;
  removeLocation: LocationPayload;
  removeMembership: MembershipPayload;
  removePhase: PhasePayload;
  removeProperty: PropertyPayload;
  removeRequest: RequestPayload;
  removeTag: TagPayload;
  removeUser: UserPayload;
  resendVerificationEmail: UserPayload;
  resetPassword: UserPayload;
  updateAttachmentData: AttachmentPayload;
  updateContent: ContentPayload;
  updateFeature: FeaturePayload;
  updateHighLight: HighLightPayload;
  updateLocation: LocationPayload;
  updateMembership: MembershipPayload;
  updatePassword: UserPayload;
  updatePhase: PhasePayload;
  updatePhaseStatus: PhasePayload;
  updateProperty: PropertyPayload;
  updatePropertyFeature: FeaturePayload;
  updatePropertyTag: TagPayload;
  updateRole: UserPayload;
  updateTag: TagPayload;
  updateUser: UserPayload;
  updateUserPhase: UserPayload;
  verifyEmail: UserPayload;
};


export type MutationActivateUserArgs = {
  user: UserIdInput;
};


export type MutationChangeRequestStatusArgs = {
  updateRequestInput: UpdateRequestInput;
};


export type MutationCreateAttachmentDataArgs = {
  createAttachmentInput: CreateAttachmentInput;
};


export type MutationCreateContentArgs = {
  createContentInput: CreateContentInput;
};


export type MutationCreateEnvelopeForEmbeddedSigningArgs = {
  createEnvelopeInput: CreateEnvelopeInput;
};


export type MutationCreateFeatureArgs = {
  createFeatureInput: CreateFeatureInput;
};


export type MutationCreateHighLightArgs = {
  createHighLightInput: CreateHighLightInput;
};


export type MutationCreateLocationArgs = {
  createLocationInput: CreateLocationInput;
};


export type MutationCreateMembershipArgs = {
  createMembershipInput: CreateMembershipInput;
};


export type MutationCreatePhaseArgs = {
  CreatePhaseInput: CreatePhaseInput;
};


export type MutationCreatePropertyArgs = {
  createPropertyInput: CreatePropertyInput;
};


export type MutationCreateRequestArgs = {
  createRequestInput: CreateRequestInput;
};


export type MutationCreateTagArgs = {
  createTagInput: CreateTagInput;
};


export type MutationCreateUserContactInfoArgs = {
  contactInfoInput: ContactInfoInput;
};


export type MutationDeactivateUserArgs = {
  user: UserIdInput;
};


export type MutationForgotPasswordArgs = {
  forgotPassword: ForgotPasswordInput;
};


export type MutationGetDocusignUrlArgs = {
  createEnvelopeInput: CreateEnvelopeInput;
};


export type MutationInitiateRequestArgs = {
  updateRequestInput: UpdateRequestInput;
};


export type MutationLoginArgs = {
  loginUser: LoginUserInput;
};


export type MutationRegisterUserArgs = {
  user: RegisterUserInput;
};


export type MutationRemoveAttachmentDataArgs = {
  removeAttachment: RemoveAttachment;
};


export type MutationRemoveContentArgs = {
  removeContent: RemoveContent;
};


export type MutationRemoveEnvelopeIdArgs = {
  removeEnvelopeId: RemoveEnvelopeId;
};


export type MutationRemoveFeatureArgs = {
  removeFeature: RemoveFeature;
};


export type MutationRemoveHighLightArgs = {
  removeHighLight: RemoveHighLight;
};


export type MutationRemoveLocationArgs = {
  removeLocation: RemoveLocation;
};


export type MutationRemoveMembershipArgs = {
  removeMembership: RemoveMembership;
};


export type MutationRemovePhaseArgs = {
  removePhase: RemovePhase;
};


export type MutationRemovePropertyArgs = {
  removeProperty: RemoveProperty;
};


export type MutationRemoveRequestArgs = {
  removeRequest: RemoveRequest;
};


export type MutationRemoveTagArgs = {
  removeTag: RemoveTag;
};


export type MutationRemoveUserArgs = {
  user: UserIdInput;
};


export type MutationResendVerificationEmailArgs = {
  resendVerificationEmail: ResendVerificationEmail;
};


export type MutationResetPasswordArgs = {
  resetPassword: ResetPasswordInput;
};


export type MutationUpdateAttachmentDataArgs = {
  updateAttachmentInput: UpdateAttachmentInput;
};


export type MutationUpdateContentArgs = {
  updateContentInput: UpdateContentInput;
};


export type MutationUpdateFeatureArgs = {
  updateFeatureInput: UpdateFeatureInput;
};


export type MutationUpdateHighLightArgs = {
  updateHighLightInput: UpdateHighLightInput;
};


export type MutationUpdateLocationArgs = {
  updateLocationInput: UpdateLocationInput;
};


export type MutationUpdateMembershipArgs = {
  updateMembershipInput: UpdateMembershipInput;
};


export type MutationUpdatePasswordArgs = {
  updatePasswordInput: UpdatePasswordInput;
};


export type MutationUpdatePhaseArgs = {
  updatePhaseInput: UpdatePhaseInput;
};


export type MutationUpdatePhaseStatusArgs = {
  updatePhaseStatusInput: UpdatePhaseStatusInput;
};


export type MutationUpdatePropertyArgs = {
  updatePropertyInput: UpdatePropertyInput;
};


export type MutationUpdatePropertyFeatureArgs = {
  updatePropertyFeatureInput: UpdatePropertyFeatureInput;
};


export type MutationUpdatePropertyTagArgs = {
  updatePropertyTagInput: UpdatePropertyTagInput;
};


export type MutationUpdateRoleArgs = {
  user: UpdateRoleInput;
};


export type MutationUpdateTagArgs = {
  updateTagInput: UpdateTagInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput;
};


export type MutationUpdateUserPhaseArgs = {
  updateUserPhaseInput: UpdateUserPhaseInput;
};


export type MutationVerifyEmailArgs = {
  verifyEmail: VerifyEmailInput;
};

export type NextRole = {
  __typename?: 'NextRole';
  states?: Maybe<Array<Maybe<RoleStates>>>;
};

export type PaginationInput = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};

export type PaginationPayload = {
  __typename?: 'PaginationPayload';
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type Phase = {
  __typename?: 'Phase';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  isCurrentPhase: Scalars['Boolean'];
  name: Scalars['String'];
  order: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type PhasePayload = {
  __typename?: 'PhasePayload';
  phase?: Maybe<Phase>;
  response?: Maybe<ResponsePayload>;
};

export type PhasesInput = {
  paginationOptions: PaginationInput;
};

export type PhasesPayload = {
  __typename?: 'PhasesPayload';
  pagination?: Maybe<PaginationPayload>;
  phases?: Maybe<Array<Maybe<Phase>>>;
  response?: Maybe<ResponsePayload>;
};

export type PropertiesInput = {
  paginationOptions: PaginationInput;
};

export type PropertiesPayload = {
  __typename?: 'PropertiesPayload';
  pagination?: Maybe<PaginationPayload>;
  properties?: Maybe<Array<Maybe<Property>>>;
  response?: Maybe<ResponsePayload>;
};

export type Property = {
  __typename?: 'Property';
  address: Scalars['String'];
  attachments?: Maybe<Array<Attachment>>;
  createdAt: Scalars['String'];
  description: Scalars['String'];
  detailOverview: Scalars['String'];
  features?: Maybe<Array<Maybe<Feature>>>;
  id: Scalars['String'];
  location?: Maybe<Location>;
  name: Scalars['String'];
  tags?: Maybe<Array<Maybe<Tag>>>;
  updatedAt: Scalars['String'];
};

export type PropertyPayload = {
  __typename?: 'PropertyPayload';
  pagination?: Maybe<PaginationPayload>;
  property?: Maybe<Property>;
  response?: Maybe<ResponsePayload>;
};

export type Query = {
  __typename?: 'Query';
  GetWireTransferInfo: WireTransferInfoPayload;
  fetchAllRoles: RolesPayload;
  fetchAllUsers: UsersPayload;
  fetchUser: UserPayload;
  findAllContent: ContentsPayload;
  findAllFeatures: FeaturesPayload;
  findAllHighLights: HighLightsPayload;
  findAllLocations: LocationsPayload;
  findAllMemberships: MembershipsPayload;
  findAllPhases: PhasesPayload;
  findAllProperties: PropertiesPayload;
  findAllTags: TagsPayload;
  getAllRequests: RequestsPayload;
  getAttachment: AttachmentMediaPayload;
  getAttachments: AttachmentsPayload;
  getContent: ContentPayload;
  getFeature: FeaturePayload;
  getHighLight: HighLightPayload;
  getLocation: LocationPayload;
  getMembership: MembershipPayload;
  getPhase: PhasePayload;
  getProperty: PropertyPayload;
  getRequest: RequestPayload;
  getTag: TagPayload;
  getUser: UserPayload;
  getUserRequest: RequestPayload;
  me: UserPayload;
  searchUser: UsersPayload;
};


export type QueryGetWireTransferInfoArgs = {
  wiretransferInfoInput: WiretransferInfoInput;
};


export type QueryFetchAllUsersArgs = {
  userInput: UsersInput;
};


export type QueryFindAllContentArgs = {
  contentInput: ContentInput;
};


export type QueryFindAllFeaturesArgs = {
  featuresInput: FeaturesInput;
};


export type QueryFindAllHighLightsArgs = {
  highLightInput: HighLightInput;
};


export type QueryFindAllLocationsArgs = {
  locationsInput: LocationsInput;
};


export type QueryFindAllMembershipsArgs = {
  membershipsInput: MembershipsInput;
};


export type QueryFindAllPhasesArgs = {
  phasesInput: PhasesInput;
};


export type QueryFindAllPropertiesArgs = {
  propertiesInput: PropertiesInput;
};


export type QueryFindAllTagsArgs = {
  tagsInput: TagsInput;
};


export type QueryGetAllRequestsArgs = {
  requestsInput: RequestsInput;
};


export type QueryGetAttachmentArgs = {
  getMedia: GetMedia;
};


export type QueryGetAttachmentsArgs = {
  getAttachment: GetAttachment;
};


export type QueryGetContentArgs = {
  getContent: GetContent;
};


export type QueryGetFeatureArgs = {
  getFeature: GetFeature;
};


export type QueryGetHighLightArgs = {
  getHighLight: GetHighLight;
};


export type QueryGetLocationArgs = {
  getLocation: GetLocation;
};


export type QueryGetMembershipArgs = {
  getMembership: GetMembership;
};


export type QueryGetPhaseArgs = {
  getPhase: GetPhase;
};


export type QueryGetPropertyArgs = {
  getProperty: GetProperty;
};


export type QueryGetRequestArgs = {
  getRequest: GetRequest;
};


export type QueryGetTagArgs = {
  getTag: GetTag;
};


export type QueryGetUserArgs = {
  getUser: GetUser;
};


export type QueryGetUserRequestArgs = {
  getUserRequest: GetUserRequest;
};


export type QuerySearchUserArgs = {
  search: Scalars['String'];
};

export type RegisterUserInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  /** Send Investor Type from the ENUM - Sign-up */
  roleType?: Maybe<UserRole>;
  zipCode: Scalars['String'];
};

export type RemoveAttachment = {
  id?: Maybe<Scalars['String']>;
};

export type RemoveContent = {
  id: Scalars['String'];
};

export type RemoveEnvelopeId = {
  id: Scalars['String'];
};

export type RemoveFeature = {
  id: Scalars['String'];
};

export type RemoveHighLight = {
  id: Scalars['String'];
};

export type RemoveLocation = {
  id: Scalars['String'];
};

export type RemoveMembership = {
  id: Scalars['String'];
};

export type RemovePhase = {
  id: Scalars['String'];
};

export type RemoveProperty = {
  id: Scalars['String'];
};

export type RemoveRequest = {
  id: Scalars['String'];
};

export type RemoveTag = {
  id: Scalars['String'];
};

export type Request = {
  __typename?: 'Request';
  attachments?: Maybe<Array<Attachment>>;
  createdAt: Scalars['String'];
  description: Scalars['String'];
  docuSignEnvelopeId?: Maybe<Scalars['String']>;
  envelopeExpiry: Scalars['String'];
  id: Scalars['String'];
  membership?: Maybe<Membership>;
  membershipId: Scalars['String'];
  requestStatus: RequestStatus;
  signedDocumentUrl?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
  userId: Scalars['String'];
};

export type RequestPayload = {
  __typename?: 'RequestPayload';
  request?: Maybe<Request>;
  response?: Maybe<ResponsePayload>;
};

/** user request status */
export enum RequestStatus {
  Approved = 'APPROVED',
  Declined = 'DECLINED',
  InProgress = 'IN_PROGRESS',
  RequestInitiated = 'REQUEST_INITIATED',
  UpdateDone = 'UPDATE_DONE',
  UpdateNeed = 'UPDATE_NEED'
}

export type RequestsInput = {
  MembershipPlan?: Maybe<Scalars['String']>;
  paginationOptions: PaginationInput;
  requestStatus?: Maybe<Scalars['String']>;
  requestType?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type RequestsPayload = {
  __typename?: 'RequestsPayload';
  pagination?: Maybe<PaginationPayload>;
  requests?: Maybe<Array<Maybe<Request>>>;
  response?: Maybe<ResponsePayload>;
};

export type ResendVerificationEmail = {
  email?: Maybe<Scalars['String']>;
};

export type ResetPasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
};

export type ResponsePayload = {
  __typename?: 'ResponsePayload';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
};

export type ResponsePropertiesPayload = {
  __typename?: 'ResponsePropertiesPayload';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Float']>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  nextRole: NextRole;
  role: UserRole;
  updatedAt: Scalars['String'];
};

export type RoleStates = {
  __typename?: 'RoleStates';
  action: Scalars['String'];
  role: UserRole;
};

export type RolesPayload = {
  __typename?: 'RolesPayload';
  response?: Maybe<ResponsePayload>;
  roles?: Maybe<Array<Maybe<Role>>>;
};

export type Tag = {
  __typename?: 'Tag';
  createdAt: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type TagPayload = {
  __typename?: 'TagPayload';
  response?: Maybe<ResponsePayload>;
  tag?: Maybe<Tag>;
};

export type TagsInput = {
  paginationOptions: PaginationInput;
};

export type TagsPayload = {
  __typename?: 'TagsPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type UpdateAttachmentInput = {
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** enum type for document meta type - Upload Media */
  metaType?: Maybe<MetaType>;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** enum type for module type - Upload Media */
  type?: Maybe<AttachmentType>;
  typeId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateContentInput = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  order?: Maybe<Scalars['Float']>;
  title?: Maybe<Scalars['String']>;
};

export type UpdateFeatureInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateHighLightInput = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  locationId?: Maybe<Scalars['String']>;
  subTitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type UpdateLocationInput = {
  address?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  detailOverview?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type UpdateMembershipInput = {
  annualManagementFee?: Maybe<Scalars['Float']>;
  annualOperatingFee?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  initialPayment?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  noOfAdvanceNightsReservations?: Maybe<Scalars['Float']>;
  noOfAllowedNights?: Maybe<Scalars['Float']>;
  noOfConsecutiveNightsAllowed?: Maybe<Scalars['Float']>;
  noOfProperties?: Maybe<Scalars['Float']>;
  phaseId?: Maybe<Scalars['String']>;
};

export type UpdatePasswordInput = {
  id: Scalars['String'];
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type UpdatePhaseInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdatePhaseStatusInput = {
  id: Scalars['String'];
};

export type UpdatePropertyFeatureInput = {
  features: Array<Scalars['String']>;
  propertyId: Scalars['String'];
};

export type UpdatePropertyInput = {
  address?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  detailOverview?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Scalars['String']>>;
  id: Scalars['String'];
  locationId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
};

export type UpdatePropertyTagInput = {
  propertyId: Scalars['String'];
  tags: Array<Scalars['String']>;
};

export type UpdateRequestInput = {
  description?: Maybe<Scalars['String']>;
  docuSignEnvelopeId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  membershipId?: Maybe<Scalars['String']>;
  requestStatus: RequestStatus;
  signedDocumentUrl?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type UpdateRoleInput = {
  id: Scalars['String'];
  roles: Array<UserRole>;
};

export type UpdateTagInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateUserPhaseInput = {
  id: Scalars['String'];
  phaseId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  contactInfo?: Maybe<ContactInfo>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  emailVerified: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  membership?: Maybe<Membership>;
  phase?: Maybe<Phase>;
  phone: Scalars['String'];
  roles?: Maybe<Array<Maybe<Role>>>;
  status: UserStatus;
  updatedAt: Scalars['String'];
  zipCode?: Maybe<Scalars['String']>;
};

export type UserIdInput = {
  isEnabled?: Maybe<Scalars['Boolean']>;
  userId: Scalars['String'];
};

export type UserPayload = {
  __typename?: 'UserPayload';
  response?: Maybe<ResponsePayload>;
  user?: Maybe<User>;
};

/** The user role assigned */
export enum UserRole {
  Admin = 'ADMIN',
  Investor = 'INVESTOR',
  Owner = 'OWNER',
  PropertyManager = 'PROPERTY_MANAGER',
  RelationshipManager = 'RELATIONSHIP_MANAGER',
  Staff = 'STAFF',
  SuperAdmin = 'SUPER_ADMIN'
}

/** The user status */
export enum UserStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED'
}

export type UsersInput = {
  paginationOptions: PaginationInput;
  role?: Maybe<UserRole>;
  status?: Maybe<UserStatus>;
};

export type UsersPayload = {
  __typename?: 'UsersPayload';
  pagination?: Maybe<PaginationPayload>;
  response?: Maybe<ResponsePayload>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type VerifyEmailInput = {
  token: Scalars['String'];
};

export type WireTransferInfoPayload = {
  __typename?: 'WireTransferInfoPayload';
  response?: Maybe<ResponsePayload>;
  wireTransferInfo?: Maybe<Array<Maybe<WireTransferInfo>>>;
};

export type WiretransferInfoInput = {
  paginationOptions: PaginationInput;
};

export type WireTransferInfo = {
  __typename?: 'wireTransferInfo';
  accountHolder: Scalars['String'];
  accountId: Scalars['String'];
  accountNo: Scalars['String'];
  bankName: Scalars['String'];
  branchCode: Scalars['String'];
  createdAt: Scalars['String'];
  ibn: Scalars['String'];
  id: Scalars['String'];
  swiftCode: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  loginUser: LoginUserInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessUserPayload', access_token?: Maybe<string>, response?: Maybe<{ __typename?: 'ResponsePayload', message?: Maybe<string>, status?: Maybe<number> }>, roles?: Maybe<Array<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>> } };

export type GetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggedInUserQuery = { __typename?: 'Query', me: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, zipCode?: Maybe<string>, phone: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }> } };

export type ForgetPasswordMutationVariables = Exact<{
  forgotPasswordInput: ForgotPasswordInput;
}>;


export type ForgetPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, message?: Maybe<string>, status?: Maybe<number> }> } };

export type ResetPasswordMutationVariables = Exact<{
  resetPassword: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, zipCode?: Maybe<string>, phone: string, createdAt: string, updatedAt: string, emailVerified: boolean, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>, response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type RegisterUserMutationVariables = Exact<{
  user: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserPayload', user?: Maybe<{ __typename?: 'User', id: string, email: string, firstName: string, lastName: string, status: UserStatus, emailVerified: boolean }>, response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type EmailVerificationMutationVariables = Exact<{
  verifyEmail: VerifyEmailInput;
}>;


export type EmailVerificationMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type ResendVerificationEmailMutationVariables = Exact<{
  resendVerificationEmail: ResendVerificationEmail;
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }> } };

export type CreateFeatureMutationVariables = Exact<{
  createFeatureInput: CreateFeatureInput;
}>;


export type CreateFeatureMutation = { __typename?: 'Mutation', createFeature: { __typename?: 'FeaturePayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, feature?: Maybe<{ __typename?: 'Feature', id: string, name: string, updatedAt: string, createdAt: string }> } };

export type UpdateFeatureMutationVariables = Exact<{
  updateFeatureInput: UpdateFeatureInput;
}>;


export type UpdateFeatureMutation = { __typename?: 'Mutation', updateFeature: { __typename?: 'FeaturePayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, feature?: Maybe<{ __typename?: 'Feature', id: string, name: string, updatedAt: string, createdAt: string }> } };

export type RemoveFeatureMutationVariables = Exact<{
  removeFeature: RemoveFeature;
}>;


export type RemoveFeatureMutation = { __typename?: 'Mutation', removeFeature: { __typename?: 'FeaturePayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type FindAllFeaturesQueryVariables = Exact<{
  featuresInput: FeaturesInput;
}>;


export type FindAllFeaturesQuery = { __typename?: 'Query', findAllFeatures: { __typename?: 'FeaturesPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, features?: Maybe<Array<Maybe<{ __typename?: 'Feature', id: string, name: string, createdAt: string, updatedAt: string }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type GetFeatureQueryVariables = Exact<{
  getFeature: GetFeature;
}>;


export type GetFeatureQuery = { __typename?: 'Query', getFeature: { __typename?: 'FeaturePayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, feature?: Maybe<{ __typename?: 'Feature', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type CreateLocationMutationVariables = Exact<{
  createLocationInput: CreateLocationInput;
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation: { __typename?: 'LocationPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, location?: Maybe<{ __typename?: 'Location', id: string, name: string, description: string, latitude?: Maybe<number>, longitude?: Maybe<number>, detailOverview: string, updatedAt: string, createdAt: string }> } };

export type RemoveLocationMutationVariables = Exact<{
  removeLocation: RemoveLocation;
}>;


export type RemoveLocationMutation = { __typename?: 'Mutation', removeLocation: { __typename?: 'LocationPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type FindAllLocationsQueryVariables = Exact<{
  locationsInput: LocationsInput;
}>;


export type FindAllLocationsQuery = { __typename?: 'Query', findAllLocations: { __typename?: 'LocationsPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }>, locations?: Maybe<Array<Maybe<{ __typename?: 'Location', id: string, name: string, description: string, latitude?: Maybe<number>, longitude?: Maybe<number>, detailOverview: string, address: string, updatedAt: string, createdAt: string, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, title?: Maybe<string>, subTitle?: Maybe<string>, description?: Maybe<string>, type: AttachmentType, metaType: MetaType, key?: Maybe<string>, typeId: string, url?: Maybe<string>, isLocked: boolean, createdAt: string, updatedAt: string }>> }>>> } };

export type GetLocationQueryVariables = Exact<{
  getLocation: GetLocation;
}>;


export type GetLocationQuery = { __typename?: 'Query', getLocation: { __typename?: 'LocationPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, location?: Maybe<{ __typename?: 'Location', id: string, name: string, description: string, longitude?: Maybe<number>, latitude?: Maybe<number>, address: string, detailOverview: string, createdAt: string, updatedAt: string, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, title?: Maybe<string>, subTitle?: Maybe<string>, description?: Maybe<string>, type: AttachmentType, metaType: MetaType, key?: Maybe<string>, typeId: string, url?: Maybe<string>, isLocked: boolean, createdAt: string, updatedAt: string }>> }> } };

export type UpdateLocationMutationVariables = Exact<{
  updateLocationInput: UpdateLocationInput;
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'LocationPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }> } };

export type CreateAttachmentDataMutationVariables = Exact<{
  createAttachmentInput: CreateAttachmentInput;
}>;


export type CreateAttachmentDataMutation = { __typename?: 'Mutation', createAttachmentData: { __typename?: 'AttachmentPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, attachment?: Maybe<{ __typename?: 'Attachment', id: string, title?: Maybe<string> }> } };

export type RemoveAttachmentDataMutationVariables = Exact<{
  removeAttachment: RemoveAttachment;
}>;


export type RemoveAttachmentDataMutation = { __typename?: 'Mutation', removeAttachmentData: { __typename?: 'AttachmentPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type UpdateAttachmentDataMutationVariables = Exact<{
  updateAttachmentInput: UpdateAttachmentInput;
}>;


export type UpdateAttachmentDataMutation = { __typename?: 'Mutation', updateAttachmentData: { __typename?: 'AttachmentPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, name?: Maybe<string>, message?: Maybe<string> }>, attachment?: Maybe<{ __typename?: 'Attachment', id: string, title?: Maybe<string>, subTitle?: Maybe<string>, description?: Maybe<string>, type: AttachmentType, metaType: MetaType, typeId: string, key?: Maybe<string>, url?: Maybe<string>, isLocked: boolean, createdAt: string, updatedAt: string }> } };

export type CreateHighlightMutationVariables = Exact<{
  createHighLightInput: CreateHighLightInput;
}>;


export type CreateHighlightMutation = { __typename?: 'Mutation', createHighLight: { __typename?: 'HighLightPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, highlight?: Maybe<{ __typename?: 'HighLight', id: string }> } };

export type GetAttachmentQueryVariables = Exact<{
  getMedia: GetMedia;
}>;


export type GetAttachmentQuery = { __typename?: 'Query', getAttachment: { __typename?: 'AttachmentMediaPayload', preSignedUrl?: Maybe<string>, response?: Maybe<{ __typename?: 'ResponsePayload', message?: Maybe<string> }> } };

export type UpdateRequestMutationVariables = Exact<{
  updateRequestInput: UpdateRequestInput;
}>;


export type UpdateRequestMutation = { __typename?: 'Mutation', changeRequestStatus: { __typename?: 'RequestPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, request?: Maybe<{ __typename?: 'Request', id: string, url?: Maybe<string>, userId: string, createdAt: string, updatedAt: string, description: string, membershipId: string, requestStatus: RequestStatus, envelopeExpiry: string, signedDocumentUrl?: Maybe<string>, docuSignEnvelopeId?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, email: string, phone: string, status: UserStatus, zipCode?: Maybe<string>, lastName: string, firstName: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>, membership?: Maybe<{ __typename?: 'Membership', id: string, name: string, phaseId: string, createdAt: string, updatedAt: string, initialPayment: number, noOfProperties: number, noOfAllowedNights: number, annualOperatingFee: number, annualManagementFee: number, noOfConsecutiveNightsAllowed: number, noOfAdvanceNightsReservations: number, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> }>, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, url?: Maybe<string>, type: AttachmentType, typeId: string, isLocked: boolean, metaType: MetaType, description?: Maybe<string>, createdAt: string, updatedAt: string }>> }> } };

export type GetUserMembershipRequestQueryVariables = Exact<{
  getRequest: GetRequest;
}>;


export type GetUserMembershipRequestQuery = { __typename?: 'Query', getRequest: { __typename?: 'RequestPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, request?: Maybe<{ __typename?: 'Request', id: string, url?: Maybe<string>, userId: string, createdAt: string, updatedAt: string, description: string, membershipId: string, requestStatus: RequestStatus, envelopeExpiry: string, signedDocumentUrl?: Maybe<string>, docuSignEnvelopeId?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, zipCode?: Maybe<string>, phone: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>, membership?: Maybe<{ __typename?: 'Membership', id: string, name: string, initialPayment: number, annualOperatingFee: number, annualManagementFee: number, noOfAllowedNights: number, noOfProperties: number, noOfAdvanceNightsReservations: number, noOfConsecutiveNightsAllowed: number, phaseId: string, createdAt: string, updatedAt: string, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> }>, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, url?: Maybe<string>, type: AttachmentType, description?: Maybe<string>, metaType: MetaType, typeId: string, isLocked: boolean, createdAt: string, updatedAt: string }>> }> } };

export type FindAllRequestsQueryVariables = Exact<{
  requestsInput: RequestsInput;
}>;


export type FindAllRequestsQuery = { __typename?: 'Query', getAllRequests: { __typename?: 'RequestsPayload', response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, requests?: Maybe<Array<Maybe<{ __typename?: 'Request', id: string, url?: Maybe<string>, userId: string, createdAt: string, updatedAt: string, description: string, membershipId: string, requestStatus: RequestStatus, envelopeExpiry: string, signedDocumentUrl?: Maybe<string>, docuSignEnvelopeId?: Maybe<string>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, zipCode?: Maybe<string>, phone: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>, membership?: Maybe<{ __typename?: 'Membership', id: string, name: string, phaseId: string, createdAt: string, updatedAt: string, noOfProperties: number, initialPayment: number, noOfAllowedNights: number, annualOperatingFee: number, annualManagementFee: number, noOfConsecutiveNightsAllowed: number, noOfAdvanceNightsReservations: number, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> }>, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, url?: Maybe<string>, type: AttachmentType, description?: Maybe<string>, metaType: MetaType, typeId: string, isLocked: boolean, createdAt: string, updatedAt: string }>> }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type GetMembershipQueryVariables = Exact<{
  getMembership: GetMembership;
}>;


export type GetMembershipQuery = { __typename?: 'Query', getMembership: { __typename?: 'MembershipPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, membership?: Maybe<{ __typename?: 'Membership', id: string, name: string, initialPayment: number, annualOperatingFee: number, annualManagementFee: number, noOfProperties: number, noOfAllowedNights: number, noOfAdvanceNightsReservations: number, noOfConsecutiveNightsAllowed: number, phaseId: string, createdAt: string, updatedAt: string, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> }> } };

export type FindAllMembershipsQueryVariables = Exact<{
  membershipsInput: MembershipsInput;
}>;


export type FindAllMembershipsQuery = { __typename?: 'Query', findAllMemberships: { __typename?: 'MembershipsPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, memberships?: Maybe<Array<Maybe<{ __typename?: 'Membership', id: string, name: string, phaseId: string, createdAt: string, updatedAt: string, noOfProperties: number, initialPayment: number, annualOperatingFee: number, annualManagementFee: number, noOfAllowedNights: number, noOfAdvanceNightsReservations: number, noOfConsecutiveNightsAllowed: number, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type RemoveRequestMutationVariables = Exact<{
  removeRequest: RemoveRequest;
}>;


export type RemoveRequestMutation = { __typename?: 'Mutation', removeRequest: { __typename?: 'RequestPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, request?: Maybe<{ __typename?: 'Request', id: string, url?: Maybe<string>, userId: string, createdAt: string, updatedAt: string, description: string, membershipId: string, requestStatus: RequestStatus, envelopeExpiry: string, signedDocumentUrl?: Maybe<string>, docuSignEnvelopeId?: Maybe<string> }> } };

export type GetUserRequestQueryVariables = Exact<{
  getUserRequest: GetUserRequest;
}>;


export type GetUserRequestQuery = { __typename?: 'Query', getUserRequest: { __typename?: 'RequestPayload', response?: Maybe<{ __typename?: 'ResponsePayload', error?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string> }>, request?: Maybe<{ __typename?: 'Request', id: string, url?: Maybe<string>, userId: string, createdAt: string, updatedAt: string, description: string, membershipId: string, requestStatus: RequestStatus, envelopeExpiry: string, signedDocumentUrl?: Maybe<string>, docuSignEnvelopeId?: Maybe<string> }> } };

export type FindAllPhasesQueryVariables = Exact<{
  phasesInput: PhasesInput;
}>;


export type FindAllPhasesQuery = { __typename?: 'Query', findAllPhases: { __typename?: 'PhasesPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string> }>, phases?: Maybe<Array<Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, updatedAt: string, createdAt: string }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type UpdatePhaseStatusMutationVariables = Exact<{
  updatePhaseStatusInput: UpdatePhaseStatusInput;
}>;


export type UpdatePhaseStatusMutation = { __typename?: 'Mutation', updatePhaseStatus: { __typename?: 'PhasePayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }> } };

export type GetPropertyQueryVariables = Exact<{
  getProperty: GetProperty;
}>;


export type GetPropertyQuery = { __typename?: 'Query', getProperty: { __typename?: 'PropertyPayload', property?: Maybe<{ __typename?: 'Property', id: string, name: string, address: string, description: string, detailOverview: string, createdAt: string, updatedAt: string, location?: Maybe<{ __typename?: 'Location', id: string, name: string, description: string, longitude?: Maybe<number>, latitude?: Maybe<number>, address: string, detailOverview: string, createdAt: string, updatedAt: string }>, tags?: Maybe<Array<Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }>>>, features?: Maybe<Array<Maybe<{ __typename?: 'Feature', id: string, name: string, updatedAt: string, createdAt: string }>>>, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, title?: Maybe<string>, subTitle?: Maybe<string>, description?: Maybe<string>, type: AttachmentType, metaType: MetaType, key?: Maybe<string>, typeId: string, url?: Maybe<string>, isLocked: boolean, createdAt: string, updatedAt: string }>> }> } };

export type GetAllPropertiesQueryVariables = Exact<{
  propertiesInput: PropertiesInput;
}>;


export type GetAllPropertiesQuery = { __typename?: 'Query', findAllProperties: { __typename?: 'PropertiesPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }>, properties?: Maybe<Array<Maybe<{ __typename?: 'Property', id: string, name: string, address: string, description: string, detailOverview: string, createdAt: string, updatedAt: string, location?: Maybe<{ __typename?: 'Location', id: string, name: string, description: string, longitude?: Maybe<number>, latitude?: Maybe<number>, address: string, detailOverview: string, updatedAt: string, createdAt: string }>, tags?: Maybe<Array<Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }>>>, features?: Maybe<Array<Maybe<{ __typename?: 'Feature', id: string, name: string, updatedAt: string, createdAt: string }>>> }>>> } };

export type CreatePropertyMutationVariables = Exact<{
  createPropertyInput: CreatePropertyInput;
}>;


export type CreatePropertyMutation = { __typename?: 'Mutation', createProperty: { __typename?: 'PropertyPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }>, property?: Maybe<{ __typename?: 'Property', id: string, name: string }> } };

export type UpdatePropertyMutationVariables = Exact<{
  updatePropertyInput: UpdatePropertyInput;
}>;


export type UpdatePropertyMutation = { __typename?: 'Mutation', updateProperty: { __typename?: 'PropertyPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }>, property?: Maybe<{ __typename?: 'Property', id: string, name: string, address: string, description: string, detailOverview: string, createdAt: string, updatedAt: string, location?: Maybe<{ __typename?: 'Location', id: string, name: string, description: string, longitude?: Maybe<number>, latitude?: Maybe<number>, address: string, detailOverview: string, createdAt: string, updatedAt: string }>, tags?: Maybe<Array<Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }>>>, features?: Maybe<Array<Maybe<{ __typename?: 'Feature', id: string, name: string, updatedAt: string, createdAt: string }>>>, attachments?: Maybe<Array<{ __typename?: 'Attachment', id: string, url?: Maybe<string>, key?: Maybe<string>, type: AttachmentType, title?: Maybe<string>, subTitle?: Maybe<string>, description?: Maybe<string>, metaType: MetaType, typeId: string, isLocked: boolean, createdAt: string, updatedAt: string }>> }> } };

export type RemovePropertyMutationVariables = Exact<{
  removeProperty: RemoveProperty;
}>;


export type RemovePropertyMutation = { __typename?: 'Mutation', removeProperty: { __typename?: 'PropertyPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }>, property?: Maybe<{ __typename?: 'Property', id: string }> } };

export type UpdatePropertyFeaturesMutationVariables = Exact<{
  updatePropertyFeatureInput: UpdatePropertyFeatureInput;
}>;


export type UpdatePropertyFeaturesMutation = { __typename?: 'Mutation', updatePropertyFeature: { __typename?: 'FeaturePayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }>, feature?: Maybe<{ __typename?: 'Feature', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type UpdatePropertyTagsMutationVariables = Exact<{
  updatePropertyTagInput: UpdatePropertyTagInput;
}>;


export type UpdatePropertyTagsMutation = { __typename?: 'Mutation', updatePropertyTag: { __typename?: 'TagPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string>, name?: Maybe<string> }>, tag?: Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type CreateTagMutationVariables = Exact<{
  createTagInput: CreateTagInput;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag: { __typename?: 'TagPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, tag?: Maybe<{ __typename?: 'Tag', id: string, name: string, updatedAt: string, createdAt: string }> } };

export type UpdateTagMutationVariables = Exact<{
  updateTagInput: UpdateTagInput;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag: { __typename?: 'TagPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, tag?: Maybe<{ __typename?: 'Tag', id: string, name: string, updatedAt: string, createdAt: string }> } };

export type RemoveTagMutationVariables = Exact<{
  removeTag: RemoveTag;
}>;


export type RemoveTagMutation = { __typename?: 'Mutation', removeTag: { __typename?: 'TagPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }> } };

export type FindAllTagsQueryVariables = Exact<{
  tagsInput: TagsInput;
}>;


export type FindAllTagsQuery = { __typename?: 'Query', findAllTags: { __typename?: 'TagsPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, tags?: Maybe<Array<Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type GetTagQueryQueryVariables = Exact<{
  getTag: GetTag;
}>;


export type GetTagQueryQuery = { __typename?: 'Query', getTag: { __typename?: 'TagPayload', response?: Maybe<{ __typename?: 'ResponsePayload', name?: Maybe<string>, status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, tag?: Maybe<{ __typename?: 'Tag', id: string, name: string, createdAt: string, updatedAt: string }> } };

export type FetchAllUsersQueryVariables = Exact<{
  usersInput: UsersInput;
}>;


export type FetchAllUsersQuery = { __typename?: 'Query', fetchAllUsers: { __typename?: 'UsersPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, users?: Maybe<Array<Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, zipCode?: Maybe<string>, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>>>, pagination?: Maybe<{ __typename?: 'PaginationPayload', page?: Maybe<number>, limit?: Maybe<number>, totalCount?: Maybe<number>, totalPages?: Maybe<number> }> } };

export type DeactivateUserMutationVariables = Exact<{
  userInput: UserIdInput;
}>;


export type DeactivateUserMutation = { __typename?: 'Mutation', deactivateUser: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, zipCode?: Maybe<string>, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }> } };

export type ActivateUserMutationVariables = Exact<{
  userInput: UserIdInput;
}>;


export type ActivateUserMutation = { __typename?: 'Mutation', activateUser: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, email: string, phone: string, zipCode?: Maybe<string>, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }> } };

export type UpdateRoleMutationVariables = Exact<{
  userInput: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', updateRole: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string>, error?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, email: string, phone: string, status: UserStatus, zipCode?: Maybe<string>, lastName: string, firstName: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }> } };

export type UpdateUserMutationVariables = Exact<{
  userInput: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, email: string, phone: string, zipCode?: Maybe<string>, lastName: string, firstName: string, emailVerified: boolean }> } };

export type GetUserQueryVariables = Exact<{
  getUser: GetUser;
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, email: string, phone: string, status: UserStatus, zipCode?: Maybe<string>, firstName: string, lastName: string, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>>, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }>, membership?: Maybe<{ __typename?: 'Membership', id: string, name: string, phaseId: string, noOfProperties: number, initialPayment: number, noOfAllowedNights: number, annualOperatingFee: number, annualManagementFee: number, noOfAdvanceNightsReservations: number, noOfConsecutiveNightsAllowed: number, createdAt: string, updatedAt: string }>, contactInfo?: Maybe<{ __typename?: 'ContactInfo', id: string, state: string, userId: string, address1: string, address2?: Maybe<string>, individualName: string, socialSecurityNumber: string, createdAt: string, updatedAt: string }> }> } };

export type UpdateUserPhaseMutationVariables = Exact<{
  updateUserPhaseInput: UpdateUserPhaseInput;
}>;


export type UpdateUserPhaseMutation = { __typename?: 'Mutation', updateUserPhase: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, emailVerified: boolean, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>>, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }>, contactInfo?: Maybe<{ __typename?: 'ContactInfo', id: string, address1: string, state: string, individualName: string, socialSecurityNumber: string }> }> } };

export type SearchUserQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type SearchUserQuery = { __typename?: 'Query', searchUser: { __typename?: 'UsersPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, message?: Maybe<string> }>, users?: Maybe<Array<Maybe<{ __typename?: 'User', id: string, email: string, firstName: string, lastName: string, status: UserStatus, phone: string, zipCode?: Maybe<string>, emailVerified: boolean, createdAt: string, updatedAt: string, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>> }>>> } };

export type UpdatePasswordMutationVariables = Exact<{
  updatePasswordInput: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string, firstName: string, lastName: string, status: UserStatus, emailVerified: boolean, roles?: Maybe<Array<Maybe<{ __typename?: 'Role', id: string, role: UserRole, createdAt: string, updatedAt: string, nextRole: { __typename?: 'NextRole', states?: Maybe<Array<Maybe<{ __typename?: 'RoleStates', role: UserRole, action: string }>>> } }>>>, phase?: Maybe<{ __typename?: 'Phase', id: string, name: string, order: number, isCurrentPhase: boolean, createdAt: string, updatedAt: string }>, contactInfo?: Maybe<{ __typename?: 'ContactInfo', id: string, address1: string, state: string, individualName: string, socialSecurityNumber: string }> }> } };

export type RemoveUserMutationVariables = Exact<{
  userInput: UserIdInput;
}>;


export type RemoveUserMutation = { __typename?: 'Mutation', removeUser: { __typename?: 'UserPayload', response?: Maybe<{ __typename?: 'ResponsePayload', status?: Maybe<number>, error?: Maybe<string>, message?: Maybe<string> }>, user?: Maybe<{ __typename?: 'User', id: string }> } };


export const LoginDocument = gql`
    mutation Login($loginUser: LoginUserInput!) {
  login(loginUser: $loginUser) {
    access_token
    response {
      message
      status
    }
    roles {
      id
      role
      createdAt
      updatedAt
      nextRole {
        states {
          role
          action
        }
      }
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginUser: // value for 'loginUser'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetLoggedInUserDocument = gql`
    query GetLoggedInUser {
  me {
    response {
      status
      error
      message
    }
    user {
      id
      firstName
      lastName
      status
      email
      zipCode
      phone
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetLoggedInUserQuery__
 *
 * To run a query within a React component, call `useGetLoggedInUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoggedInUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoggedInUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoggedInUserQuery(baseOptions?: Apollo.QueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
}
export function useGetLoggedInUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>(GetLoggedInUserDocument, options);
}
export type GetLoggedInUserQueryHookResult = ReturnType<typeof useGetLoggedInUserQuery>;
export type GetLoggedInUserLazyQueryHookResult = ReturnType<typeof useGetLoggedInUserLazyQuery>;
export type GetLoggedInUserQueryResult = Apollo.QueryResult<GetLoggedInUserQuery, GetLoggedInUserQueryVariables>;
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($forgotPasswordInput: ForgotPasswordInput!) {
  forgotPassword(forgotPassword: $forgotPasswordInput) {
    response {
      name
      message
      status
    }
  }
}
    `;
export type ForgetPasswordMutationFn = Apollo.MutationFunction<ForgetPasswordMutation, ForgetPasswordMutationVariables>;

/**
 * __useForgetPasswordMutation__
 *
 * To run a mutation, you first call `useForgetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgetPasswordMutation, { data, loading, error }] = useForgetPasswordMutation({
 *   variables: {
 *      forgotPasswordInput: // value for 'forgotPasswordInput'
 *   },
 * });
 */
export function useForgetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument, options);
}
export type ForgetPasswordMutationHookResult = ReturnType<typeof useForgetPasswordMutation>;
export type ForgetPasswordMutationResult = Apollo.MutationResult<ForgetPasswordMutation>;
export type ForgetPasswordMutationOptions = Apollo.BaseMutationOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($resetPassword: ResetPasswordInput!) {
  resetPassword(resetPassword: $resetPassword) {
    user {
      id
      firstName
      lastName
      status
      email
      zipCode
      phone
      createdAt
      updatedAt
      emailVerified
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
    response {
      status
      message
      error
    }
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      resetPassword: // value for 'resetPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
}
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const RegisterUserDocument = gql`
    mutation RegisterUser($user: RegisterUserInput!) {
  registerUser(user: $user) {
    user {
      id
      email
      firstName
      lastName
      status
      emailVerified
    }
    response {
      error
      status
      message
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
}
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const EmailVerificationDocument = gql`
    mutation EmailVerification($verifyEmail: VerifyEmailInput!) {
  verifyEmail(verifyEmail: $verifyEmail) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type EmailVerificationMutationFn = Apollo.MutationFunction<EmailVerificationMutation, EmailVerificationMutationVariables>;

/**
 * __useEmailVerificationMutation__
 *
 * To run a mutation, you first call `useEmailVerificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailVerificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailVerificationMutation, { data, loading, error }] = useEmailVerificationMutation({
 *   variables: {
 *      verifyEmail: // value for 'verifyEmail'
 *   },
 * });
 */
export function useEmailVerificationMutation(baseOptions?: Apollo.MutationHookOptions<EmailVerificationMutation, EmailVerificationMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<EmailVerificationMutation, EmailVerificationMutationVariables>(EmailVerificationDocument, options);
}
export type EmailVerificationMutationHookResult = ReturnType<typeof useEmailVerificationMutation>;
export type EmailVerificationMutationResult = Apollo.MutationResult<EmailVerificationMutation>;
export type EmailVerificationMutationOptions = Apollo.BaseMutationOptions<EmailVerificationMutation, EmailVerificationMutationVariables>;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail($resendVerificationEmail: ResendVerificationEmail!) {
  resendVerificationEmail(resendVerificationEmail: $resendVerificationEmail) {
    response {
      error
      status
      message
    }
  }
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      resendVerificationEmail: // value for 'resendVerificationEmail'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
}
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const CreateFeatureDocument = gql`
    mutation CreateFeature($createFeatureInput: CreateFeatureInput!) {
  createFeature(createFeatureInput: $createFeatureInput) {
    response {
      name
      status
      message
      error
    }
    feature {
      id
      name
      updatedAt
      createdAt
    }
  }
}
    `;
export type CreateFeatureMutationFn = Apollo.MutationFunction<CreateFeatureMutation, CreateFeatureMutationVariables>;

/**
 * __useCreateFeatureMutation__
 *
 * To run a mutation, you first call `useCreateFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFeatureMutation, { data, loading, error }] = useCreateFeatureMutation({
 *   variables: {
 *      createFeatureInput: // value for 'createFeatureInput'
 *   },
 * });
 */
export function useCreateFeatureMutation(baseOptions?: Apollo.MutationHookOptions<CreateFeatureMutation, CreateFeatureMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateFeatureMutation, CreateFeatureMutationVariables>(CreateFeatureDocument, options);
}
export type CreateFeatureMutationHookResult = ReturnType<typeof useCreateFeatureMutation>;
export type CreateFeatureMutationResult = Apollo.MutationResult<CreateFeatureMutation>;
export type CreateFeatureMutationOptions = Apollo.BaseMutationOptions<CreateFeatureMutation, CreateFeatureMutationVariables>;
export const UpdateFeatureDocument = gql`
    mutation UpdateFeature($updateFeatureInput: UpdateFeatureInput!) {
  updateFeature(updateFeatureInput: $updateFeatureInput) {
    response {
      name
      status
      message
      error
    }
    feature {
      id
      name
      updatedAt
      createdAt
    }
  }
}
    `;
export type UpdateFeatureMutationFn = Apollo.MutationFunction<UpdateFeatureMutation, UpdateFeatureMutationVariables>;

/**
 * __useUpdateFeatureMutation__
 *
 * To run a mutation, you first call `useUpdateFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFeatureMutation, { data, loading, error }] = useUpdateFeatureMutation({
 *   variables: {
 *      updateFeatureInput: // value for 'updateFeatureInput'
 *   },
 * });
 */
export function useUpdateFeatureMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFeatureMutation, UpdateFeatureMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateFeatureMutation, UpdateFeatureMutationVariables>(UpdateFeatureDocument, options);
}
export type UpdateFeatureMutationHookResult = ReturnType<typeof useUpdateFeatureMutation>;
export type UpdateFeatureMutationResult = Apollo.MutationResult<UpdateFeatureMutation>;
export type UpdateFeatureMutationOptions = Apollo.BaseMutationOptions<UpdateFeatureMutation, UpdateFeatureMutationVariables>;
export const RemoveFeatureDocument = gql`
    mutation RemoveFeature($removeFeature: RemoveFeature!) {
  removeFeature(removeFeature: $removeFeature) {
    response {
      name
      status
      message
      error
    }
  }
}
    `;
export type RemoveFeatureMutationFn = Apollo.MutationFunction<RemoveFeatureMutation, RemoveFeatureMutationVariables>;

/**
 * __useRemoveFeatureMutation__
 *
 * To run a mutation, you first call `useRemoveFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFeatureMutation, { data, loading, error }] = useRemoveFeatureMutation({
 *   variables: {
 *      removeFeature: // value for 'removeFeature'
 *   },
 * });
 */
export function useRemoveFeatureMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFeatureMutation, RemoveFeatureMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveFeatureMutation, RemoveFeatureMutationVariables>(RemoveFeatureDocument, options);
}
export type RemoveFeatureMutationHookResult = ReturnType<typeof useRemoveFeatureMutation>;
export type RemoveFeatureMutationResult = Apollo.MutationResult<RemoveFeatureMutation>;
export type RemoveFeatureMutationOptions = Apollo.BaseMutationOptions<RemoveFeatureMutation, RemoveFeatureMutationVariables>;
export const FindAllFeaturesDocument = gql`
    query FindAllFeatures($featuresInput: FeaturesInput!) {
  findAllFeatures(featuresInput: $featuresInput) {
    response {
      name
      status
      message
      error
    }
    features {
      id
      name
      createdAt
      updatedAt
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllFeaturesQuery__
 *
 * To run a query within a React component, call `useFindAllFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllFeaturesQuery({
 *   variables: {
 *      featuresInput: // value for 'featuresInput'
 *   },
 * });
 */
export function useFindAllFeaturesQuery(baseOptions: Apollo.QueryHookOptions<FindAllFeaturesQuery, FindAllFeaturesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllFeaturesQuery, FindAllFeaturesQueryVariables>(FindAllFeaturesDocument, options);
}
export function useFindAllFeaturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllFeaturesQuery, FindAllFeaturesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllFeaturesQuery, FindAllFeaturesQueryVariables>(FindAllFeaturesDocument, options);
}
export type FindAllFeaturesQueryHookResult = ReturnType<typeof useFindAllFeaturesQuery>;
export type FindAllFeaturesLazyQueryHookResult = ReturnType<typeof useFindAllFeaturesLazyQuery>;
export type FindAllFeaturesQueryResult = Apollo.QueryResult<FindAllFeaturesQuery, FindAllFeaturesQueryVariables>;
export const GetFeatureDocument = gql`
    query GetFeature($getFeature: GetFeature!) {
  getFeature(getFeature: $getFeature) {
    response {
      name
      status
      message
      error
    }
    feature {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetFeatureQuery__
 *
 * To run a query within a React component, call `useGetFeatureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeatureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeatureQuery({
 *   variables: {
 *      getFeature: // value for 'getFeature'
 *   },
 * });
 */
export function useGetFeatureQuery(baseOptions: Apollo.QueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFeatureQuery, GetFeatureQueryVariables>(GetFeatureDocument, options);
}
export function useGetFeatureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFeatureQuery, GetFeatureQueryVariables>(GetFeatureDocument, options);
}
export type GetFeatureQueryHookResult = ReturnType<typeof useGetFeatureQuery>;
export type GetFeatureLazyQueryHookResult = ReturnType<typeof useGetFeatureLazyQuery>;
export type GetFeatureQueryResult = Apollo.QueryResult<GetFeatureQuery, GetFeatureQueryVariables>;
export const CreateLocationDocument = gql`
    mutation CreateLocation($createLocationInput: CreateLocationInput!) {
  createLocation(createLocationInput: $createLocationInput) {
    response {
      name
      status
      message
      error
    }
    location {
      id
      name
      description
      latitude
      longitude
      detailOverview
      updatedAt
      createdAt
    }
  }
}
    `;
export type CreateLocationMutationFn = Apollo.MutationFunction<CreateLocationMutation, CreateLocationMutationVariables>;

/**
 * __useCreateLocationMutation__
 *
 * To run a mutation, you first call `useCreateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLocationMutation, { data, loading, error }] = useCreateLocationMutation({
 *   variables: {
 *      createLocationInput: // value for 'createLocationInput'
 *   },
 * });
 */
export function useCreateLocationMutation(baseOptions?: Apollo.MutationHookOptions<CreateLocationMutation, CreateLocationMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateLocationMutation, CreateLocationMutationVariables>(CreateLocationDocument, options);
}
export type CreateLocationMutationHookResult = ReturnType<typeof useCreateLocationMutation>;
export type CreateLocationMutationResult = Apollo.MutationResult<CreateLocationMutation>;
export type CreateLocationMutationOptions = Apollo.BaseMutationOptions<CreateLocationMutation, CreateLocationMutationVariables>;
export const RemoveLocationDocument = gql`
    mutation RemoveLocation($removeLocation: RemoveLocation!) {
  removeLocation(removeLocation: $removeLocation) {
    response {
      name
      status
      message
      error
    }
  }
}
    `;
export type RemoveLocationMutationFn = Apollo.MutationFunction<RemoveLocationMutation, RemoveLocationMutationVariables>;

/**
 * __useRemoveLocationMutation__
 *
 * To run a mutation, you first call `useRemoveLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLocationMutation, { data, loading, error }] = useRemoveLocationMutation({
 *   variables: {
 *      removeLocation: // value for 'removeLocation'
 *   },
 * });
 */
export function useRemoveLocationMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLocationMutation, RemoveLocationMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveLocationMutation, RemoveLocationMutationVariables>(RemoveLocationDocument, options);
}
export type RemoveLocationMutationHookResult = ReturnType<typeof useRemoveLocationMutation>;
export type RemoveLocationMutationResult = Apollo.MutationResult<RemoveLocationMutation>;
export type RemoveLocationMutationOptions = Apollo.BaseMutationOptions<RemoveLocationMutation, RemoveLocationMutationVariables>;
export const FindAllLocationsDocument = gql`
    query FindAllLocations($locationsInput: LocationsInput!) {
  findAllLocations(locationsInput: $locationsInput) {
    response {
      name
      status
      message
      error
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
    locations {
      id
      name
      description
      latitude
      longitude
      detailOverview
      address
      updatedAt
      createdAt
      attachments {
        id
        title
        subTitle
        description
        type
        metaType
        key
        typeId
        url
        isLocked
        createdAt
        updatedAt
        isLocked
      }
    }
  }
}
    `;

/**
 * __useFindAllLocationsQuery__
 *
 * To run a query within a React component, call `useFindAllLocationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllLocationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllLocationsQuery({
 *   variables: {
 *      locationsInput: // value for 'locationsInput'
 *   },
 * });
 */
export function useFindAllLocationsQuery(baseOptions: Apollo.QueryHookOptions<FindAllLocationsQuery, FindAllLocationsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllLocationsQuery, FindAllLocationsQueryVariables>(FindAllLocationsDocument, options);
}
export function useFindAllLocationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllLocationsQuery, FindAllLocationsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllLocationsQuery, FindAllLocationsQueryVariables>(FindAllLocationsDocument, options);
}
export type FindAllLocationsQueryHookResult = ReturnType<typeof useFindAllLocationsQuery>;
export type FindAllLocationsLazyQueryHookResult = ReturnType<typeof useFindAllLocationsLazyQuery>;
export type FindAllLocationsQueryResult = Apollo.QueryResult<FindAllLocationsQuery, FindAllLocationsQueryVariables>;
export const GetLocationDocument = gql`
    query GetLocation($getLocation: GetLocation!) {
  getLocation(getLocation: $getLocation) {
    response {
      name
      status
      message
      error
    }
    location {
      id
      name
      description
      longitude
      latitude
      address
      detailOverview
      createdAt
      updatedAt
      attachments {
        id
        title
        subTitle
        description
        type
        metaType
        key
        typeId
        url
        isLocked
        createdAt
        updatedAt
        isLocked
      }
    }
  }
}
    `;

/**
 * __useGetLocationQuery__
 *
 * To run a query within a React component, call `useGetLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationQuery({
 *   variables: {
 *      getLocation: // value for 'getLocation'
 *   },
 * });
 */
export function useGetLocationQuery(baseOptions: Apollo.QueryHookOptions<GetLocationQuery, GetLocationQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetLocationQuery, GetLocationQueryVariables>(GetLocationDocument, options);
}
export function useGetLocationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationQuery, GetLocationQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetLocationQuery, GetLocationQueryVariables>(GetLocationDocument, options);
}
export type GetLocationQueryHookResult = ReturnType<typeof useGetLocationQuery>;
export type GetLocationLazyQueryHookResult = ReturnType<typeof useGetLocationLazyQuery>;
export type GetLocationQueryResult = Apollo.QueryResult<GetLocationQuery, GetLocationQueryVariables>;
export const UpdateLocationDocument = gql`
    mutation UpdateLocation($updateLocationInput: UpdateLocationInput!) {
  updateLocation(updateLocationInput: $updateLocationInput) {
    response {
      status
      error
      message
      name
    }
  }
}
    `;
export type UpdateLocationMutationFn = Apollo.MutationFunction<UpdateLocationMutation, UpdateLocationMutationVariables>;

/**
 * __useUpdateLocationMutation__
 *
 * To run a mutation, you first call `useUpdateLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocationMutation, { data, loading, error }] = useUpdateLocationMutation({
 *   variables: {
 *      updateLocationInput: // value for 'updateLocationInput'
 *   },
 * });
 */
export function useUpdateLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocationMutation, UpdateLocationMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(UpdateLocationDocument, options);
}
export type UpdateLocationMutationHookResult = ReturnType<typeof useUpdateLocationMutation>;
export type UpdateLocationMutationResult = Apollo.MutationResult<UpdateLocationMutation>;
export type UpdateLocationMutationOptions = Apollo.BaseMutationOptions<UpdateLocationMutation, UpdateLocationMutationVariables>;
export const CreateAttachmentDataDocument = gql`
    mutation CreateAttachmentData($createAttachmentInput: CreateAttachmentInput!) {
  createAttachmentData(createAttachmentInput: $createAttachmentInput) {
    response {
      name
      status
      message
      error
    }
    attachment {
      id
      title
    }
  }
}
    `;
export type CreateAttachmentDataMutationFn = Apollo.MutationFunction<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>;

/**
 * __useCreateAttachmentDataMutation__
 *
 * To run a mutation, you first call `useCreateAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAttachmentDataMutation, { data, loading, error }] = useCreateAttachmentDataMutation({
 *   variables: {
 *      createAttachmentInput: // value for 'createAttachmentInput'
 *   },
 * });
 */
export function useCreateAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>(CreateAttachmentDataDocument, options);
}
export type CreateAttachmentDataMutationHookResult = ReturnType<typeof useCreateAttachmentDataMutation>;
export type CreateAttachmentDataMutationResult = Apollo.MutationResult<CreateAttachmentDataMutation>;
export type CreateAttachmentDataMutationOptions = Apollo.BaseMutationOptions<CreateAttachmentDataMutation, CreateAttachmentDataMutationVariables>;
export const RemoveAttachmentDataDocument = gql`
    mutation RemoveAttachmentData($removeAttachment: RemoveAttachment!) {
  removeAttachmentData(removeAttachment: $removeAttachment) {
    response {
      name
      status
      message
      error
    }
  }
}
    `;
export type RemoveAttachmentDataMutationFn = Apollo.MutationFunction<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>;

/**
 * __useRemoveAttachmentDataMutation__
 *
 * To run a mutation, you first call `useRemoveAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAttachmentDataMutation, { data, loading, error }] = useRemoveAttachmentDataMutation({
 *   variables: {
 *      removeAttachment: // value for 'removeAttachment'
 *   },
 * });
 */
export function useRemoveAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>(RemoveAttachmentDataDocument, options);
}
export type RemoveAttachmentDataMutationHookResult = ReturnType<typeof useRemoveAttachmentDataMutation>;
export type RemoveAttachmentDataMutationResult = Apollo.MutationResult<RemoveAttachmentDataMutation>;
export type RemoveAttachmentDataMutationOptions = Apollo.BaseMutationOptions<RemoveAttachmentDataMutation, RemoveAttachmentDataMutationVariables>;
export const UpdateAttachmentDataDocument = gql`
    mutation UpdateAttachmentData($updateAttachmentInput: UpdateAttachmentInput!) {
  updateAttachmentData(updateAttachmentInput: $updateAttachmentInput) {
    response {
      status
      name
      message
    }
    attachment {
      id
      title
      subTitle
      description
      type
      metaType
      typeId
      key
      url
      isLocked
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateAttachmentDataMutationFn = Apollo.MutationFunction<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>;

/**
 * __useUpdateAttachmentDataMutation__
 *
 * To run a mutation, you first call `useUpdateAttachmentDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAttachmentDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAttachmentDataMutation, { data, loading, error }] = useUpdateAttachmentDataMutation({
 *   variables: {
 *      updateAttachmentInput: // value for 'updateAttachmentInput'
 *   },
 * });
 */
export function useUpdateAttachmentDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>(UpdateAttachmentDataDocument, options);
}
export type UpdateAttachmentDataMutationHookResult = ReturnType<typeof useUpdateAttachmentDataMutation>;
export type UpdateAttachmentDataMutationResult = Apollo.MutationResult<UpdateAttachmentDataMutation>;
export type UpdateAttachmentDataMutationOptions = Apollo.BaseMutationOptions<UpdateAttachmentDataMutation, UpdateAttachmentDataMutationVariables>;
export const CreateHighlightDocument = gql`
    mutation CreateHighlight($createHighLightInput: CreateHighLightInput!) {
  createHighLight(createHighLightInput: $createHighLightInput) {
    response {
      status
      error
      message
    }
    highlight {
      id
    }
  }
}
    `;
export type CreateHighlightMutationFn = Apollo.MutationFunction<CreateHighlightMutation, CreateHighlightMutationVariables>;

/**
 * __useCreateHighlightMutation__
 *
 * To run a mutation, you first call `useCreateHighlightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHighlightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHighlightMutation, { data, loading, error }] = useCreateHighlightMutation({
 *   variables: {
 *      createHighLightInput: // value for 'createHighLightInput'
 *   },
 * });
 */
export function useCreateHighlightMutation(baseOptions?: Apollo.MutationHookOptions<CreateHighlightMutation, CreateHighlightMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateHighlightMutation, CreateHighlightMutationVariables>(CreateHighlightDocument, options);
}
export type CreateHighlightMutationHookResult = ReturnType<typeof useCreateHighlightMutation>;
export type CreateHighlightMutationResult = Apollo.MutationResult<CreateHighlightMutation>;
export type CreateHighlightMutationOptions = Apollo.BaseMutationOptions<CreateHighlightMutation, CreateHighlightMutationVariables>;
export const GetAttachmentDocument = gql`
    query GetAttachment($getMedia: GetMedia!) {
  getAttachment(getMedia: $getMedia) {
    preSignedUrl
    response {
      message
    }
  }
}
    `;

/**
 * __useGetAttachmentQuery__
 *
 * To run a query within a React component, call `useGetAttachmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAttachmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAttachmentQuery({
 *   variables: {
 *      getMedia: // value for 'getMedia'
 *   },
 * });
 */
export function useGetAttachmentQuery(baseOptions: Apollo.QueryHookOptions<GetAttachmentQuery, GetAttachmentQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(GetAttachmentDocument, options);
}
export function useGetAttachmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAttachmentQuery, GetAttachmentQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAttachmentQuery, GetAttachmentQueryVariables>(GetAttachmentDocument, options);
}
export type GetAttachmentQueryHookResult = ReturnType<typeof useGetAttachmentQuery>;
export type GetAttachmentLazyQueryHookResult = ReturnType<typeof useGetAttachmentLazyQuery>;
export type GetAttachmentQueryResult = Apollo.QueryResult<GetAttachmentQuery, GetAttachmentQueryVariables>;
export const UpdateRequestDocument = gql`
    mutation UpdateRequest($updateRequestInput: UpdateRequestInput!) {
  changeRequestStatus(updateRequestInput: $updateRequestInput) {
    response {
      status
      error
      message
    }
    request {
      id
      url
      userId
      createdAt
      updatedAt
      description
      membershipId
      requestStatus
      envelopeExpiry
      signedDocumentUrl
      docuSignEnvelopeId
      user {
        id
        email
        phone
        status
        zipCode
        lastName
        firstName
        emailVerified
        createdAt
        updatedAt
        roles {
          id
          role
          createdAt
          updatedAt
          nextRole {
            states {
              role
              action
            }
          }
        }
      }
      membership {
        id
        name
        phaseId
        createdAt
        updatedAt
        initialPayment
        noOfProperties
        noOfAllowedNights
        annualOperatingFee
        annualManagementFee
        noOfConsecutiveNightsAllowed
        noOfAdvanceNightsReservations
        phase {
          id
          name
          order
          isCurrentPhase
          createdAt
          updatedAt
        }
      }
      attachments {
        id
        url
        type
        typeId
        isLocked
        isLocked
        metaType
        description
        createdAt
        updatedAt
      }
    }
  }
}
    `;
export type UpdateRequestMutationFn = Apollo.MutationFunction<UpdateRequestMutation, UpdateRequestMutationVariables>;

/**
 * __useUpdateRequestMutation__
 *
 * To run a mutation, you first call `useUpdateRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRequestMutation, { data, loading, error }] = useUpdateRequestMutation({
 *   variables: {
 *      updateRequestInput: // value for 'updateRequestInput'
 *   },
 * });
 */
export function useUpdateRequestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRequestMutation, UpdateRequestMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateRequestMutation, UpdateRequestMutationVariables>(UpdateRequestDocument, options);
}
export type UpdateRequestMutationHookResult = ReturnType<typeof useUpdateRequestMutation>;
export type UpdateRequestMutationResult = Apollo.MutationResult<UpdateRequestMutation>;
export type UpdateRequestMutationOptions = Apollo.BaseMutationOptions<UpdateRequestMutation, UpdateRequestMutationVariables>;
export const GetUserMembershipRequestDocument = gql`
    query GetUserMembershipRequest($getRequest: GetRequest!) {
  getRequest(getRequest: $getRequest) {
    response {
      status
      error
      message
    }
    request {
      id
      url
      userId
      createdAt
      updatedAt
      description
      membershipId
      requestStatus
      envelopeExpiry
      signedDocumentUrl
      docuSignEnvelopeId
      user {
        id
        firstName
        lastName
        status
        email
        zipCode
        phone
        emailVerified
        createdAt
        updatedAt
        roles {
          id
          role
          createdAt
          updatedAt
          nextRole {
            states {
              role
              action
            }
          }
        }
      }
      membership {
        id
        name
        initialPayment
        annualOperatingFee
        annualManagementFee
        noOfAllowedNights
        noOfProperties
        noOfAdvanceNightsReservations
        noOfConsecutiveNightsAllowed
        phaseId
        createdAt
        updatedAt
        phase {
          id
          name
          order
          isCurrentPhase
          createdAt
          updatedAt
        }
      }
      attachments {
        id
        url
        type
        description
        metaType
        typeId
        isLocked
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetUserMembershipRequestQuery__
 *
 * To run a query within a React component, call `useGetUserMembershipRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserMembershipRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserMembershipRequestQuery({
 *   variables: {
 *      getRequest: // value for 'getRequest'
 *   },
 * });
 */
export function useGetUserMembershipRequestQuery(baseOptions: Apollo.QueryHookOptions<GetUserMembershipRequestQuery, GetUserMembershipRequestQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUserMembershipRequestQuery, GetUserMembershipRequestQueryVariables>(GetUserMembershipRequestDocument, options);
}
export function useGetUserMembershipRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserMembershipRequestQuery, GetUserMembershipRequestQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUserMembershipRequestQuery, GetUserMembershipRequestQueryVariables>(GetUserMembershipRequestDocument, options);
}
export type GetUserMembershipRequestQueryHookResult = ReturnType<typeof useGetUserMembershipRequestQuery>;
export type GetUserMembershipRequestLazyQueryHookResult = ReturnType<typeof useGetUserMembershipRequestLazyQuery>;
export type GetUserMembershipRequestQueryResult = Apollo.QueryResult<GetUserMembershipRequestQuery, GetUserMembershipRequestQueryVariables>;
export const FindAllRequestsDocument = gql`
    query FindAllRequests($requestsInput: RequestsInput!) {
  getAllRequests(requestsInput: $requestsInput) {
    response {
      error
      status
      message
    }
    requests {
      id
      url
      userId
      createdAt
      updatedAt
      description
      membershipId
      requestStatus
      envelopeExpiry
      signedDocumentUrl
      docuSignEnvelopeId
      user {
        id
        firstName
        lastName
        status
        email
        zipCode
        phone
        emailVerified
        createdAt
        updatedAt
        roles {
          id
          role
          createdAt
          updatedAt
          nextRole {
            states {
              role
              action
            }
          }
        }
      }
      membership {
        id
        name
        phaseId
        createdAt
        updatedAt
        noOfProperties
        initialPayment
        noOfAllowedNights
        annualOperatingFee
        annualManagementFee
        noOfConsecutiveNightsAllowed
        noOfAdvanceNightsReservations
        phase {
          id
          name
          order
          isCurrentPhase
          createdAt
          updatedAt
        }
      }
      attachments {
        id
        url
        type
        description
        metaType
        typeId
        isLocked
        createdAt
        updatedAt
        isLocked
      }
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllRequestsQuery__
 *
 * To run a query within a React component, call `useFindAllRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllRequestsQuery({
 *   variables: {
 *      requestsInput: // value for 'requestsInput'
 *   },
 * });
 */
export function useFindAllRequestsQuery(baseOptions: Apollo.QueryHookOptions<FindAllRequestsQuery, FindAllRequestsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllRequestsQuery, FindAllRequestsQueryVariables>(FindAllRequestsDocument, options);
}
export function useFindAllRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllRequestsQuery, FindAllRequestsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllRequestsQuery, FindAllRequestsQueryVariables>(FindAllRequestsDocument, options);
}
export type FindAllRequestsQueryHookResult = ReturnType<typeof useFindAllRequestsQuery>;
export type FindAllRequestsLazyQueryHookResult = ReturnType<typeof useFindAllRequestsLazyQuery>;
export type FindAllRequestsQueryResult = Apollo.QueryResult<FindAllRequestsQuery, FindAllRequestsQueryVariables>;
export const GetMembershipDocument = gql`
    query GetMembership($getMembership: GetMembership!) {
  getMembership(getMembership: $getMembership) {
    response {
      status
      error
      message
    }
    membership {
      id
      name
      initialPayment
      annualOperatingFee
      annualManagementFee
      noOfProperties
      noOfAllowedNights
      noOfAdvanceNightsReservations
      noOfConsecutiveNightsAllowed
      phaseId
      createdAt
      updatedAt
      phase {
        id
        name
        order
        isCurrentPhase
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetMembershipQuery__
 *
 * To run a query within a React component, call `useGetMembershipQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipQuery({
 *   variables: {
 *      getMembership: // value for 'getMembership'
 *   },
 * });
 */
export function useGetMembershipQuery(baseOptions: Apollo.QueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, options);
}
export function useGetMembershipLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMembershipQuery, GetMembershipQueryVariables>(GetMembershipDocument, options);
}
export type GetMembershipQueryHookResult = ReturnType<typeof useGetMembershipQuery>;
export type GetMembershipLazyQueryHookResult = ReturnType<typeof useGetMembershipLazyQuery>;
export type GetMembershipQueryResult = Apollo.QueryResult<GetMembershipQuery, GetMembershipQueryVariables>;
export const FindAllMembershipsDocument = gql`
    query FindAllMemberships($membershipsInput: MembershipsInput!) {
  findAllMemberships(membershipsInput: $membershipsInput) {
    response {
      status
      error
      message
    }
    memberships {
      id
      name
      phaseId
      createdAt
      updatedAt
      noOfProperties
      initialPayment
      annualOperatingFee
      annualManagementFee
      noOfAllowedNights
      noOfAdvanceNightsReservations
      noOfConsecutiveNightsAllowed
      phase {
        id
        name
        order
        isCurrentPhase
        createdAt
        updatedAt
      }
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllMembershipsQuery__
 *
 * To run a query within a React component, call `useFindAllMembershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllMembershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllMembershipsQuery({
 *   variables: {
 *      membershipsInput: // value for 'membershipsInput'
 *   },
 * });
 */
export function useFindAllMembershipsQuery(baseOptions: Apollo.QueryHookOptions<FindAllMembershipsQuery, FindAllMembershipsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllMembershipsQuery, FindAllMembershipsQueryVariables>(FindAllMembershipsDocument, options);
}
export function useFindAllMembershipsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllMembershipsQuery, FindAllMembershipsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllMembershipsQuery, FindAllMembershipsQueryVariables>(FindAllMembershipsDocument, options);
}
export type FindAllMembershipsQueryHookResult = ReturnType<typeof useFindAllMembershipsQuery>;
export type FindAllMembershipsLazyQueryHookResult = ReturnType<typeof useFindAllMembershipsLazyQuery>;
export type FindAllMembershipsQueryResult = Apollo.QueryResult<FindAllMembershipsQuery, FindAllMembershipsQueryVariables>;
export const RemoveRequestDocument = gql`
    mutation RemoveRequest($removeRequest: RemoveRequest!) {
  removeRequest(removeRequest: $removeRequest) {
    response {
      status
      message
      error
    }
    request {
      id
      url
      userId
      createdAt
      updatedAt
      description
      membershipId
      requestStatus
      envelopeExpiry
      signedDocumentUrl
      docuSignEnvelopeId
    }
  }
}
    `;
export type RemoveRequestMutationFn = Apollo.MutationFunction<RemoveRequestMutation, RemoveRequestMutationVariables>;

/**
 * __useRemoveRequestMutation__
 *
 * To run a mutation, you first call `useRemoveRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeRequestMutation, { data, loading, error }] = useRemoveRequestMutation({
 *   variables: {
 *      removeRequest: // value for 'removeRequest'
 *   },
 * });
 */
export function useRemoveRequestMutation(baseOptions?: Apollo.MutationHookOptions<RemoveRequestMutation, RemoveRequestMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveRequestMutation, RemoveRequestMutationVariables>(RemoveRequestDocument, options);
}
export type RemoveRequestMutationHookResult = ReturnType<typeof useRemoveRequestMutation>;
export type RemoveRequestMutationResult = Apollo.MutationResult<RemoveRequestMutation>;
export type RemoveRequestMutationOptions = Apollo.BaseMutationOptions<RemoveRequestMutation, RemoveRequestMutationVariables>;
export const GetUserRequestDocument = gql`
    query GetUserRequest($getUserRequest: GetUserRequest!) {
  getUserRequest(getUserRequest: $getUserRequest) {
    response {
      error
      status
      message
    }
    request {
      id
      url
      userId
      createdAt
      updatedAt
      description
      membershipId
      requestStatus
      envelopeExpiry
      signedDocumentUrl
      docuSignEnvelopeId
    }
  }
}
    `;

/**
 * __useGetUserRequestQuery__
 *
 * To run a query within a React component, call `useGetUserRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRequestQuery({
 *   variables: {
 *      getUserRequest: // value for 'getUserRequest'
 *   },
 * });
 */
export function useGetUserRequestQuery(baseOptions: Apollo.QueryHookOptions<GetUserRequestQuery, GetUserRequestQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUserRequestQuery, GetUserRequestQueryVariables>(GetUserRequestDocument, options);
}
export function useGetUserRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserRequestQuery, GetUserRequestQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUserRequestQuery, GetUserRequestQueryVariables>(GetUserRequestDocument, options);
}
export type GetUserRequestQueryHookResult = ReturnType<typeof useGetUserRequestQuery>;
export type GetUserRequestLazyQueryHookResult = ReturnType<typeof useGetUserRequestLazyQuery>;
export type GetUserRequestQueryResult = Apollo.QueryResult<GetUserRequestQuery, GetUserRequestQueryVariables>;
export const FindAllPhasesDocument = gql`
    query FindAllPhases($phasesInput: PhasesInput!) {
  findAllPhases(phasesInput: $phasesInput) {
    response {
      status
      message
    }
    phases {
      id
      name
      order
      isCurrentPhase
      updatedAt
      createdAt
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllPhasesQuery__
 *
 * To run a query within a React component, call `useFindAllPhasesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPhasesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPhasesQuery({
 *   variables: {
 *      phasesInput: // value for 'phasesInput'
 *   },
 * });
 */
export function useFindAllPhasesQuery(baseOptions: Apollo.QueryHookOptions<FindAllPhasesQuery, FindAllPhasesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllPhasesQuery, FindAllPhasesQueryVariables>(FindAllPhasesDocument, options);
}
export function useFindAllPhasesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPhasesQuery, FindAllPhasesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllPhasesQuery, FindAllPhasesQueryVariables>(FindAllPhasesDocument, options);
}
export type FindAllPhasesQueryHookResult = ReturnType<typeof useFindAllPhasesQuery>;
export type FindAllPhasesLazyQueryHookResult = ReturnType<typeof useFindAllPhasesLazyQuery>;
export type FindAllPhasesQueryResult = Apollo.QueryResult<FindAllPhasesQuery, FindAllPhasesQueryVariables>;
export const UpdatePhaseStatusDocument = gql`
    mutation UpdatePhaseStatus($updatePhaseStatusInput: UpdatePhaseStatusInput!) {
  updatePhaseStatus(updatePhaseStatusInput: $updatePhaseStatusInput) {
    response {
      status
      error
      message
    }
    phase {
      id
      name
      order
      isCurrentPhase
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdatePhaseStatusMutationFn = Apollo.MutationFunction<UpdatePhaseStatusMutation, UpdatePhaseStatusMutationVariables>;

/**
 * __useUpdatePhaseStatusMutation__
 *
 * To run a mutation, you first call `useUpdatePhaseStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePhaseStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePhaseStatusMutation, { data, loading, error }] = useUpdatePhaseStatusMutation({
 *   variables: {
 *      updatePhaseStatusInput: // value for 'updatePhaseStatusInput'
 *   },
 * });
 */
export function useUpdatePhaseStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePhaseStatusMutation, UpdatePhaseStatusMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePhaseStatusMutation, UpdatePhaseStatusMutationVariables>(UpdatePhaseStatusDocument, options);
}
export type UpdatePhaseStatusMutationHookResult = ReturnType<typeof useUpdatePhaseStatusMutation>;
export type UpdatePhaseStatusMutationResult = Apollo.MutationResult<UpdatePhaseStatusMutation>;
export type UpdatePhaseStatusMutationOptions = Apollo.BaseMutationOptions<UpdatePhaseStatusMutation, UpdatePhaseStatusMutationVariables>;
export const GetPropertyDocument = gql`
    query GetProperty($getProperty: GetProperty!) {
  getProperty(getProperty: $getProperty) {
    property {
      id
      name
      address
      description
      detailOverview
      createdAt
      updatedAt
      location {
        id
        name
        description
        longitude
        latitude
        address
        detailOverview
        createdAt
        updatedAt
      }
      tags {
        id
        name
        createdAt
        updatedAt
      }
      features {
        id
        name
        updatedAt
        createdAt
      }
      attachments {
        id
        title
        subTitle
        description
        type
        metaType
        key
        typeId
        url
        isLocked
        createdAt
        isLocked
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetPropertyQuery__
 *
 * To run a query within a React component, call `useGetPropertyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPropertyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPropertyQuery({
 *   variables: {
 *      getProperty: // value for 'getProperty'
 *   },
 * });
 */
export function useGetPropertyQuery(baseOptions: Apollo.QueryHookOptions<GetPropertyQuery, GetPropertyQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPropertyQuery, GetPropertyQueryVariables>(GetPropertyDocument, options);
}
export function useGetPropertyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPropertyQuery, GetPropertyQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPropertyQuery, GetPropertyQueryVariables>(GetPropertyDocument, options);
}
export type GetPropertyQueryHookResult = ReturnType<typeof useGetPropertyQuery>;
export type GetPropertyLazyQueryHookResult = ReturnType<typeof useGetPropertyLazyQuery>;
export type GetPropertyQueryResult = Apollo.QueryResult<GetPropertyQuery, GetPropertyQueryVariables>;
export const GetAllPropertiesDocument = gql`
    query GetAllProperties($propertiesInput: PropertiesInput!) {
  findAllProperties(propertiesInput: $propertiesInput) {
    response {
      status
      error
      message
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
    properties {
      id
      name
      address
      description
      detailOverview
      createdAt
      updatedAt
      location {
        id
        name
        description
        longitude
        latitude
        address
        detailOverview
        updatedAt
        createdAt
      }
      tags {
        id
        name
        createdAt
        updatedAt
      }
      features {
        id
        name
        updatedAt
        createdAt
      }
    }
  }
}
    `;

/**
 * __useGetAllPropertiesQuery__
 *
 * To run a query within a React component, call `useGetAllPropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPropertiesQuery({
 *   variables: {
 *      propertiesInput: // value for 'propertiesInput'
 *   },
 * });
 */
export function useGetAllPropertiesQuery(baseOptions: Apollo.QueryHookOptions<GetAllPropertiesQuery, GetAllPropertiesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAllPropertiesQuery, GetAllPropertiesQueryVariables>(GetAllPropertiesDocument, options);
}
export function useGetAllPropertiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPropertiesQuery, GetAllPropertiesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAllPropertiesQuery, GetAllPropertiesQueryVariables>(GetAllPropertiesDocument, options);
}
export type GetAllPropertiesQueryHookResult = ReturnType<typeof useGetAllPropertiesQuery>;
export type GetAllPropertiesLazyQueryHookResult = ReturnType<typeof useGetAllPropertiesLazyQuery>;
export type GetAllPropertiesQueryResult = Apollo.QueryResult<GetAllPropertiesQuery, GetAllPropertiesQueryVariables>;
export const CreatePropertyDocument = gql`
    mutation CreateProperty($createPropertyInput: CreatePropertyInput!) {
  createProperty(createPropertyInput: $createPropertyInput) {
    response {
      status
      error
      message
      name
    }
    property {
      id
      name
    }
  }
}
    `;
export type CreatePropertyMutationFn = Apollo.MutationFunction<CreatePropertyMutation, CreatePropertyMutationVariables>;

/**
 * __useCreatePropertyMutation__
 *
 * To run a mutation, you first call `useCreatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPropertyMutation, { data, loading, error }] = useCreatePropertyMutation({
 *   variables: {
 *      createPropertyInput: // value for 'createPropertyInput'
 *   },
 * });
 */
export function useCreatePropertyMutation(baseOptions?: Apollo.MutationHookOptions<CreatePropertyMutation, CreatePropertyMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePropertyMutation, CreatePropertyMutationVariables>(CreatePropertyDocument, options);
}
export type CreatePropertyMutationHookResult = ReturnType<typeof useCreatePropertyMutation>;
export type CreatePropertyMutationResult = Apollo.MutationResult<CreatePropertyMutation>;
export type CreatePropertyMutationOptions = Apollo.BaseMutationOptions<CreatePropertyMutation, CreatePropertyMutationVariables>;
export const UpdatePropertyDocument = gql`
    mutation UpdateProperty($updatePropertyInput: UpdatePropertyInput!) {
  updateProperty(updatePropertyInput: $updatePropertyInput) {
    response {
      status
      error
      message
      name
    }
    property {
      id
      name
      address
      description
      detailOverview
      createdAt
      updatedAt
      location {
        id
        name
        description
        longitude
        latitude
        address
        detailOverview
        createdAt
        updatedAt
      }
      tags {
        id
        name
        createdAt
        updatedAt
      }
      features {
        id
        name
        updatedAt
        createdAt
      }
      attachments {
        id
        url
        key
        type
        title
        subTitle
        description
        metaType
        typeId
        isLocked
        createdAt
        updatedAt
      }
    }
  }
}
    `;
export type UpdatePropertyMutationFn = Apollo.MutationFunction<UpdatePropertyMutation, UpdatePropertyMutationVariables>;

/**
 * __useUpdatePropertyMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyMutation, { data, loading, error }] = useUpdatePropertyMutation({
 *   variables: {
 *      updatePropertyInput: // value for 'updatePropertyInput'
 *   },
 * });
 */
export function useUpdatePropertyMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePropertyMutation, UpdatePropertyMutationVariables>(UpdatePropertyDocument, options);
}
export type UpdatePropertyMutationHookResult = ReturnType<typeof useUpdatePropertyMutation>;
export type UpdatePropertyMutationResult = Apollo.MutationResult<UpdatePropertyMutation>;
export type UpdatePropertyMutationOptions = Apollo.BaseMutationOptions<UpdatePropertyMutation, UpdatePropertyMutationVariables>;
export const RemovePropertyDocument = gql`
    mutation RemoveProperty($removeProperty: RemoveProperty!) {
  removeProperty(removeProperty: $removeProperty) {
    response {
      status
      error
      message
      name
    }
    property {
      id
    }
  }
}
    `;
export type RemovePropertyMutationFn = Apollo.MutationFunction<RemovePropertyMutation, RemovePropertyMutationVariables>;

/**
 * __useRemovePropertyMutation__
 *
 * To run a mutation, you first call `useRemovePropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePropertyMutation, { data, loading, error }] = useRemovePropertyMutation({
 *   variables: {
 *      removeProperty: // value for 'removeProperty'
 *   },
 * });
 */
export function useRemovePropertyMutation(baseOptions?: Apollo.MutationHookOptions<RemovePropertyMutation, RemovePropertyMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemovePropertyMutation, RemovePropertyMutationVariables>(RemovePropertyDocument, options);
}
export type RemovePropertyMutationHookResult = ReturnType<typeof useRemovePropertyMutation>;
export type RemovePropertyMutationResult = Apollo.MutationResult<RemovePropertyMutation>;
export type RemovePropertyMutationOptions = Apollo.BaseMutationOptions<RemovePropertyMutation, RemovePropertyMutationVariables>;
export const UpdatePropertyFeaturesDocument = gql`
    mutation UpdatePropertyFeatures($updatePropertyFeatureInput: UpdatePropertyFeatureInput!) {
  updatePropertyFeature(updatePropertyFeatureInput: $updatePropertyFeatureInput) {
    response {
      status
      error
      message
      name
    }
    feature {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdatePropertyFeaturesMutationFn = Apollo.MutationFunction<UpdatePropertyFeaturesMutation, UpdatePropertyFeaturesMutationVariables>;

/**
 * __useUpdatePropertyFeaturesMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyFeaturesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyFeaturesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyFeaturesMutation, { data, loading, error }] = useUpdatePropertyFeaturesMutation({
 *   variables: {
 *      updatePropertyFeatureInput: // value for 'updatePropertyFeatureInput'
 *   },
 * });
 */
export function useUpdatePropertyFeaturesMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePropertyFeaturesMutation, UpdatePropertyFeaturesMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePropertyFeaturesMutation, UpdatePropertyFeaturesMutationVariables>(UpdatePropertyFeaturesDocument, options);
}
export type UpdatePropertyFeaturesMutationHookResult = ReturnType<typeof useUpdatePropertyFeaturesMutation>;
export type UpdatePropertyFeaturesMutationResult = Apollo.MutationResult<UpdatePropertyFeaturesMutation>;
export type UpdatePropertyFeaturesMutationOptions = Apollo.BaseMutationOptions<UpdatePropertyFeaturesMutation, UpdatePropertyFeaturesMutationVariables>;
export const UpdatePropertyTagsDocument = gql`
    mutation UpdatePropertyTags($updatePropertyTagInput: UpdatePropertyTagInput!) {
  updatePropertyTag(updatePropertyTagInput: $updatePropertyTagInput) {
    response {
      status
      error
      message
      name
    }
    tag {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdatePropertyTagsMutationFn = Apollo.MutationFunction<UpdatePropertyTagsMutation, UpdatePropertyTagsMutationVariables>;

/**
 * __useUpdatePropertyTagsMutation__
 *
 * To run a mutation, you first call `useUpdatePropertyTagsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePropertyTagsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePropertyTagsMutation, { data, loading, error }] = useUpdatePropertyTagsMutation({
 *   variables: {
 *      updatePropertyTagInput: // value for 'updatePropertyTagInput'
 *   },
 * });
 */
export function useUpdatePropertyTagsMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePropertyTagsMutation, UpdatePropertyTagsMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePropertyTagsMutation, UpdatePropertyTagsMutationVariables>(UpdatePropertyTagsDocument, options);
}
export type UpdatePropertyTagsMutationHookResult = ReturnType<typeof useUpdatePropertyTagsMutation>;
export type UpdatePropertyTagsMutationResult = Apollo.MutationResult<UpdatePropertyTagsMutation>;
export type UpdatePropertyTagsMutationOptions = Apollo.BaseMutationOptions<UpdatePropertyTagsMutation, UpdatePropertyTagsMutationVariables>;
export const CreateTagDocument = gql`
    mutation CreateTag($createTagInput: CreateTagInput!) {
  createTag(createTagInput: $createTagInput) {
    response {
      name
      status
      message
      error
    }
    tag {
      id
      name
      updatedAt
      createdAt
    }
  }
}
    `;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      createTagInput: // value for 'createTagInput'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
}
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const UpdateTagDocument = gql`
    mutation UpdateTag($updateTagInput: UpdateTagInput!) {
  updateTag(updateTagInput: $updateTagInput) {
    response {
      name
      status
      message
      error
    }
    tag {
      id
      name
      updatedAt
      createdAt
    }
  }
}
    `;
export type UpdateTagMutationFn = Apollo.MutationFunction<UpdateTagMutation, UpdateTagMutationVariables>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      updateTagInput: // value for 'updateTagInput'
 *   },
 * });
 */
export function useUpdateTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagMutation, UpdateTagMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(UpdateTagDocument, options);
}
export type UpdateTagMutationHookResult = ReturnType<typeof useUpdateTagMutation>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutation>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<UpdateTagMutation, UpdateTagMutationVariables>;
export const RemoveTagDocument = gql`
    mutation RemoveTag($removeTag: RemoveTag!) {
  removeTag(removeTag: $removeTag) {
    response {
      name
      status
      message
      error
    }
  }
}
    `;
export type RemoveTagMutationFn = Apollo.MutationFunction<RemoveTagMutation, RemoveTagMutationVariables>;

/**
 * __useRemoveTagMutation__
 *
 * To run a mutation, you first call `useRemoveTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTagMutation, { data, loading, error }] = useRemoveTagMutation({
 *   variables: {
 *      removeTag: // value for 'removeTag'
 *   },
 * });
 */
export function useRemoveTagMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTagMutation, RemoveTagMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveTagMutation, RemoveTagMutationVariables>(RemoveTagDocument, options);
}
export type RemoveTagMutationHookResult = ReturnType<typeof useRemoveTagMutation>;
export type RemoveTagMutationResult = Apollo.MutationResult<RemoveTagMutation>;
export type RemoveTagMutationOptions = Apollo.BaseMutationOptions<RemoveTagMutation, RemoveTagMutationVariables>;
export const FindAllTagsDocument = gql`
    query FindAllTags($tagsInput: TagsInput!) {
  findAllTags(tagsInput: $tagsInput) {
    response {
      name
      status
      message
      error
    }
    tags {
      id
      name
      createdAt
      updatedAt
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFindAllTagsQuery__
 *
 * To run a query within a React component, call `useFindAllTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllTagsQuery({
 *   variables: {
 *      tagsInput: // value for 'tagsInput'
 *   },
 * });
 */
export function useFindAllTagsQuery(baseOptions: Apollo.QueryHookOptions<FindAllTagsQuery, FindAllTagsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FindAllTagsQuery, FindAllTagsQueryVariables>(FindAllTagsDocument, options);
}
export function useFindAllTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllTagsQuery, FindAllTagsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FindAllTagsQuery, FindAllTagsQueryVariables>(FindAllTagsDocument, options);
}
export type FindAllTagsQueryHookResult = ReturnType<typeof useFindAllTagsQuery>;
export type FindAllTagsLazyQueryHookResult = ReturnType<typeof useFindAllTagsLazyQuery>;
export type FindAllTagsQueryResult = Apollo.QueryResult<FindAllTagsQuery, FindAllTagsQueryVariables>;
export const GetTagQueryDocument = gql`
    query GetTagQuery($getTag: GetTag!) {
  getTag(getTag: $getTag) {
    response {
      name
      status
      message
      error
    }
    tag {
      id
      name
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetTagQueryQuery__
 *
 * To run a query within a React component, call `useGetTagQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagQueryQuery({
 *   variables: {
 *      getTag: // value for 'getTag'
 *   },
 * });
 */
export function useGetTagQueryQuery(baseOptions: Apollo.QueryHookOptions<GetTagQueryQuery, GetTagQueryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTagQueryQuery, GetTagQueryQueryVariables>(GetTagQueryDocument, options);
}
export function useGetTagQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagQueryQuery, GetTagQueryQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTagQueryQuery, GetTagQueryQueryVariables>(GetTagQueryDocument, options);
}
export type GetTagQueryQueryHookResult = ReturnType<typeof useGetTagQueryQuery>;
export type GetTagQueryLazyQueryHookResult = ReturnType<typeof useGetTagQueryLazyQuery>;
export type GetTagQueryQueryResult = Apollo.QueryResult<GetTagQueryQuery, GetTagQueryQueryVariables>;
export const FetchAllUsersDocument = gql`
    query FetchAllUsers($usersInput: UsersInput!) {
  fetchAllUsers(userInput: $usersInput) {
    response {
      status
      message
      error
    }
    users {
      id
      firstName
      lastName
      status
      email
      phone
      zipCode
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
    pagination {
      page
      limit
      totalCount
      totalPages
    }
  }
}
    `;

/**
 * __useFetchAllUsersQuery__
 *
 * To run a query within a React component, call `useFetchAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchAllUsersQuery({
 *   variables: {
 *      usersInput: // value for 'usersInput'
 *   },
 * });
 */
export function useFetchAllUsersQuery(baseOptions: Apollo.QueryHookOptions<FetchAllUsersQuery, FetchAllUsersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FetchAllUsersQuery, FetchAllUsersQueryVariables>(FetchAllUsersDocument, options);
}
export function useFetchAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchAllUsersQuery, FetchAllUsersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FetchAllUsersQuery, FetchAllUsersQueryVariables>(FetchAllUsersDocument, options);
}
export type FetchAllUsersQueryHookResult = ReturnType<typeof useFetchAllUsersQuery>;
export type FetchAllUsersLazyQueryHookResult = ReturnType<typeof useFetchAllUsersLazyQuery>;
export type FetchAllUsersQueryResult = Apollo.QueryResult<FetchAllUsersQuery, FetchAllUsersQueryVariables>;
export const DeactivateUserDocument = gql`
    mutation DeactivateUser($userInput: UserIdInput!) {
  deactivateUser(user: $userInput) {
    response {
      status
      message
      error
    }
    user {
      id
      firstName
      lastName
      status
      email
      phone
      zipCode
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
  }
}
    `;
export type DeactivateUserMutationFn = Apollo.MutationFunction<DeactivateUserMutation, DeactivateUserMutationVariables>;

/**
 * __useDeactivateUserMutation__
 *
 * To run a mutation, you first call `useDeactivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeactivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deactivateUserMutation, { data, loading, error }] = useDeactivateUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useDeactivateUserMutation(baseOptions?: Apollo.MutationHookOptions<DeactivateUserMutation, DeactivateUserMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeactivateUserMutation, DeactivateUserMutationVariables>(DeactivateUserDocument, options);
}
export type DeactivateUserMutationHookResult = ReturnType<typeof useDeactivateUserMutation>;
export type DeactivateUserMutationResult = Apollo.MutationResult<DeactivateUserMutation>;
export type DeactivateUserMutationOptions = Apollo.BaseMutationOptions<DeactivateUserMutation, DeactivateUserMutationVariables>;
export const ActivateUserDocument = gql`
    mutation ActivateUser($userInput: UserIdInput!) {
  activateUser(user: $userInput) {
    response {
      status
      message
      error
    }
    user {
      id
      firstName
      lastName
      status
      email
      phone
      zipCode
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
  }
}
    `;
export type ActivateUserMutationFn = Apollo.MutationFunction<ActivateUserMutation, ActivateUserMutationVariables>;

/**
 * __useActivateUserMutation__
 *
 * To run a mutation, you first call `useActivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateUserMutation, { data, loading, error }] = useActivateUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useActivateUserMutation(baseOptions?: Apollo.MutationHookOptions<ActivateUserMutation, ActivateUserMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ActivateUserMutation, ActivateUserMutationVariables>(ActivateUserDocument, options);
}
export type ActivateUserMutationHookResult = ReturnType<typeof useActivateUserMutation>;
export type ActivateUserMutationResult = Apollo.MutationResult<ActivateUserMutation>;
export type ActivateUserMutationOptions = Apollo.BaseMutationOptions<ActivateUserMutation, ActivateUserMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($userInput: UpdateRoleInput!) {
  updateRole(user: $userInput) {
    response {
      status
      message
      error
    }
    user {
      id
      email
      phone
      status
      zipCode
      lastName
      firstName
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
  }
}
    `;
export type UpdateRoleMutationFn = Apollo.MutationFunction<UpdateRoleMutation, UpdateRoleMutationVariables>;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRoleMutation, { data, loading, error }] = useUpdateRoleMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useUpdateRoleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRoleMutation, UpdateRoleMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
}
export type UpdateRoleMutationHookResult = ReturnType<typeof useUpdateRoleMutation>;
export type UpdateRoleMutationResult = Apollo.MutationResult<UpdateRoleMutation>;
export type UpdateRoleMutationOptions = Apollo.BaseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($userInput: UpdateUserInput!) {
  updateUser(user: $userInput) {
    response {
      status
      error
      message
    }
    user {
      id
      email
      phone
      zipCode
      lastName
      firstName
      emailVerified
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
}
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserDocument = gql`
    query GetUser($getUser: GetUser!) {
  getUser(getUser: $getUser) {
    response {
      status
      error
      message
    }
    user {
      id
      email
      phone
      status
      zipCode
      firstName
      lastName
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
      phase {
        id
        name
        order
        isCurrentPhase
        createdAt
        updatedAt
      }
      membership {
        id
        name
        phaseId
        noOfProperties
        initialPayment
        noOfAllowedNights
        annualOperatingFee
        annualManagementFee
        noOfAdvanceNightsReservations
        noOfConsecutiveNightsAllowed
        createdAt
        updatedAt
      }
      contactInfo {
        id
        state
        userId
        address1
        address2
        individualName
        socialSecurityNumber
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      getUser: // value for 'getUser'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
}
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const UpdateUserPhaseDocument = gql`
    mutation UpdateUserPhase($updateUserPhaseInput: UpdateUserPhaseInput!) {
  updateUserPhase(updateUserPhaseInput: $updateUserPhaseInput) {
    response {
      status
      error
      message
    }
    user {
      id
      firstName
      lastName
      status
      emailVerified
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
      phase {
        id
        name
        order
        isCurrentPhase
        createdAt
        updatedAt
      }
      contactInfo {
        id
        address1
        state
        individualName
        socialSecurityNumber
      }
    }
  }
}
    `;
export type UpdateUserPhaseMutationFn = Apollo.MutationFunction<UpdateUserPhaseMutation, UpdateUserPhaseMutationVariables>;

/**
 * __useUpdateUserPhaseMutation__
 *
 * To run a mutation, you first call `useUpdateUserPhaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserPhaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserPhaseMutation, { data, loading, error }] = useUpdateUserPhaseMutation({
 *   variables: {
 *      updateUserPhaseInput: // value for 'updateUserPhaseInput'
 *   },
 * });
 */
export function useUpdateUserPhaseMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserPhaseMutation, UpdateUserPhaseMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateUserPhaseMutation, UpdateUserPhaseMutationVariables>(UpdateUserPhaseDocument, options);
}
export type UpdateUserPhaseMutationHookResult = ReturnType<typeof useUpdateUserPhaseMutation>;
export type UpdateUserPhaseMutationResult = Apollo.MutationResult<UpdateUserPhaseMutation>;
export type UpdateUserPhaseMutationOptions = Apollo.BaseMutationOptions<UpdateUserPhaseMutation, UpdateUserPhaseMutationVariables>;
export const SearchUserDocument = gql`
    query SearchUser($search: String!) {
  searchUser(search: $search) {
    response {
      status
      message
    }
    users {
      id
      email
      firstName
      lastName
      status
      phone
      zipCode
      emailVerified
      createdAt
      updatedAt
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
    }
  }
}
    `;

/**
 * __useSearchUserQuery__
 *
 * To run a query within a React component, call `useSearchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUserQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useSearchUserQuery(baseOptions: Apollo.QueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
}
export function useSearchUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUserQuery, SearchUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchUserQuery, SearchUserQueryVariables>(SearchUserDocument, options);
}
export type SearchUserQueryHookResult = ReturnType<typeof useSearchUserQuery>;
export type SearchUserLazyQueryHookResult = ReturnType<typeof useSearchUserLazyQuery>;
export type SearchUserQueryResult = Apollo.QueryResult<SearchUserQuery, SearchUserQueryVariables>;
export const UpdatePasswordDocument = gql`
    mutation UpdatePassword($updatePasswordInput: UpdatePasswordInput!) {
  updatePassword(updatePasswordInput: $updatePasswordInput) {
    response {
      status
      error
      message
    }
    user {
      id
      firstName
      lastName
      status
      emailVerified
      roles {
        id
        role
        createdAt
        updatedAt
        nextRole {
          states {
            role
            action
          }
        }
      }
      phase {
        id
        name
        order
        isCurrentPhase
        createdAt
        updatedAt
      }
      contactInfo {
        id
        address1
        state
        individualName
        socialSecurityNumber
      }
    }
  }
}
    `;
export type UpdatePasswordMutationFn = Apollo.MutationFunction<UpdatePasswordMutation, UpdatePasswordMutationVariables>;

/**
 * __useUpdatePasswordMutation__
 *
 * To run a mutation, you first call `useUpdatePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePasswordMutation, { data, loading, error }] = useUpdatePasswordMutation({
 *   variables: {
 *      updatePasswordInput: // value for 'updatePasswordInput'
 *   },
 * });
 */
export function useUpdatePasswordMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument, options);
}
export type UpdatePasswordMutationHookResult = ReturnType<typeof useUpdatePasswordMutation>;
export type UpdatePasswordMutationResult = Apollo.MutationResult<UpdatePasswordMutation>;
export type UpdatePasswordMutationOptions = Apollo.BaseMutationOptions<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const RemoveUserDocument = gql`
    mutation RemoveUser($userInput: UserIdInput!) {
  removeUser(user: $userInput) {
    response {
      status
      error
      message
    }
    user {
      id
    }
  }
}
    `;
export type RemoveUserMutationFn = Apollo.MutationFunction<RemoveUserMutation, RemoveUserMutationVariables>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      userInput: // value for 'userInput'
 *   },
 * });
 */
export function useRemoveUserMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserMutation, RemoveUserMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(RemoveUserDocument, options);
}
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<RemoveUserMutation, RemoveUserMutationVariables>;
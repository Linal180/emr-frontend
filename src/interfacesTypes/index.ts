// packages block
import { ComponentType, Dispatch, ReactNode, SetStateAction } from "react";
import { GridSize } from "@material-ui/core";
import { RouteProps } from "react-router-dom";
import { Control, ValidationRule } from "react-hook-form";
import { ApolloQueryResult } from '@apollo/client';
// graphql block
import {
  Location, LoginUserInput, User, CreatePropertyInput, Feature, Tag, Attachment,
  Maybe, Scalars, Property, AttachmentType, TagsPayload, LocationsPayload,
  FeaturesPayload, UpdateRequestInput, Phase, UpdateUserInput, Membership, UserStatus, PhasesPayload, RequestStatus, RegisterUserInput, RoleStates, ContactInfo

} from "../generated/graphql";

export interface PrivateRouteProps extends RouteProps {
  component: ComponentType<any>;
}

type Key = string | number | undefined;
export interface CloseSnackbarProps {
  id: Key;
}
export interface BackdropInputType {
  loading: boolean
}

export interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export interface AppContextProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<React.SetStateAction<boolean>>;
}

export interface ListContextInterface {
  tagsList: TagsPayload["tags"];
  featuresList: FeaturesPayload["features"];
  locationsList: LocationsPayload["locations"];
  setTagsList: Function;
  setFeaturesList: Function;
  setLocationsList: Function;
}

export interface Children {
  children: ReactNode;
}

export interface TableLoaderType {
  numberOfRows: number;
  numberOfColumns: number;
}

export interface ActionLayoutType extends Children {
  hasBorder: boolean
}

export interface OpenElement {
  isOpen: boolean;
  setOpen: Function;
}

export interface DialogTypes {
  isEdit?: boolean;
  refetch?: Function;
  handleClose?: Function;
  isOpen: boolean;
  setOpen?: Function;
}

export interface ConfirmationTypes extends DialogTypes {
  isLoading?: boolean;
  title?: string;
  success?: boolean;
  actionText?: string;
  description?: string;
  handleDelete: () => void;
}

export interface MediaModalTypes extends DialogTypes {
  imageModuleType: AttachmentType;
  itemId: string;
  metaType: string;
  setEdit: Function
  setAttachments: Function;
  attachment?: Attachment;
  attachments?: Attachment[]
}
interface ControlLabel {
  controllerLabel: string | JSX.Element;
}

type LoginControlTypes = "email" | "password";

type UserControlTypes = "email" | "firstName" | "lastName" | "phone" | "zipCode";

export type LocationControlTypes =
  | "name"
  | "description"
  | "detailOverview"
  | "latitude"
  | "longitude"
  | "address";

export type IPropertyControlTypes =
  | "name"
  | "description"
  | "detailOverview"
  | "address"
  | "selectedFeatures"
  | "selectedTags";

export type MediaControlTypes = "title" | "subTitle" | "description";

export interface LoginInputControlProps extends ControlLabel {
  control: Control<LoginUserInput, object>;
  controllerName: LoginControlTypes;
  fieldType: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  isPassword?: boolean;
}

export interface UserUpdateInputControlProps extends ControlLabel {
  control: Control<UpdateUserInput, object>;
  controllerName: UserControlTypes;
  fieldType: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  disable?: boolean
}

export interface CardComponentType extends Children {
  cardTitle: string;
  isEdit?: boolean;
  hideSaveIcon?: boolean;
  disableSaveIcon?: boolean;
  disableEditIcon?: boolean;
  hasEdit?: boolean;
  link?: string;
  onEditClick?: () => void;
  requestLink?: string
}

export interface IPageHeader {
  isOpen?: boolean;
  setOpen?: Function;
  hasComponent?: boolean;
  linkToPage?: string;
  title: string;
  buttonText?: string;
  noAdd?: boolean
}

export interface IMaterialStepper {
  activeStep: number;
  steps: string[];
}

export interface IStepperButtons {
  customActiveStep: number;
  handleNext?: () => void;
  handleBack?: () => void;
  setActiveStep: Function;
  hasBackButton?: boolean;
  isSubmitting?: boolean;
  totalSteps: number;
  module?: string;
}

export type multiOptionType = {
  value: string,
  label: string
}

export interface MultiSelectInterface {
  Options: multiOptionType[];
  label: string;
  name: string;
  placeHolder: string;
  selectedOptions?: string[];
  errors?: string;
}

export interface IDropzoneImage {
  isDisabled?: boolean;
  optionId: string;
  imageModuleType: string;
  image?: { url?: string; id?: string };
  imageLoading: (loader: boolean) => void;
  error?: string
  updateImageData?: string,
  imageForView?: string,
}

export interface DropzoneImageType {
  imageModuleType: AttachmentType;
  isEdit?: boolean;
  attachmentId: string;
  itemId: string;
  metaType: string;
  isDisabled?: boolean;
  attachment?: Attachment;
  handleClose: Function;
  setAttachments: Function;
  setActiveStep?: Function
  reset: Function;
  hasHighlight?: boolean
}
export interface ICreateMediaInput {
  title?: string;
  subTitle?: string;
  description?: string;
}

export interface IFieldTypes {
  label: string | JSX.Element
  isMultiline?: boolean;
  isRequired?: boolean;
  fieldType?: string;
}

export interface ILocationControl extends IFieldTypes {
  fieldName: LocationControlTypes;
  disable?: boolean;
  error?: string;
}

export interface IPropertyControl extends IFieldTypes {
  fieldName: IPropertyControlTypes;
  disable?: boolean;
  errors?: string;
}

export interface UpdatePropertyFeatureInputType {
  features: string[]
}

export type DetailPropertyPageParamsType = {
  id: string
}

export type ParamsType = {
  id: string
}

export interface IUpdatePropertyTagsInput {
  tags: string[]
}

export interface PropertyFeaturesInterface {
  selectedFeatures: Maybe<Maybe<Feature>[]> | undefined;
  propertyId: string
}

export interface PropertyTagsInterface {
  selectedTags: Maybe<Maybe<Tag>[]> | undefined;
  propertyId: string
}

export interface IMediaControl extends IFieldTypes {
  fieldName: MediaControlTypes;
  isDisabled?: boolean;
  control: Control<ICreateMediaInput, object>;
}

export type StateControlTypes = "name";
export interface DetailLocationPageInterface {
  location: Location;
}

export interface DetailPropertyPageInterface {
  property: Property;
}

export interface MediaCardsType {
  itemId: string;
  moduleType: AttachmentType;
  hasCollage?: boolean;
  attachmentsData?: Maybe<Attachment[]> | undefined
  hasHighlights?: boolean
}

interface Message {
  message: string;
}

export interface MediaLocationDataType extends Message {
  location: Location;
}
export interface MediaPropertyDataType extends Message {
  property: Property;
}

export interface MediaCardComponentType {
  title: string;
  setOpen: Function;
  isOpen: boolean;
  setMeta: Function;
  meta: string;
  imageModuleType?: string;
  setAttachment?: Function;
  setAttachments: Function;
  setEdit: Function;
  isEdit: boolean;
  attachments?: Attachment[];
  allAttachments: Attachment[];
}

type ModalPropsTypes = {
  isOpen: boolean;
  isEdit: boolean;
  handleClose: () => void;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  refetch: () => Promise<ApolloQueryResult<any>>;
}

export interface IFeatureCreateModal extends ModalPropsTypes {
  featureData: Feature | null;
}

export interface ITagCreateModal extends ModalPropsTypes {
  tagData: Tag | null;
}

export interface IFeatureTable {
  isFeatureModalOpen: boolean;
  setIsFeatureModalOpen: Dispatch<SetStateAction<boolean>>;
}

export type RecordType = {
  id: string;
  name: string;
}

export type locationData = {
  id: string;
  name: string
}

export type PropertyReviewProps = Omit<CreatePropertyInput, "locationData"> & { locationData: locationData }

export interface PropertyFormInterface {
  address?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  detailOverview?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  locationData?: locationData;
  name?: Maybe<Scalars['String']>;
}

export type OptionType = {
  value: string;
  label: string;
}

export type CreatePropertyInputExtended = Omit<CreatePropertyInput, "tags" | "features" | "locationId"> & { selectedTags?: string[], selectedFeatures?: string[], locationData: locationData };

export interface ITagTable {
  isTagModalOpen: boolean;
  setIsTagModalOpen: Dispatch<React.SetStateAction<boolean>>
}

export interface DataLoaderInterface {
  rows: number,
  hasMedia: boolean;
  columns: GridSize
}

export type TableAlignType = "left" | "center" | "right" | "justify" | "inherit" | undefined;

export interface IDetailCellProps {
  description: string
}

export interface SelectStateType {
  name: string
  loading: boolean
  options: string[]
  value: string | undefined
  error: string | undefined
}

export interface EditRoleModalInterface {
  isEdit: boolean
  isOpen: boolean
  user: User | null
  userRoles: string[]
  setIsEdit: Function
  handleClose: () => void
}

export interface UpdateRoleInputInterface {
  id: string
  roles: string
}

export interface RoleSelectorInterface {
  disable?: boolean
  controllerName: string
  selectDisabled?: boolean
  controllerLabel: string
  selectedOptions?: string
  requestStatus?: RequestStatus
  optionsArray?: multiOptionType[],
  error?: string
}

export type UpdateRequestInputType = Omit<UpdateRequestInput, 'requestStatus'> & { requestStatus: string }
export type notificationType = { url: string, type: string, message: string, channelName: string }
type ResetPasswordControlTypes = "password" | "repeatPassword";
type UpdatePasswordControlTypes = "oldPassword" | "newPassword" | "repeatPassword";

export type ForgetPasswordInputs = {
  email: string
}

export type ResetPasswordInputs = {
  password: string;
  repeatPassword: string;
};

export type UpdatePasswordInputs = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

interface IControlLabel {
  controllerLabel: string | JSX.Element;
  fieldType?: string;
  pattern?: ValidationRule<RegExp> | undefined;
  error?: string;
  isPassword?: boolean;
}
export interface ResetPasswordInputControlProps extends IControlLabel {
  control: Control<ResetPasswordInputs, object>;
  controllerName: ResetPasswordControlTypes;
}

export interface UpdatePasswordInputControlProps extends IControlLabel {
  control: Control<UpdatePasswordInputs, object>;
  controllerName: UpdatePasswordControlTypes;
}

export type UpdatePhaseStatusInput = {
  phase: Phase,
  editable: boolean
};

export interface UserMembershipProps {
  membership: Membership
}

export type PasswordType = "password" | "text";

export interface IShowPasswordProps {
  passwordType: string;
  isPassword: boolean | undefined;
  handleShowPassword: () => void;
}

export type CreateUserInterface = RegisterUserInput & {
  repeatPassword: string;
};

type CreateUserControlTypes = "email" | "password" | "firstName" | "lastName" | "phone" | "repeatPassword" | "zipCode";

export interface CreateUserInputControlProps extends IControlLabel {
  control: Control<CreateUserInterface, object>;
  controllerName: CreateUserControlTypes;
}

export interface ChangePasswordProps {
  id: string
}

export interface UserContactInfoInterface {
  userContactInfo: ContactInfo
}

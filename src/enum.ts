export enum UserRole {
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  USER = 'USER',
  STAFF = 'STAFF',
}

export enum DefaultStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum CompanyStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
}

export enum ReviewStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum AIType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum FeedbackStatus {
  YES = 'YES',
  NO = 'NO',
  DELETED = 'DELETED',
}

export enum QnAStatus {
  YES = 'YES',
  NO = 'NO',
  DELETED = 'DELETED',
}

export enum ContactUsStatus {
  PENDING = 'PENDING',
  REPLIED = 'REPLIED',
}

export enum PermissionAction {
  CREATE = 'Create',
  READ = 'Read',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

export enum LogType {
  LOGIN = 'IN',
  LOGOUT = 'OUT',
}

export enum RedirectType {
  PRODUCT = 'PRODUCT',
  VENDOR = 'VENDOR',
}

export enum PageType {
  ABOUT_US = 'ABOUT US',
  COOKIE_POLICY = 'COOKIE POLICY',
  PRIVACY_POLICY = 'PRIVACY POLICY',
  POSTING_TERMS = 'POSTING TERMS',
  TERMS_AND_SERVICES = 'TERMS & SERVICES',
  EMP_TERMS_AND_SERVICES = 'EMPLOYER TERMS & SERVICES',
  EMP_FAQ = 'EMPLOYER FAQ',
  COMMUNITY = 'COMMUNITY',
  GUIDELINES = 'GUIDELINES',
}

export enum NotificationType {
  // ALL FOR ADMIN AND STAFF
  NEW_PRODUCT = 'NEW PRODUCT',
  NEW_ACCOUNT = 'NEW ACCOUNT',
  CONTACT_US = 'CONTACT US',
  QNA = 'QNA',
  FEEDBACK = 'FEEDBACK',
  INVOICE = 'INVOICE',
  STAFF = 'STAFF',
  TICKET = 'TICKET',

  // ALL FOR VENDOR
  PRODUCT = 'PRODUCT',
  PRODUCT_VIEW = 'PRODUCT VIEW',
  VENDOR_RATING = 'VENDOR RATING',
  VENDOR_ACCOUNT = 'VENDOR ACCOUNT',
  VENDOR_INVOICE = 'VENDOR INVOICE',
  VENDOR_PAYMENT = 'VENDOR PAYMENT',
  VENDOR_TICKET = 'VENDOR TICKET',

  // ALL FOR USER
  USER_PRODUCT = 'USER PRODUCT',
  USER_ACCOUNT = 'USER ACCOUNT',
  USER_INVOICE = 'USER INVOICE',
  USER_PAYMENT = 'USER PAYMENT',
  USER_TICKET = 'USER TICKET',
  OFFER = 'OFFER',

  // FOR ALL
  LOGIN = 'LOGIN',
}

export enum YNStatus {
  All = 'All',
  YES = 'Yes',
  NO = 'No',
}

export enum Feature {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}
export enum RatingShortStatus {
  ASC = 'ASC',
  DESC = 'DESC',
  ALL = 'ALL',
}

export enum LoginType {
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  GUEST = 'GUEST',
}

export enum ADType {
  ASC = 'ASC',
  DESC = 'DESC',
  NONE = '',
}

export enum BannerType {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

export enum ProductFileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum CategoryType {
  NORMAL = 'NORMAL',
  NEW = 'NEW',
  TRENDING = 'TRENDING',
}

export enum LeedStatus {
  NEW = 'NEW',
  CALLED = 'CALLED',
}

export enum JobLocation {
  CURR_LOCATION = 'CURRENT LOCATION',
  PREFFERED_LOCATION = 'PREFFERED LOCATION',
}

export enum EducationLevel {
  TENTH_OR_BELOW_10TH = '10TH OR BELOW 10TH',
  TWOELVETH = 'TWOELVETH',
  DIPLOMA = 'DIPLOMA',
  ITI = 'ITI',
  GRADUATE = 'GRADUATE',
  POST_GRADUATE = 'POST GRADUATE',
}

export enum LanguageLevel {
  NONE = 'NONE',
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCE = 'ADVANCE',
}

export enum SchoolMedium {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  BENGALI = 'Bengali',
  ASSAMESE = 'Assamese',
  GUJARATI = 'Gujarati',
  KANNADA = 'Kannada',
  KASHMIRI = 'Kashmiri',
  KONKANI = 'Konkani',
  MALAYALAM = 'Malayalam',
  MANIPURI = 'Manipuri',
  MARATHI = 'Marathi',
  ODIA = 'Odia',
  PUNJABI = 'Punjabi',
  TAMIL = 'Tamil',
  TELUGU = 'Telugu',
  URDU = 'Urdu',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  BOTH = 'BOTH',
}

export enum Shift {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
}

export enum WorkPlace {
  WORK_FROM_HOME = 'WORK FROM HOME',
  WORK_FROM_OFFICE = 'WORK FROM OFFICE',
  FIELD_JOB = 'FIELD JOB',
}

export enum EmploymentType {
  FULL_TIME = 'FULL TIME',
  PART_TIME = 'PART TIME',
  BOTH = 'BOTH',
}

export enum SalaryType {
  FIXED = 'FIXED',
  FIXED_WITH_INCENTIVE = 'FIXED WITH INCENTIVE',
  INCENTIVE = 'INCENTIVE',
}

export enum ExperienceLevel {
  BOTH = 'BOTH',
  EXPERIENCE = 'EXPERIENCE',
  FRESHER = 'FRESHER',
}

export enum InterviewType {
  WALK_IN = 'WALK IN',
  ONLINE = 'ONLINE',
}

export enum CallPreference {
  YES_MYSELF = 'YES TO MYSELF',
  OTHER_RECRUITER = 'OTHER RECRUITER',
  YES_CANDIDATE = 'YES CANDIDATE CAN CONNECT THROUGH WHATSAPP',
  NO = 'NO',
}

export enum HiringStatus {
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
}

export enum CompanyType {
  PVT = 'PVT',
  LLP = 'LLP',
  PARTNERSHIP = 'PARTNERSHIP',
  PROPO = 'PROPO',
  LTD = 'LTD',
  NGO_OR_TRUST = 'NGO/TRUST',
  OTHERS = 'OTHERS',
}

export enum JobTitleType {
  NEW = 'NEW',
  NORMAL = 'NORMAL',
}

export enum CandidateSelection {
  ALL = 'ALL',
  PENDING = 'PENDING',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

// Basic shared types
export type Tag = {
  color: string;
  label: string;
};

type ImageDetail = {
  note?: string;
  label: string;
  url: string;
};

// Weather types
export type WeatherSummary = {
  forecastTimeTzFormatted: string;
  tempF: string;
  wind?: string;
  precip?: string;
  humidity?: string;
  iconForecast: string;
};

// Labor & Equipment shared types
type CostCodeCell = {
  costCode: string;
  budgetCodeDescription: string;
};

type HoursCell = {
  hours: string;
  hoursTags: Tag[];
};

type BaseRow = {
  costCodeCell: CostCodeCell;
  hoursCell: HoursCell;
  notesCell: string;
};

// Labor specific types
type LaborNameCell = {
  crewName: string;
  crewHours: string;
  signatureFileUrl: string;
  signatureTimeStamp: string;
  nameCellRowSpan: number;
  crewTags: Tag[];
};

type LaborNameRow = BaseRow & {
  nameCell: LaborNameCell;
};

export type LaborDetail = {
  nameRow: LaborNameRow;
  additionalCostCodeRows: BaseRow[];
};

// Equipment specific types
type EquipmentNameCell = {
  equipName: string;
  equipHours: string;
  nameCellRowSpan: number;
  equipTags: Tag[];
};

type EquipmentNameRow = BaseRow & {
  nameCell: EquipmentNameCell;
};

export type EquipmentDetail = {
  nameRow: EquipmentNameRow;
  additionalCostCodeRows: BaseRow[];
};

// Questions types
type QuestionResponse = {
  questionSortOrder: number;
  questionText: string;
  responseValue: string;
  localTzResponseTimeStamp: string;
};

type QuestionDetail = {
  fullName: string;
  responses: QuestionResponse[];
};

// Quantities types
type QuantityDetail = {
  itemNumber: string;
  _projectNumber?: string;
  _costCodeAndDescription?: string;
  _UOM?: string;
  _projectLocationCode?: string;
  _periodQty?: string;
  _toDateQty?: string;
  _note?: string;
};

// Deliveries types
type DeliveryDetail = {
  itemNumber: string;
  deliveryTimeLocalString: string;
  deliveryFrom: string;
  deliveryTrackingNumber: string;
  deliveryLocation: string;
  deliveryContents: string;
  deliveryNotes: string;
};

// Inspections types
type InspectionDetail = {
  itemNumber: string;
  startTimeLocalString: string;
  endTimeLocalString: string;
  inspectionType: string;
  inspectionEntity: string;
  inspectorName: string;
  inspectionLocation: string;
  inspectionArea: string;
  inspectionNotes: string;
};

// Visitors types
type VisitorDetail = {
  itemNumber: string;
  visitorName: string;
  startTimeLocalString: string;
  endTimeLocalString: string;
  visitorNotes: string;
  userFullName?: string;
};

// Notes types
type NoteDetail = {
  itemNumber: string;
  noteLocation: string;
  notes: string;
  _userFullName?: string;
};

// Section types with common patterns
type SectionWithDetails<T> = {
  details: T[];
};

type SectionWithImages = {
  images: ImageDetail[];
};

type SectionWithTotalHours<T> = SectionWithDetails<T> & {
  totalHours: string;
  hasNotes: boolean;
};

// Daily Log type
export type DailyLog = {
  dailyLogDate: string;
  projectNumber: string;
  projectName: string;
  address: string;
  lastPage: boolean;
  weather: {
    summary: WeatherSummary[];
  };
  labor: SectionWithTotalHours<LaborDetail>;
  equipment?: SectionWithTotalHours<EquipmentDetail>;
  questions?: SectionWithDetails<QuestionDetail>;
  quantities?: SectionWithDetails<QuantityDetail> & SectionWithImages;
  deliveries?: SectionWithDetails<DeliveryDetail> & SectionWithImages;
  inspections?: SectionWithDetails<InspectionDetail> & SectionWithImages;
  visitors?: SectionWithDetails<VisitorDetail>;
  notes?: SectionWithDetails<NoteDetail>;
  images?: {
    details: ImageDetail[];
  };
};

// Main Daily Report type
export type DailyReport = {
  companyName: string;
  companyLogo: string;
  printedDateTime: string;
  hoursLabels: string;
  preparedBy: string;
  printedBy: string;
  dailyLogs: DailyLog[];
};

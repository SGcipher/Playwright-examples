export type ReportName = 'underwriting' | 'pricing-model';

export type ReportTabName = 'product' | 'subproducts' | 'date-ranges' | 'factors' | 'filter';

export type Products = 'motor' | 'home' | 'pet';

export type UISubproducts = 'car' | 'comprehensive' | 'third-party' | 'third-party-fire-theft';

export interface DateRange {
  fromDate: string;
  toDate: string;
}

export interface GroupingColumn {
  column?: {
    name: string;
    type: string;
  };
}

export type GroupingColumns = GroupingColumn[];

export interface PricingReportOptions {
  product: Products;
  subproducts: UISubproducts[];
  dateRange: DateRange;
  groupingColumns?: GroupingColumns;
}

export type ReportServices = 'PRICING_MODEL' | 'UNDERWRITING_REPORT' | 'PORTFOLIO_REPORT' | 'CLAIMS_TRIANGLES';

export type Metrics = {
  column1: string;
  agg1: string;
  operation?: string;
  column2?: string;
  agg2?: string;
  xFactorOperation?: string;
  xFactor?: string;
  alias: string;
};


import reportOutputDefaults from '../../../fixtures/pricing/defaultUnderwritingReportRequests.json';
import { Products, PricingReportOptions } from '../../utils/helpers/types/ReportTypes';

export class UnderwritingService {
    async reportReqBody(product: string, customReport: boolean): Promise<PricingReportOptions> {
        const reportOutputDefaultsCopy = JSON.parse(JSON.stringify(reportOutputDefaults));
        const requestBody = reportOutputDefaultsCopy.items.find(
            (x) => x.body.product === product && x.customReport === customReport,
        ).body;

        return requestBody as PricingReportOptions;
    }
}

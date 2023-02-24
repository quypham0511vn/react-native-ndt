import { BaseService } from './base-service';
import { API_CONFIG } from './constants';
export class ReportServices extends BaseService {

    requestFinanceReport = async (
        quarters: string,
        year: string
    ) => this.api().post(API_CONFIG.REQUEST_FINANCE_REPORT, this.buildFormData({
        quarters,
        year
    }));

    getYear =async () => this.api().post(API_CONFIG.GET_YEARS, this.buildFormData({}));

    getQuarters =async () => this.api().post(API_CONFIG.GET_QUARTERS, this.buildFormData({}));
}

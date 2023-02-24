
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class CommonServices extends BaseService {
    getListInvest = async (pageSize: number, lastIndex: number) =>
        this.api().post(
            API_CONFIG.CONTRACTS_HOT,
            this.buildFormData({
                per_page: pageSize,
                uriSegment: lastIndex
            })
        );

    getContractsDash = async () => this.api().post(API_CONFIG.CONTRACTS_DASH, {});

    getBanners = async () => this.api().post(API_CONFIG.GET_BANNERS, {});

    getBannerHome = async () => this.api().post(API_CONFIG.GET_BANNERS_HOME, {});

    getAppInReview = async () => this.api().post(API_CONFIG.CHECK_APP_REVIEW);

    getAppConfig = async () => this.api().get(API_CONFIG.GET_APP_CONFIG);

    ratingApp = async (point: number, note: string) =>
        this.api().post(
            API_CONFIG.RATING_APP,
            this.buildFormData({
                point,
                note
            })
        );
}


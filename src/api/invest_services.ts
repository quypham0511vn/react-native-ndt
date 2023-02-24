import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class InvestServices extends BaseService {
    getInvestDetail = async (id: string) => this.api().post(API_CONFIG.CONTRACT_DETAIL, this.buildFormData({ id }));

    getInvestHaveContract = async (id: string) => this.api().post(API_CONFIG.CONTRACT_HAVE_INVESTED, this.buildFormData({ id }));

    getAllContractInvest = async (textSearch: string, timeInvestment: string, moneyInvestment: string, uriSegment: number, per_page: number) => this.api().post(API_CONFIG.CONTRACTS_HOT, this.buildFormData({
        text: textSearch,
        loan: timeInvestment,
        money: moneyInvestment,
        per_page,
        uriSegment
    }));

    getListContractInvesting = async (option:string,textSearch: string, money: string, fdate: string, tdate: string, uriSegment: number, per_page: number) => this.api().post(API_CONFIG.LIST_CONTRACT_INVESTING, this.buildFormData({
        option,
        fdate,
        tdate,
        money,
        text:textSearch,
        per_page,
        uriSegment
    }));

    getDetailInvestNow = async (id: string) => this.api().post(API_CONFIG.CONTRACT_DETAIL_INVEST_NOW, this.buildFormData({ id }));

    getNotify = async (limit: number, offset: number, option: number) => this.api().post(API_CONFIG.NOTIFICATION, this.buildFormData({ limit, offset, option }));

    getNotifyOnRead = async () => this.api().post(API_CONFIG.GET_ONREAD_COUNT_NOTIFICATION, this.buildFormData({}));

    getNotifyUpdateRead = async (noti_id: number) => this.api().post(API_CONFIG.NOTIFY_UPDATE_READ, this.buildFormData({ noti_id }));

    getInfoInvest = async () => this.api(true).post(API_CONFIG.GET_INFOR_INVESTOR, this.buildFormData({

    }));

    getOTP = async (id: string) => this.api().post(API_CONFIG.CONTRACT_OTP, this.buildFormData({ contract_id: id }));


    requestNganLuong = async (id: string, platform: string) => this.api(true).post(API_CONFIG.REQUEST_NGAN_LUONG, this.buildFormData({
        contract_id: id,
        client_code: platform
    }));

    confirmInvest = async (id: string, otp: string) => this.api().post(API_CONFIG.CONFIRM_INVEST, this.buildFormData({
        contract_id: id,
        otp_invest: otp
    }));

    getListTimeInvestment = async () => this.api().post(API_CONFIG.LIST_TIME_INVESTMENT, this.buildFormData({}));

    getListMoneyInvestment = async () => this.api().post(API_CONFIG.LIST_MONEY_INVESTMENT, this.buildFormData({}));

    getInvestBankInfo = async (id: string, platform: string) => this.api(true).post(API_CONFIG.INVEST_BANK, this.buildFormData({
        contract_id: id,
        client_code: platform
    }));

    checkBill = async (bill_id: string) => this.api().post(API_CONFIG.CHECK_BILL, this.buildFormData({bill_id}));
}

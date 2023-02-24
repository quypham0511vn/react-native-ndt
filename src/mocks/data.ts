import { ENUM_INVEST_MONEY } from '@/common/constants';
import Languages from '@/common/Languages';
import { KeyValueModel } from '@/models/keyValue-model';
import { UserInfoModal } from '@/models/user-models';

export const TransactionTypes = [
    { label: Languages.transaction.all, value: 1, type: 'all' },
    { label: Languages.transaction.inMoney, value: 2, type: 'investor' },
    { label: Languages.transaction.outMoney, value: 3, type: 'pay' }
] as KeyValueModel[];

export const dataUser = {
    full_name: 'Pham Minh Quý',
    phone_number: '0353826750',
    gender: 'Nam',
    accuracy: 3,
    front_card: '',
    card_back: '',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAznG13WJ4ayysR3Q07BNXsRTdDbP0PQ_Efw&usqp=CAU',
    id_fblogin: '1',
    id_google: '1',
    user_apple: '1'
} as unknown as UserInfoModal;

export const arrayData = [
    {
        id: '1',
        value: '500000',
        interestRate: '5%',
        expInterest: '10000',
        time: '5 tháng',
        format: 'Lãi hàng tháng gốc hàng tháng'

    },
    {
        id: '2',
        value: '200000',
        interestRate: '5%',
        expInterest: '10000',
        time: '3 tháng',
        format: 'Lãi hàng tháng gốc hàng tháng'

    },
    {
        id: '3',
        value: '500000',
        interestRate: '5%',
        expInterest: '10000',
        time: '5 tháng',
        format: 'Lãi hàng tháng gốc hàng tháng'

    }
];

export const typePhoto = [
    { id: '1', value: 'Máy ảnh', text: 'Camera' },
    { id: '2', value: 'Thư viện', text: 'Library' }
];

export const investData = [
    {
        amountMoney: 5e5,
        percent: '0.5%',
        intent: 100000000,
        time: '3 tháng',
        formality: 'Lãi gốc hàng tháng',
        id: 1,
        interest: 1000000
    },
    {
        amountMoney: 8e6,
        percent: '0.5%',
        intent: 100000000,
        time: '6 tháng',
        formality: 'Lãi gốc hàng tháng',
        id: 2,
        interest: 1000000
    },
    {
        amountMoney: 8e7,
        percent: '0.5%',
        intent: 100000000,
        time: '3 tháng',
        formality: 'Lãi gốc hàng tháng',
        id: 3,
        interest: 1000000
    },
    {
        amountMoney: 8e8,
        percent: '0.5%',
        intent: 100000000,
        time: '3 tháng',
        formality: 'Lãi gốc hàng tháng',
        id: 4,
        interest: 1000000
    }
];
export const arrMoney = [
    { id: '1', value: ENUM_INVEST_MONEY.BELOW_10 },
    { id: '2', value: ENUM_INVEST_MONEY.ABOUT_10_50 },
    { id: '3', value: ENUM_INVEST_MONEY.ABOUT_50_100 },
    { id: '4', value: ENUM_INVEST_MONEY.ABOVE_100 }
];

export const arrMonth = [
    { id: '1', value: '1 tháng' },
    { id: '2', value: '3 tháng' },
    { id: '3', value: '6 tháng' },
    { id: '4', value: '9 tháng' },
    { id: '5', value: '12 tháng' },
    { id: '6', value: '18 tháng' },
    { id: '7', value: '24 tháng' }
];

export const typeGender = [
    { id: '1', value: 'Nam', text: 'male' },
    { id: '2', value: 'Nữ', text: 'female' }
];

export const dataRatingPoint = [
    { id: '1', value: 'Tệ' },
    { id: '2', value: 'Khá tệ' },
    { id: '3', value: 'Tạm được' },
    { id: '4', value: 'Tốt' },
    { id: '5', value: 'Xuất sắc' }
];

export const typeTransaction = [
    { id: '1', value: 'Trả lãi' },
    { id: '2', value: 'Đầu tư ' }
];

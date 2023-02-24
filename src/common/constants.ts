import Languages from './Languages';

export const DELAY_CLICK = 3e2;

export const QUARTER = [' Quý 1', ' Quý 2', 'Quý 3', 'Quý 4'];
export const PHONE_PREFIX = '+84';

export const PHONE_REGEX = /^0+[3,5,7,8,9]{1}[0-9]{1}[1-9]{1}[0-9]{6}$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const EMAIL_REGEX = /^[\w+][\w\.\-]+@[\w\-]+(\.\w{2,10})+$/;
export const PASSWORD_REGEX = /^\w{6,20}$/;
export enum Events {
    TOAST = 'TOAST',
    LOGOUT = 'LOGOUT',
    SWITCH_KEYBOARD = 'SWITCH_KEYBOARD',
}
export enum ToastTypes {
    ERR = 0, //  red background
    MSG = 1, // dark blue background
    SUCCESS = 2, // green background
}
export enum StorageKeys {
    KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN',
    KEY_DEVICE_TOKEN = 'KEY_DEVICE_TOKEN',
    KEY_DEVICE_TOKEN_FIREBASE = 'KEY_DEVICE_TOKEN_FIREBASE',
    KEY_USER_INFO = 'KEY_USER_INFO',
    KEY_SKIP_ONBOARDING = 'KEY_SKIP_ONBOARDING',
    KEY_LAST_POSITION = 'KEY_LAST_POSITION',
    KEY_LAST_LOGIN_INFO = 'KEY_LAST_LOGIN_INFO',
    KEY_LATEST_NOTIFY_ID = 'KEY_LATEST_NOTIFY_ID',
    KEY_SAVED_API_VERSION = 'KEY_SAVED_API_VERSION',
    KEY_BIOMETRY_TYPE = 'KEY_BIOMETRY_TYPE',
    KEY_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PASSCODE = 'KEY_PASSCODE',
    KEY_RATE = 'KEY_RATING',
    KEY_ENABLE_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PIN = 'KEY_PIN',
    KEY_TEMP_DATA_FOR_PROPERTY_VALUATION = 'TEMP_DATA_FOR_PROPERTY_VALUATION',
    KEY_SAVE_LOGIN_PHONE = 'KEY_SAVE_LOGIN_PHONE',
    KEY_SAVE_LOGIN_PASS = 'KEY_SAVE_LOGIN_PASS '
}
export enum ENUM_BIOMETRIC_TYPE {
    TOUCH_ID = 'TouchID',
    FACE_ID = 'FaceID',
    KEY_PIN = 'KEY_PIN'
}
export function messageError(value: string) {
    switch (value) {
        case ERROR_BIOMETRIC.RCTTouchIDNotSupported:
            return Languages.errorBiometryType.RCTTouchIDNotSupported;
        case ERROR_BIOMETRIC.RCTTouchIDUnknownError:
            return Languages.errorBiometryType.RCTTouchIDUnknownError;
        case ERROR_BIOMETRIC.LAErrorTouchIDNotEnrolled:
            return Languages.errorBiometryType.LAErrorTouchIDNotEnrolled;
        case ERROR_BIOMETRIC.LAErrorTouchIDLockout:
            return Languages.errorBiometryType.LAErrorTouchIDLockout;
        case ERROR_BIOMETRIC.NOT_ENROLLED:
            return Languages.errorBiometryType.NOT_ENROLLED;
        case ERROR_BIOMETRIC.ErrorFaceId:
            return Languages.errorBiometryType.ErrorFaceId;
        default:
            return Languages.errorBiometryType.NOT_DEFINE;
    }
}
export enum ERROR_BIOMETRIC {
    // ios
    RCTTouchIDNotSupported = 'RCTTouchIDNotSupported',
    RCTTouchIDUnknownError = 'RCTTouchIDUnknownError',
    LAErrorTouchIDNotEnrolled = 'LAErrorTouchIDNotEnrolled',
    LAErrorTouchIDNotAvailable = 'LAErrorTouchIDNotAvailable',
    LAErrorTouchIDLockout = 'LAErrorTouchIDLockout',
    LAErrorAuthenticationFailed = 'LAErrorAuthenticationFailed',
    // android
    NOT_SUPPORTED = 'NOT_SUPPORTED',
    NOT_AVAILABLE = 'NOT_AVAILABLE',
    NOT_ENROLLED = 'NOT_ENROLLED',
    FINGERPRINT_ERROR_LOCKOUT_PERMANENT = 'FINGERPRINT_ERROR_LOCKOUT_PERMANENT',
    ErrorFaceId = 'ErrorFaceId',
    FINGERPRINT_ERROR_LOCKOUT = 'FINGERPRINT_ERROR_LOCKOUT',
}
export const noteKYC = [
    '1. Mặt trước rõ, đủ 4 góc',
    '2. Không chụp giấy tờ tuỳ thân photo, chụp thông qua màn hình thiết bị điện tử.'
];

export const noteAvatar = [
    '1. Chụp cận mặt, rõ, thẳng góc, không bị che, không chụp quá xa.',
    '2. Không chụp chân dung từ ảnh, màn hình thiết bị điện tử.'
];

export enum ErrorCodes {
    SUCCESS = 0,
    IMAGE_LIMIT_SIZE = 1,
};

export enum GET_TYPE_PHOTO {
    CAMERA = 'Camera',
    LIBRARY = 'Library',
};

export enum GET_LINK_INVESTOR {
    LINK_IOS = 'https://apps.apple.com/ph/app/tienngay-vn-investor/id1563318851',
    LINK_ANDROID = 'https://play.google.com/store/apps/details?id=vn.tienngay.investor&hl=en_US&gl=US'
};

export enum ENUM_PROVIDER {
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    APPLE = 'apple'
};

export const configGoogleSignIn = {
    webClientId:
        '393388576958-sm1fbp2f3hk82bg654ku148hemhjpdhr.apps.googleusercontent.com'
};

export enum ENUM_INVEST_STATUS {
    INVEST_NOW = 'INVEST_NOW',
    INVESTING = 'INVESTING',
    HISTORY = 'HISTORY'
};

export enum ENUM_INVEST_MONEY {
    BELOW_10 = 'Dưới 10.000.000 VNĐ',
    ABOUT_10_50 = '10.000.000 - Dưới 50.000.000 VNĐ',
    ABOUT_50_100 = '50.000.000 - Dưới 100.000.000 VNĐ',
    ABOVE_100 = 'Trên 100.000.000 VNĐ'
};

export enum ENUM_INVEST_NOTIFY {
    NOTIFY_ALL = 'NOTIFY_ALL',
    UNREAD = 'UNREAD'
};

export enum ENUM_METHOD_PAYMENT {
    VIMO = 'VIMO',
    NGAN_LUONG = 'NGAN_LUONG',
    BANK = 'BANK'
};

export enum ENUM_TYPE_CARD_BANK {
    ACCOUNT_NUMBER = 'Số tài khoản',
    ATM_NUMBER = 'Số thẻ ATM'
};

export enum LINK_TIENNGAY {
    LINK_TIENNGAY_WEB = 'https://tienngay.vn/',
    LINK_TIENNGAY_FACEBOOK = 'https://www.facebook.com/tienngay.vn/'
};


export enum LINKS {
    WEB = 'https://tienngay.vn/',
    VPS = 'https://openaccount.vps.com.vn/?MKTID=H787',
    ABOUT_US = 'https://tienngay.vn/home/aboutus',
    POLICY = 'https://tienngay.vn/app-privacy-policy',
    FAQ = 'https://tienngay.vn/home/faqs',
    FB_FAN_PAGE = 'https://www.facebook.com/groups/425567338856999',
    STORE_ANDROID = 'https://play.google.com/store/apps/details?id=vn.tienngay.customer',
    STORE_IOS = 'https://apps.apple.com/id/app/tienngay-customer/id1560920806'
};

export enum COLOR_TRANSACTION {
    RED = 'red',
    YELLOW = 'yellow',
    GREEN = 'green',
};

export enum STATE_LINK {
    LINKING = 'Đang liên kết',
};

export enum TYPE_INTEREST_RECEIVE_ACC {
    VIMO = 'vimo',
    BANK = 'bank',
    NGAN_LUONG = 'ngan_luong',
    MOMO = 'momo'
};

export enum STATE_VERIFY_ACC {
    VERIFIED = 'Đã xác nhận thông tin',
    WAIT = 'Chờ TienNgay xác nhận thông tin',
    NO_VERIFIED = 'Cần xác thực thông tin CMT/CCCD'
};
export enum ENUM_STATUS_CONTRACT {
    PAID = 'Đã thanh toán',
    PROGRESSING = 'Đang xử lý',
    LIMITATION = 'Đến hạn'

}
export enum ENUM_INVESTED_TYPE {
    INVESTING = '1',
    INVESTED = '2'
}

export enum ENUM_TYPE_CAMERA {
    FACE = 'face',
    CARD = 'card',
}

export enum ENUM_TYPE_CARD_CAMERA {
    FRONT = 'front',
    BACK = 'back',
}

export enum TYPE_RESIZE {
    COVER = 'cover',
    CONTAINER = 'container',
    STRETCH = 'stretch',
    CENTER = 'center',
    REPEAT = 'repeat'
};

export enum TYPE_FORMAT_HEADER_BAR {
    LIGHT_CONTENT = 'light-content',
    DARK_CONTENT = 'dark-content'
};

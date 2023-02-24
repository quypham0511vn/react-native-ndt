import Languages from '@/common/Languages';
import Validate from './Validate';

const validateEmoji = (username: string) => /!(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
    username
);
const validateSpecialCharacters = (username: string) => {
    const reg = /^[a-zA-Z- ]+$/;
    return reg.test(removeAscent(username));
};
const validateNumber = (username: string) => {
    const reg = /^([^0-9]*)$/;
    return reg.test(username);
};
const validatePhone = (username: string) => {
    const reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return reg.test(username);
};
const validateEmail = (email: string) => email.match(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
);

const validateBirthday = (birthday: string) => {
    const regexVar = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    return regexVar.test(birthday);
};

function removeAscent(str: string) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    return str;
}

function userNameValidate(userName: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(userName)) {
        errMsg = Languages.errorMsg.userNameRequired;
    } else if (userName.length < 8) {
        errMsg = Languages.errorMsg.userNameLength;
    } else if (!validateEmoji(userName) && !validateNumber(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    } else if (!validateSpecialCharacters(userName)) {
        errMsg = Languages.errorMsg.userNameRegex;
    }
    return errMsg;
}

function genderValidate(gender: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(gender)) {
        errMsg = Languages.errorMsg.genderRequired;
    }
    return errMsg;
}

function referralValidate(gender: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(gender)) {
        errMsg = Languages.errorMsg.referralRequired;
    }
    return errMsg;
}

function emailValidate(email: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(email)) {
        errMsg = Languages.errorMsg.emailNull;
    } else if (!validateEmail(email)) {
        errMsg = Languages.errorMsg.emailRegex;
    }
    return errMsg;
}
function cardValidate(card: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(card)) {
        errMsg = Languages.errorMsg.cardNull;
    } else if (Number(card.length) !== 9 && card.length !== 12) {
        errMsg = Languages.errorMsg.cardCheck;
    } else if (validateNumber(card)) {
        errMsg = Languages.errorMsg.cardRegex;
    }
    return errMsg;
}

function passValidate(pwd: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(pwd)) {
        errMsg = Languages.errorMsg.pwdNull;
    } else if (pwd.length < 8) {
        errMsg = Languages.errorMsg.pwdCheck;
    }
    return errMsg;
}
function passConFirmValidate(conFirmPwd: string, pwd?: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(conFirmPwd)) {
        errMsg = Languages.errorMsg.pwdNull;
    } else if (conFirmPwd !== pwd) {
        errMsg = Languages.errorMsg.conFirmPwd;
    }
    return errMsg;
}
function passConFirmPhone(phone: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(phone)) {
        errMsg = Languages.errorMsg.phoneIsEmpty;
    } else if (!validatePhone(phone)) {
        errMsg = Languages.errorMsg.phoneRegex;
    } else if (phone.length < 10 || phone.length > 10) {
        errMsg = Languages.errorMsg.phoneCount;
    }
    return errMsg;
}

function inputNameEmpty(value: any, errEmpty: string, errCharacters?: any) {
    let errMsg = '';
    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    } else if (!validateSpecialCharacters(value)) {
        errMsg = errCharacters;
    }
    return errMsg;
}

function addressValidate(address: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(address)) {
        errMsg = Languages.errorMsg.addressNull;
    }
    return errMsg;
}

function jobValidate(job: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(job)) {
        errMsg = Languages.errorMsg.jobNull;
    } else if (!validateSpecialCharacters(job)) {
        errMsg = Languages.errorMsg.jobRegex;
    }
    return errMsg;
}

function birthdayValidate(birthday: string) {
    let errMsg = '';
    const today = new Date();
    const todayYear = today.getFullYear().toString();
    const birthdayCurrent = birthday.toString().split('/', 4)[2];

    if (Validate.isStringEmpty(birthday.toString())) {
        errMsg = Languages.errorMsg.birthdayNull;
    } else if (!validateBirthday(birthday.toString())) {
        errMsg = Languages.errorMsg.birthdayRegex;
    } else if (Number(todayYear) - Number(birthdayCurrent) < 18) {
        errMsg = Languages.errorMsg.birthdayCompare18;
    }
    return errMsg;
}

function inputValidate(
    value: any,
    errEmpty: string,
    errSyntax?: any,
    numOperator?: number,
    isBankAccount?: boolean,
    isATM?: boolean
) {
    let errMsg = '';
    const number = numOperator || 16;

    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
        // } else if (isBankAccount && (value.length < 8 || value.length > 16)){
        //     errMsg = Languages.errorMsg.errSyntaxBank;
    } else if (isBankAccount && validateNumber(`${value}`)) {
        errMsg = Languages.errorMsg.errNotNumberBank;
    } else if (isATM && (value.length !== 16 && value.length !== 19)) {
        errMsg = Languages.errorMsg.errSyntaxATM;
    } else if (isATM && validateNumber(`${value}`)) {
        errMsg = Languages.errorMsg.errNotNumberATM;
    } else if (value.length > number) {
        errMsg = errSyntax;
    }
    return errMsg;
}

function inputEmpty(value: any, errEmpty: string) {
    let errMsg = '';
    if (Validate.isStringEmpty(value)) {
        errMsg = errEmpty;
    }
    return errMsg;
}

export default {
    userNameValidate,
    emailValidate,
    cardValidate,
    passValidate,
    passConFirmValidate,
    passConFirmPhone,
    inputNameEmpty,
    genderValidate,
    addressValidate,
    jobValidate,
    birthdayValidate,
    inputValidate,
    removeAscent,
    inputEmpty,
    referralValidate
};

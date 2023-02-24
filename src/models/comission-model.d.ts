export interface CommissionModel {
    total: Total
    detail: Detail[]
}

export interface Total {
    total_money: string
    commission: number
    money_commission: string
}

export interface Detail {
    name: string
    total_money: string
    money_commission: string
}


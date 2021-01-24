import Decimal from "decimal.js";

const amortSchedule = (loanValue, paymentValue, rateValue, extraPayment, lumpSum) => {
    let principal = new Decimal(loanValue).toDecimalPlaces(2);
    let payment = new Decimal(paymentValue).toDecimalPlaces(2);
    let monthlyRate = new Decimal(rateValue).mul(.01).div(12).toDecimalPlaces(12);
    let extra = new Decimal(extraPayment).toDecimalPlaces(2);
    let lump = new Decimal(lumpSum).toDecimalPlaces(2);
    let interestPayment = monthlyRate.mul(principal).toDecimalPlaces(2);
    let principalPayment = payment.minus(interestPayment);
    let remainingPrincipal = principal.sub(principalPayment.plus(extra).plus(lump));
    let schedule = [];
    schedule.push(amortRowObject(principal, principalPayment, interestPayment, extra, lump))
    while (remainingPrincipal.greaterThan(0)) {
        interestPayment = monthlyRate.mul(remainingPrincipal).toDecimalPlaces(2);
        principalPayment = payment.minus(interestPayment);
        schedule.push(amortRowObject(remainingPrincipal, principalPayment, interestPayment, extra, lump));
        remainingPrincipal = remainingPrincipal.sub(principalPayment.plus(extra).plus(lump));
    }
    return schedule
}

const amortRowObject = (principal, principalPayment, interestPayment, extraPayment, lumpSum) => {
    return {
        principal: principal.toNumber(),
        principalPayment: principalPayment.toNumber(),
        interestPayment: interestPayment.toNumber(),
        extraPayment: extraPayment.toNumber(),
        lumpSum: lumpSum.toNumber()
    }
}

export {
    amortSchedule,
    amortRowObject
}
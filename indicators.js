function calcRSI(closes) {
    let altas = 0;
    let baixas = 0;

    for (let i = closes.length - 15; i < closes.length - 1; i++) {
        const diferenca = closes[i] - closes[i - 1];
        if (diferenca >= 0)
            altas += diferenca;
        else
            baixas -= diferenca;
    }

    const forcaRelativa = altas / baixas;
    return 100 - (100 / (1 + forcaRelativa));
}

function rsi(closes) {
    let altas = 0;
    let baixas = 0;

    return result = [6, 14, 24].map( period => {
        for (let i = closes.length - period + 1; i < closes.length - 1; i++) {
            const diferenca = closes[i] - closes[i - 1];
            if (diferenca >= 0)
                altas += diferenca;
            else
                baixas -= diferenca;
        }
    
        const forcaRelativa = altas / baixas;
        return 100 - (100 / (1 + forcaRelativa));
    });
}

module.exports = { calcRSI, rsi };
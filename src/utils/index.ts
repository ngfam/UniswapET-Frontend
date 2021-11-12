export function numberWithCommas(x: number, usingSuffix: boolean = false) {
    let suffix = ''
    if (usingSuffix) {
        if (x >= 1000000000) {
            suffix = 'B'
            x /= 1000000000
        } else if (x >= 1000000) {
            suffix = 'M'
            x /= 1000000
        } else if (x >= 1000) {
            suffix = 'K'
            x /= 1000
        }
    }

    return x.toFixed(usingSuffix ? 2 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
}
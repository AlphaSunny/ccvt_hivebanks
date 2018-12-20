//---------------------------------正则表达式-----------------------------
//Ethereum address check
function ethAddressCheck(str) {
    var regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.exec(str);
}
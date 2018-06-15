/**
 * Created by liangshuang on 18/1/17.
 */
export default function currency(value, currency, decimals) {
  const digitsRE = /(\d{3})(?=\d)/g
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : ''
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}

export function toThousands(num) {
  if((num+"").trim() === ""){
    return"";
  }
  if(isNaN(num)){
    return"";
  }
  num = num+"";
  if(/^.*\..*$/.test(num)){
    var pointIndex =num.lastIndexOf(".");
    var intPart = num.substring(0,pointIndex);
    var pointPart =num.substring(pointIndex+1,num.length);
    intPart = intPart +"";
    var re =/(-?\d+)(\d{3})/
    while(re.test(intPart)){
      intPart =intPart.replace(re,"$1,$2")
    }
    num = intPart+"."+pointPart;
  }else{
    num = num +"";
    var re =/(-?\d+)(\d{3})/
    while(re.test(num)){
      num =num.replace(re,"$1,$2")
    }
  }
  return num
}

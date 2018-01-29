/**
 * Created by liangshuang on 18/1/17.
 */
/*百分数转小数*/
export default function percent(num) {
  if(num && num.indexOf("%")){
    var str=num.replace("%","");
    str= str/100;
    return str;
  }
}

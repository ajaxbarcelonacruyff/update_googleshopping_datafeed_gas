const FILEKEY = 'xxxxxxxxxxxxxx'; 
const BOOK = SpreadsheetApp.openById(FILEKEY);
const SHEETNAME ='Sheet1';
const LOGSHEET = 'log';
const MAXROWS = 1000;
const DEFAULT_STARTROW = 2;
const PARAMS = [
    {'key':'id', 'path':'.id'},
    {'key':'title', 'path':'h1.title'},
    {'key':'description', 'path':'.productDescription'},
    {'key':'link', 'path':'h1.title'},
    {'key':'condition', 'path':'.productCondition'},
    {'key':'price', 'path':'.priceValue'},
    {'key':'availability', 'path':'.productStock'},
    {'key':'image', 'path':'img.src'},
    {'key':'gtin','path':'test'},
    {'key':'mpn','path':'test'},
    {'key':'brand','path':'.productBrand'}
  ];

function main (){
  // 結果を書き込むシートのオブジェクトを取得
  var sheetData = book.getSheetByName(SHEETNAME);
  // スクレイピング開始行を取得
  var startRow = getLatestRow();
  startRow = (startRow >= sheetData.getLastRow()) ? DEFAULT_STARTROW : startRow;
  // スクレイピング開始行以降のURLを取得
  var urls = getURLs(sheetData);
  // スクレイピングを実行し、結果を配列resultsに格納
  var results =[]; 
  for(var i = 0; i < urls.length; i++){
    var result = scrape(urls[i]);
    results.push(result);
  }
  // 結果をシートに上書き
  writeResult(sheetData,results, startRow, 1);
}

function getLatestRow(){
  var sheet =book.getSheetByName(LOGSHEET);
  var row = sheet.getRange(sheet.getDataRange().getLastRow(),2,1,1).getValue();
  return row;
}

function setLatestRow(row){
  var sheet =book.getSheetByName(LOGSHEET);
  var result = [[formatDateTimeAsString(new Date()),row]];
  sheet.getRange(sheet.getDataRange().getLastRow()+1,1,result.length, result[0].length).setValues(result);
}

function getURLs(sheetData){
  var ret = [];
  var urls = sheetData.getRange(2,4,sheetData.getDataRange().getLastRow(),1).getValues();
  for(var i = 0; i < urls.length; i++){
    if(i < MAXROWS){
      ret.push(urls[i][0]);
    }else{
      break;
    }
  }
  return ret; 
}

function scrape(url){
	// Scraping, you need a header.
  const postheader = {
    "useragent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36",
    "accept":"gzip, */*",
    "timeout":"20000"
  }  

  var result = [];
  if(!(url.length> 0 && url.indexOf('http') >= 0)){
      result = ['','','',url,'','','',''];
      Logger.log("url =" +  url.length +"\t" + url.indexOf('http') +"\t" + url);
      return result;
  }
  try{
    var content = UrlFetchApp.fetch(url).getContentText("UTF-8");
    var $ = Cheerio.load(content);
  }catch(e){
    result = ['','','',url,'','','',''];
    Logger.log("url ="+ url + "\t" + e);
    return result;
  }

  PARAMS.forEach(function(param){
    var attribute = '';
    try{
      key = param['key'];
      path = param['path'];
      var element = $(path);
      // if you need transform or replace the result of specific column (e.g image link, price etc), use if condition statement.
      if(key == 'link'){
        attribute = url;
      }else if(key == 'image'){ 
        attribute = element.attr('src'); 
      }else if(key == 'price'){
          // Price: $49.00 NZD
          attribute = element.text();
          attribute = attribute.replace('Price:','').replace('$','').replace('NZD','').trim();
      }else if(path == 'test'){
	  attribute = '';
      }else{
        attribute = element.text();
      }
    }catch(e){
      Logger.log(e);
    }
    result.push(attribute);
  });
  return result;
}

// Put the scraped data into the sheet.
function writeResult(sheetData,results, startRow, startColumn){
  // results is an array 
  if(results.length > 0){
    var outputRange = sheetData.getRange(startRow, startColumn, results.length, results[0].length);
    outputRange.setValues(results);
    setLatestRow(startRow+results.length);
  }
}

function formatDateTimeAsString(d) {
  var dateString = Utilities.formatDate(d, 'GMT+12:00', 'yyyy/MM/dd HH:mm:ss');
  return dateString;
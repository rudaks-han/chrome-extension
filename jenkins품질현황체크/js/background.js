function showNotify(title, message) {
	if (Notification && Notification.permission !== "granted") {
	    Notification.requestPermission(function (status) {
	      if (Notification.permission !== status) {
	        Notification.permission = status;
	      }
	    });
	  }
	  if (Notification && Notification.permission === "granted") {
	      //var n = new Notification(title + "\n" + message);
		 
			var start = Date.now();
			var id = new Date().getTime() + '';
			var options = {
				type: 'basic',
				iconUrl: '/images/Angry-Face.png',
				title: title,
				message: message
			 };
			 
			chrome.notifications.create(id, options, function() {
				setInterval(function() {
					var time = Date.now() - start;
					chrome.notifications.update(id, {
						message,
					}, function() { });
				}, 1000);
			});
			
			chrome.notifications.onClicked.addListener(function(notificationId, byUser) {
				//chrome.tabs.create({url: "http://www.google.com"});
				chrome.notifications.clear(notificationId, function() {});
			});
	    }

}

var notifyItem = {};

  var interval = 1000*60; // The display interval, in minutes.
    
  setInterval(function() {
      var currDate = new Date();
      
	  console.error('checking : ' + currDate);
	  
		if (!(currDate.getDay() == 0 || currDate.getDay() == 6)) // 토, 일 제외
		{
			chrome.storage.sync.get('hour', function(items) {	  
			  if (typeof items['hour'] != 'undefined')
			  {
				selectHour = items['hour'];
			  }	  
			});
			
			chrome.storage.sync.get('minute', function(items) {	  
			  if (typeof items['minute'] != 'undefined')
			  {
				selectMinute = items['minute'];				
			  }
			});
			
			chrome.storage.sync.get('line-coverage', function(items) {	  
			  if (typeof items['line-coverage'] != 'undefined')
			  {
				selectLineCoverage = items['line-coverage'];
			  }
			});
			
			chrome.storage.sync.get('conditional-coverage', function(items) {	  
			  if (typeof items['conditional-coverage'] != 'undefined')
			  {
				selectConditionalCoverage = items['conditional-coverage'];
			  }
			});
			
	/*
			console.error('currDate.getHours() : ' + currDate.getHours());
			console.error('selectHour : ' + selectHour);
			console.error('currDate.getMinutes() : ' + currDate.getMinutes());
			console.error('selectMinute : ' + selectMinute);
			console.error('selectLineCoverage : ' + selectLineCoverage);
			console.error('selectConditionalCoverage : ' + selectConditionalCoverage);
			
			console.error('notify time : ' + selectHour + ':' + selectMinute);
		*/	
			if (currDate.getHours() == selectHour && currDate.getMinutes() == selectMinute)
			{
				check();
			}
		}
		
  }, interval);

  
  setTimeout(function() {
	//checkCodeReviewRegister();
	//checkCoverage();
	//check();
  }, 1000);

function initVariableFromStorage()
{
	chrome.storage.sync.get('hour', function(items) {	  
	  if (typeof items['hour'] != 'undefined')
	  {
		selectHour = items['hour'];
	  }	  
	});

	chrome.storage.sync.get('minute', function(items) {	  
	  if (typeof items['minute'] != 'undefined')
	  {
		selectMinute = items['minute'];
	  }
	});

	chrome.storage.sync.get('line-coverage', function(items) {	  
	  if (typeof items['line-coverage'] != 'undefined')
	  {
		selectLineCoverage = items['line-coverage'];
	  }
	});

	chrome.storage.sync.get('conditional-coverage', function(items) {	  
	  if (typeof items['conditional-coverage'] != 'undefined')
	  {
		selectConditionalCoverage = items['conditional-coverage'];
	  }
	});
}

var BASE_LINE_COVERAGE = 72;
var BASE_CONDITIONAL_COVERAGE = 55;
var BASE_HOUR = 9;
var BASE_MINUTE = 0;

var hasError = false;  
var buildNumber = 0;
var selectHour = BASE_HOUR;
var selectMinute = BASE_MINUTE;
var selectLineCoverage = BASE_LINE_COVERAGE;
var selectConditionalCoverage = BASE_CONDITIONAL_COVERAGE;

//var SONARQUBE_URL = 'http://211.63.24.44:9030';
// 'http://211.63.24.56:9030';
// http://211.63.24.44:9030/dashboard?id=com.spectra%3Atrunk&did=10000
var SONARQUBE_URL = 'http://211.63.24.44:9030';

initVariableFromStorage();

function check()
{
	hasError = false;
// $.ajax('http://211.63.24.44:8081/job/eer-build/'), // 커버리지 oracle
//$.ajax('http://211.63.24.44:8081/job/eer-build/lastCompletedBuild/testReport/api/json?pretty=true'), // 테스트케이스 oracle
		//$.ajax('http://211.63.24.44:8081/job/eer-build-postgresql/'), // 테스트케이스 postgresql
		//$.ajax('http://211.63.24.44:8081/job/eer-build-postgresql/lastCompletedBuild/testReport/api/json?pretty=true'), // 테스트케이스 postgresql
		
	var promises =
	  [
		//$.ajax('http://redmine.spectra.co.kr/redmine/issues.json?project_id=ecc_v21_code_review&sort=start_date:desc&limit=7'), // 코드리뷰 등록			  
		$.ajax(SONARQUBE_URL), // 커버리지 oracle		
		$.ajax('http://211.63.24.44:8081/job/eer-static-analysis/'), // PMD		
		$.ajax('http://211.63.24.44:8081/job/eer-webapps-lint/violations/'), // csslint, jslint
		$.ajax({url : 'http://211.63.24.44:8081/job/eer-static-analysis/api/json?pretty=true', datatype: 'json'})
	  ];
	  
	  notifyItem = {};
	  
	$.when.apply($, promises).then(
		function(result1, result2, result3, result4) {
			parseSonarQubeCoverage(result1);
			parsePmd(result2);
			parseCsslint(result3);
			parseNsiq(result4);
			
			
			//console.error('codereview : ' + notifyItem['codereview']);
			
			//console.error('coverage.oracle : ' + notifyItem['coverage.oracle']);
			//console.error('testcase.oracle : ' + notifyItem['testcase.oracle']);
			console.error('coverage.postgresql : ' + notifyItem['coverage.postgresql']);
			console.error('testcase.postgresql : ' + notifyItem['testcase.postgresql']);
			console.error('pmd : ' + notifyItem['pmd']);
			console.error('csslint : ' + notifyItem['csslint']);
			console.error('jslint : ' + notifyItem['jslint']);
			console.error('nsiq : ' + notifyItem['nsiq']);
			
			
			if (typeof notifyItem['codereview'] != 'undefined')
			{
				showNotify('코드리뷰 없음', notifyItem['codereview']);
				hasError = true;
			}
			
			if (notifyItem['coverage.oracle'] < selectLineCoverage || notifyItem['coverage.postgresql'] < selectLineCoverage)
			{
				var str = '';
				if (notifyItem['coverage.oracle'] < selectLineCoverage)
				{
					str += 'oracle[' + notifyItem['coverage.oracle'] + '%] ';
				}
				if (notifyItem['coverage.postgresql'] < selectLineCoverage)
				{
					str += 'postgresql[' + notifyItem['coverage.postgresql'] + '%] ';
				}
				
				showNotify('커버리지', str);
				hasError = true;
			}
		
			
			if (notifyItem['testcase.oracle'] > 0 || notifyItem['testcase.postgresql'] > 0)
			{
				var str = '';
				if (notifyItem['testcase.oracle'] > 0)
				{
					str += 'oracle[' + notifyItem['testcase.oracle'] + '개] ';
				}
				if (notifyItem['testcase.postgresql'] > 0)
				{
					str += 'postgresql[' + notifyItem['testcase.postgresql'] + '개] ';
				}
				
				showNotify('테스트케이스 실패', str);
				hasError = true;
			}
			
			
			if (notifyItem['pmd'])
			{
				showNotify('PMD Warning', 'PMD Warnings 있음');
				hasError = true;
			}
			
			if (notifyItem['csslint'] > 0)
			{
				showNotify('csslint Violations', notifyItem['csslint'] + '개');
				hasError = true;
			}
			
			if (notifyItem['jslint'] > 0)
			{
				showNotify('jslint violations', notifyItem['jslint'] + '개');
				hasError = true;
			}
			
			setTimeout(function() {
				if (!hasError)
				{
					showNotify('품질현황 확인 결과', '모든 항목이 정상입니다.');
					
					chrome.browserAction.setIcon({
						path: '/images/happy.png'
					});
				}
				else
				{
					chrome.browserAction.setIcon({
						path: '/images/sad.png'
					});
				}
			}, 3000);
		}

	);
}


function ajaxJsonp(url)
{
	$.getJSON(url + "?callback=?",
				function(data) 
				{
					console.error(">>>" + data);
				}
			); 
}

function parseCodeReview(res)
{
	console.error('parseCodeReview');
	var d = new Date();
	var year = d.getFullYear();
	var month = (d.getMonth() + 1);
	
	if (month < 10)
	{
		month = '0' + month;
	}
	var day = d.getDate();
	
	var currFullDate = year + '-' + month + '-' + day;
	
	var checkArr = [];
	var issues = res[0].issues;
	
	for (i=1; i<=7; i++)
	{
		var currDate = d.addDays(-i);
		
		if (currDate.getDay() == 0 || currDate.getDay() == 6) // 토, 일 제외
		{
			continue;
		}
		var fDate = formatDate(currDate);
		
		var exist = false;
		for (var k=0; k<issues.length; k++)
		{
			var startDate = issues[k].start_date;
			if (fDate == startDate)
			{
				exist = true;
			}
			
		}
		
		checkArr.push({'date' : fDate, 'exist' : exist});
	}
	
	var anyExist = false;
	var existString = '';
	for (var i=0; i<checkArr.length; i++)
	{
		if (!checkArr[i].exist)
		{
			var value = window.localStorage.getItem(checkArr[i].date);
			if (typeof value != 'undefined' && value != null)
			{
				continue;
			}
			
			anyExist = true;
			if (existString != '')
			{
				existString += ', ';
			}
			existString += checkArr[i].date;
		}
	}
	
	if (anyExist)
	{
		notifyItem['codereview'] = existString;
	}
}

function parseSonarQubeCoverage(res)
{
	console.error('parseSonarQubeCoverage');
	var response = res[0];
	
	var pos = response.indexOf("EERTRUNK");
	var fromIndex = response.lastIndexOf("<a", pos);
	var toIndex = response.indexOf("</a>", pos) + 4;
		
	var link = response.substring(fromIndex, toIndex);
	//console.error('link : ' + response.substring(fromIndex, toIndex));
	
	var url = SONARQUBE_URL + $(link).attr('href');
	
	// line coverage
	var pos = response.indexOf("m_coverage");
	var fromIndex = response.indexOf(">", pos) + 1;
	var toIndex = response.indexOf("</span>", fromIndex) - 1;
	
	var lineCoverage = parseFloat(response.substring(fromIndex, toIndex));			
	console.error('lineCoverage : ' + lineCoverage);
	
	if (lineCoverage < selectLineCoverage)
	{
		hasError = true;
		showNotify('Oracle Line Coverage', lineCoverage + '%, 기준 :  ' + selectLineCoverage + '%');
	}
	
	// conditional coverage
	pos = response.indexOf("m_branch_coverage");
	fromIndex = response.indexOf(">", pos) + 1;
	toIndex = response.indexOf("</span>", fromIndex) - 1;
	
	conditionalCoverage = parseFloat(response.substring(fromIndex, toIndex));			
	console.error('conditionalCoverage : ' + conditionalCoverage);
	
	if (conditionalCoverage < selectConditionalCoverage)
	{
		hasError = true;
		showNotify('Oracle Conditional Coverage', conditionalCoverage + '%, 기준 : ' + selectConditionalCoverage + '%');
	}
	
	// testcase error
	pos = response.indexOf("m_test_errors");
	fromIndex = response.indexOf(">", pos) + 1;
	toIndex = response.indexOf("</span>", fromIndex) 
	
	testcaseErrorCount = parseFloat(response.substring(fromIndex, toIndex));			
	console.error('testcase error : ' + testcaseErrorCount);
		
	// testcase fail
	pos = response.indexOf("m_test_failures");
	fromIndex = response.indexOf(">", pos) + 1;
	toIndex = response.indexOf("</span>", fromIndex);
	
	testcaseFailCount = parseFloat(response.substring(fromIndex, toIndex));			
	console.error('testcase fail : ' + testcaseFailCount);
	
	if (testcaseFailCount > 0 || testcaseErrorCount > 0)
	{
		hasError = true;
		showNotify('Oracle Testcase Fail', "Faitures: " + testcaseFailCount + ", Errors: " + testcaseErrorCount + ', 기준 : ' + 0 + '건');
	}
	
	/*
	$.ajax({
		url:url,
		dataType: "html",
		success : function(response) {			
			
			// line coverage
			var pos = response.indexOf("m_line_coverage");
			var fromIndex = response.indexOf(">", pos) + 1;
			var toIndex = response.indexOf("</span>", fromIndex) - 1;
			
			var lineCoverage = parseFloat(response.substring(fromIndex, toIndex));			
			console.error('lineCoverage : ' + lineCoverage);
			
			if (lineCoverage < selectLineCoverage)
			{
				hasError = true;
				showNotify('Oracle Line Coverage', lineCoverage + '%, 기준 :  ' + selectLineCoverage + '%');
			}
			
			// conditional coverage
			pos = response.indexOf("m_branch_coverage");
			fromIndex = response.indexOf(">", pos) + 1;
			toIndex = response.indexOf("</span>", fromIndex) - 1;
			
			conditionalCoverage = parseFloat(response.substring(fromIndex, toIndex));			
			console.error('conditionalCoverage : ' + conditionalCoverage);
			
			if (conditionalCoverage < selectConditionalCoverage)
			{
				hasError = true;
				showNotify('Oracle Conditional Coverage', conditionalCoverage + '%, 기준 : ' + selectConditionalCoverage + '%');
			}
			
			// testcase fail
			pos = response.indexOf("m_test_errors");
			fromIndex = response.indexOf(">", pos) + 1;
			toIndex = response.indexOf("</span>", fromIndex) - 1;
			
			testcaseFailCount = parseFloat(response.substring(fromIndex, toIndex));			
			console.error('testcase fail : ' + testcaseFailCount);
			
			if (testcaseFailCount > 0)
			{
				hasError = true;
				showNotify('Oracle Testcase Fail', testcaseFailCount + '%, 기준 : ' + 0 + '건');
			}
		}
	});
	*/
}

function parseCoverage(type, res)
{
	console.error('parseCoverage');
	var response = res[0];
	var fromIndex = response.indexOf("<th>Statements</th><td>") + "<th>Statements</th><td>".length;
	var toIndex = response.substring(fromIndex).indexOf("</td>");

//	console.error("fromIndex : " + fromIndex);
//	console.error("toIndex : " + toIndex);
	
	var contents = response.substring(fromIndex, fromIndex + toIndex);	
	
	var fromIndex = contents.indexOf('class="barNegative "><div title="') + 'class="barNegative "><div title="'.length;
	var toIndex = contents.lastIndexOf('Covered" style="');
	
	//console.error("fromIndex : " + fromIndex);
	//console.error("toIndex : " + toIndex);
	
	// 커버리지
	var coverage = contents.substring(fromIndex, toIndex);
	console.error(type + " coverage : " + coverage);
	coverage = $.trim(coverage);
	coverage = coverage.replace(/\&nbsp;/ig, '');
	coverage = coverage.replace(/%/ig, '');
	coverage = coverage.replace(/\n/ig, '');
	coverage = coverage.replace(/ /ig, '');
	
	// 커버리지가 71% 미만일때
	if (parseInt(coverage) < 71)
	{
		//showNotify('코드 커버리지 ', '커버리지 : ' + coverage + '%');
		notifyItem['coverage.' + type] = coverage + '';
	}
	
}

function parseTestcase(type, res)
{
	console.error('parseTestcase');
		var failCount = res[0].failCount
		console.error(type + ' test failCount :  ' + failCount);
		
		if (failCount > 0)
		{
			notifyItem['testcase.' + type] = failCount + '';
		}
}

function parsePmd(res)
{
	console.error('parsePmd');
	var response = res[0];
	
	/*var fromIndex = response.indexOf("<td class=\"pane\" id=\"all\">") + 26;
	var toIndex = response.indexOf("<td class=\"pane\" id=\"new\">") - 5;
	
	var pmd = response.substring(fromIndex, toIndex);
	*/
	
	var pmd = false;
	if (response.indexOf('>PMD Warnings</a>') > -1)
	{
		pmd = true
	}
	
	console.error("pmd : " + pmd);
	// PMD가 0 이상일때
	//if (parseInt(pmd) > 0)
	if (pmd)
	{
		//showNotify('코드 커버리지 ', '커버리지 : ' + coverage + '%');
		notifyItem['pmd'] = pmd;
	}
	
}


function parseCsslint(res)
{
	console.error('parseCsslint');
	var response = res[0];
	var fromIndex = response.indexOf("href=\"#csslint\">csslint</a></td><td class=\"pane\">") + "href=\"#csslint\">csslint</a></td><td class=\"pane\">".length;
	var toIndex = response.substring(fromIndex).indexOf('</td>');
	
	var csslint = response.substring(fromIndex, fromIndex + toIndex);

	if (parseInt(csslint) > 0)
	{
		notifyItem['csslint'] = csslint;
	}
	
	
	fromIndex = response.indexOf("href=\"#jslint\">jslint</a></td><td class=\"pane\">") + "href=\"#csslint\">csslint</a></td><td class=\"pane\">".length;
	toIndex = response.substring(fromIndex).indexOf('</td>');
	
	var jslint = response.substring(fromIndex, fromIndex + toIndex);

	// PMD가 0 이상일때
	if (parseInt(jslint) > 0)
	{
		notifyItem['jslint'] = jslint;
	}
}

function parseNsiq(res)
{
	console.error('parseNsiq');
	var response = res[0];
	//console.error(">>>>" + JSON.stringify(res));
	buildNumber = response.builds[0].number;
	//console.error(">>>>" + buildNumber + " : " + buildNumber);
	
	var url = 'http://211.63.24.44:8081/job/eer-static-analysis/' + buildNumber + '/';
	$.ajax({
		url:url,
		dataType: "html",
		success : function(response) {
			fromIndex = response.indexOf("<b>over 30</b>") + 16;
			toIndex = response.substring(fromIndex).indexOf('(');
						
			if (fromIndex < 20) // 값이 없을때 or build중
			{
				showNotify('NSIQ(순환복잡도)', '값이 없음 or 빌드중...');
			}
			else
			{
				var over30 = parseInt(response.substring(fromIndex, fromIndex + toIndex));
				if (over30 > 4)
				{
					showNotify('NSIQ(순환복잡도)', '' + over30);
				}
				
				console.error('nsiq : ' + over30);
			}
		}
	});
	
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function formatDate(date)
{
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);

    if (month < 10)
    {
        month = '0' + month;
    }
    var day = date.getDate();
    if (day < 10)
    {
        day = '0' + day;
    }
    
    return year + '-' + month + '-' + day;
}


/**
 * popup에서 오는 메시지를 받는 함수
 */
var receiveMessage = function(request, sender, sendResponse)
{
	console.error(request.action);
	if (request.action == 'checkQuality')
	{
		check();
	}
	else if (request.action == 'gotoJenkins')
	{
		window.open('http://211.63.24.44:8081/');
	}
	else if (request.action == 'gotoSonarqube')
	{
		window.open('http://211.63.24.56:9030/');
	}
}

/**
 * receiver by chrome.runtime.sendMessage
 */
chrome.runtime.onMessage.addListener(receiveMessage);
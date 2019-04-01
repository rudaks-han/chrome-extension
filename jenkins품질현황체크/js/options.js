function init()
{
	var backgroundPage = chrome.extension.getBackgroundPage();
	
	chrome.storage.sync.get('hour', function(items) {	  		
	
	  if (typeof items['hour'] != 'undefined')
	  {
		$('#select-hour').val(items['hour']);
	  }	  
	  else
	  {
		$('#select-hour').val(backgroundPage.selectHour); // 9시
	  }
    });
	
	chrome.storage.sync.get('minute', function(items) {
	  if (typeof items['minute'] != 'undefined')
	  {
		$('#select-minute').val(items['minute']);
	  }
	  else
	  {
		$('#select-minute').val(backgroundPage.selectHour);
	  }
    });
	
	chrome.storage.sync.get('line-coverage', function(items) {	  	

	  if (typeof items['line-coverage'] != 'undefined')
	  {
		$('#select-line-coverage').val(items['line-coverage']);
	  }	  
	  else
	  {
		$('#select-line-coverage').val(backgroundPage.selectLineCoverage);
	  }
    });	
	
	chrome.storage.sync.get('conditional-coverage', function(items) {	  		
	
	  if (typeof items['conditional-coverage'] != 'undefined')
	  {
		$('#select-conditional-coverage').val(items['conditional-coverage']);
	  }	  
	  else
	  {
		$('#select-conditional-coverage').val(backgroundPage.selectConditionalCoverage);
	  }
    });	
	
	
}

function save()
{
	var hour = $('#select-hour').val();
	var min = $('#select-minute').val();	
	var lineCoverage = $('#select-line-coverage').val();	
	var conditionalCoverage = $('#select-conditional-coverage').val();	
	
	var value = {'hour': hour, 'minute': min, 'line-coverage': lineCoverage, 'conditional-coverage': conditionalCoverage};
	
	chrome.storage.sync.set(value, function() {
      console.log('Settings saved');
    });
}

function reset()
{
	chrome.storage.sync.clear();
	
	var backgroundPage = chrome.extension.getBackgroundPage();
	
	$('#select-hour').val(backgroundPage.BASE_HOUR);
	$('#select-minute').val(backgroundPage.BASE_MINUTE);	
	$('#select-line-coverage').val(backgroundPage.BASE_LINE_COVERAGE);	
	$('#select-conditional-coverage').val(backgroundPage.BASE_CONDITIONAL_COVERAGE);	
	
	backgroundPage.selectHour = backgroundPage.BASE_HOUR;
	backgroundPage.selectMinute = backgroundPage.BASE_MINUTE;
	backgroundPage.selectLineCoverage = backgroundPage.BASE_LINE_COVERAGE;
	backgroundPage.selectConditionalCoverage = backgroundPage.BASE_CONDITIONAL_COVERAGE;
}

init();

$('#select-hour').on('change', save);
$('#select-minute').on('change', save);
$('#select-line-coverage').on('change', save);
$('#select-conditional-coverage').on('change', save);

$('#btn-reset').on('click', reset);

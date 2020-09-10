chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	if (message.action == 'check-exist-item-option') {
		//console.error('length :  ' + $("._combination_option").length);

		if ($("._combination_option").length > 0) {

		}
	} else if (message.action == 'reload-count') {
		maxReloadCount = message.data.maxReloadCount;
		reloadCount = message.data.reloadCount;
		$('.prd_name').append('<div style="color:red; font-size:20px">' + reloadCount + '/' + maxReloadCount + '번째 시도중...</div>');
	}
});

$(function() {

	/*var el = $('._selectbox_auto').eq(0);
	console.error($('.selectbox-layer').eq(1).html())
	console.error(el.length)
	console.error(el.html())*/
	//el.click();
	//el.trigger('click');
	//el.trigger('mousedown');
/*


    $('<button id="checkOption">button</button>').appendTo('._check_option');

    $('#checkOption').on('click', function(e) {
        e.preventDefault();

        var el = $('.selectbox-layer').eq(1);
        el.css({'display':'block', 'width':'330px', 'height':'auto', 'left':'794.5px', 'top':'838px'})
        var index = 2;

        $('._combination_option option').eq(index).prop('selected', true);

        //var selectedLi = el.find('.selectbox-list').find('li').eq(index);
        //selectedLi.addClass('selectbox-item-selected selectbox-item-over');
        //selectedLi.click();
        //$('._combination_option').change();
        //el.find('li').eq(index).click();
        //el.find('li').eq(index).addClass('selectbox-item-selected selectbox-item-over');


        //var selectedLi = $('.selectbox-list').find('li').eq(2);
        //selectedLi.trigger('click');

        //var select = $('._combination_option');
        //$('._combination_option option').eq(3).prop('selected', true);
        //select.change();
    });
*/

	/*setTimeout(function() {
		var el = $('.selectbox-layer').eq(1);
		//console.error('el : ' + el.length)
		el.css({'display':'block'});

		var selectedLi = el.find('.selectbox-list').find('li').eq(2);
		selectedLi.addClass('selectbox-item-selected selectbox-item-over');

		var select = $('._combination_option');
        select.css({'position':'relative', 'left':'0'});
        $('._combination_option option:eq(2)').prop('selected', true);


		$('.selectbox-source').css({'height':'20px'})

	}, 3000)*/

})


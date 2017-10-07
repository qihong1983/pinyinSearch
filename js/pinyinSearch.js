/**
 * @class PinyinSearch
 * @constructor
 * @param opt {object} 参数
 */
function PinyinSearch(opt) {
	if (!(this instanceof PinyinSearch)) {
		return new PinyinSearch(opt);
	}


	this.searchName = "";
	this.searchResponseList = [];

	this.have = true;

	this.count = 0;
	this.num = 0;
}

PinyinSearch.prototype = {
	/**
	 * 初始化代码
	 * @method init
	 */
	init: function() {
		console.log(11);

		// this.ajax("/clearDB.php", 'post', data, this.clearDBStatus.bind(this));
		//搜索文本框事件 
		this.searchInputEvent();

		// j_clearDB
		this.clearDBHandler();

	},
	clearDBHandler: function() {
		$('#j_clearDB').off('click').on('click', function(e) {
			this.clearDb();
		}.bind(this))
	},
	clearDb: function() {
		var data = {};
		this.ajax("/clearDB.php", 'post', data, this.clearDBStatus.bind(this));
	},
	clearDBStatus(msg) {
		if (msg.status) {
			new PNotify({
				title: '成功',
				text: '数据已删除',
				shadow: true,
				opacity: 0.75,
				addclass: "stack_top_right",
				type: "warning",
				//type: "danger",
				// stack: Stacks[noteStack],
				width: "290px",
				delay: 1400
			});
		} else {
			new PNotify({
				title: '失败',
				text: '数据册除失败请排查',
				shadow: true,
				opacity: 0.75,
				addclass: "stack_top_right",
				type: "danger",
				//type: "danger",
				// stack: Stacks[noteStack],
				width: "290px",
				delay: 1400
			});
		}
	},
	closeList: function() {
		$('#j_searchOpenBL').removeClass('open');
		this.num = 0;
	},
	/**
	 * 搜索文本框事件
	 * @method searchInputEvent
	 */
	searchInputEvent: function() {

		$('#j_menuList li').off('click').on('click', function(e) {
			e.stopPropagation();


			$('#j_searchInput').val($(e.currentTarget).find('i').text());

			this.closeList();
			return false;
		}.bind(this));

		$(document).off('click').on('click', function(e) {
			e.stopPropagation();

			this.closeList();



			return false;
		}.bind(this));
		$('#j_searchInput').off('keyup').on('keyup', function(e) {
			// e.stopPropagation();

			var that = this;


			var j_menuLista = $('#j_menuList li a');
			if ($('#j_searchOpenBL').hasClass('open')) {
				this.count = j_menuLista.length;
			}

			if ($.trim(e.currentTarget.value) == "") {
				this.closeList();
			} else {
				if (this.have) {
					$('#j_searchOpenBL').addClass('open');

					// this.searchName = e.currentTarget.value;
					// this.searchRequest();
				} else {
					this.closeList();
				}

			}



			var reg = /[\w\W]/gi;

			switch (e.keyCode) {
				case 38: //向上键
					if (this.have && e.currentTarget.value != "") {

						if (this.count != 0 && this.count > this.num) {
							console.log(j_menuLista.eq(this.num));


							--this.num;
							j_menuLista.removeClass('active');
							j_menuLista.eq(this.num).addClass('active');

							$('#j_searchInput').removeClass(':focus');

							// debugger;

						}

					}
					return;
					break;
				case 40: //向下键
					console.log(this.num);
					if (this.have && e.currentTarget.value != "") {

						if (this.count != 0 && this.count >= this.num) {
							console.log(j_menuLista.eq(this.num));


							++this.num;
							j_menuLista.removeClass('active');

							j_menuLista.eq(this.num).addClass('active');
							j_menuLista.eq(this.num).addClass(':focus');

							// debugger;

						}

					}
					return;
					break;

				case 13: //回车键
					console.log('回车');
					$('#j_searchInput').val(j_menuLista.eq(this.num).find('i').text());
					this.closeList();
					return;
					break;

				case 27: //ESC
					this.closeList();
					break;
				default:
					break;
			}

			if (reg.test(e.currentTarget.value)) {
				this.searchName = e.currentTarget.value;
				this.searchRequest();
			}

			// }


			// return false;
		}.bind(this));
	},
	/**
	 * 请求搜索
	 * @method searchRequest
	 */
	searchRequest: function() {

		var data = {};
		data.searchName = this.searchName.replace(/\s/g, "");


		if (/[^\x00-\xff]/g.test(data.searchName))
			data.lang = 'cn';
		else
			data.lang = 'en';
		console.log(data.searchName, 'aa');



		// 处理返回的结果
		this.ajax("/search.php", 'post', data, this.searchResponse.bind(this));


	},

	searchResponse: function(data) {
		if (data == null) {
			this.have = false;
			this.closeList();
		} else {
			this.have = true;
			this.renderSearchResponse(data);
		}
	},

	renderSearchResponse: function(data) {
		var html = '';
		$.each(data, function(k, v) {
			console.log(k, v);

			html += '<li>' +
				'<a href="#" class="clearfix">' +
				'<span class="left fs14"><i>' + v.title + '</i>（<b>' + v.py + '</b>）</span>' +
				'<span class="right fs12">' + v.content + '</span>' +
				'</a>' +
				'</li>';
		});

		$('#j_menuList').html(html);

		this.searchInputEvent();

	},

	/**
	 * 基于jquery ajax 二次封装的ajax
	 */
	ajax: function(url, type, data, callback) {
		type = type || 'get';
		$.ajax({
			url: url,
			type: type,
			data: data,
			dataType: 'json',
			error: function(jqXHR, textStatus, errorThrown) {
				// alert(textStatus);
			},
			success: function(respData, textStatus, jqXHR) {
				callback(respData);
			}.bind(this)
		});
	}
}
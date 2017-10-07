function Admin(opt) {
	if (!(this instanceof Admin)) {
		return new Admin(opt);
	}

	this.allowQuery = true;
}


String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


Admin.prototype = {
	init: function() {
		// this.ajax(this.dataUrl.tableUrl, 'post', data, this.setDownloadExcel.bind(this));

		this.clickEvent();
	},
	clickEvent: function() {
		$("button").off('click').on('click', function(e) {
			var title = $('#inputStandard').val();
			var content = $('#textArea2').val();

			// console.log(title);
			// console.log(content);


			if (this.allowQuery) {

				this.allowQuery = false;
				var data = {};
				if ($.trim(title) == "" || $.trim(content) == "") {
					alert("标题或内容为空");
				} else {
					data.title = title;
					data.content = content;


					data.py = pinyinUtil.getPinyin(title).replace(/\s/g, "");



					this.ajax("/insert.php", 'post', data, this.insertStatus.bind(this));
				}

				setTimeout(function() {
					this.allowQuery = true;
				}.bind(this), 1000);
			}

			$('#inputStandard').val("");
			$('#textArea2').val("");

		}.bind(this));
	},

	insertStatus(msg) {
		console.log(msg);

		if (msg.status) {
			new PNotify({
				title: '成功',
				text: '添加成功',
				shadow: true,
				opacity: 0.75,
				addclass: "stack_top_right",
				type: "success",
				//type: "danger",
				// stack: Stacks[noteStack],
				width: "290px",
				delay: 1400
			});
		} else {
			new PNotify({
				title: '失败',
				text: msg.msg,
				shadow: true,
				opacity: 0.75,
				addclass: "stack_top_right",
				type: "success",
				//type: "danger",
				// stack: Stacks[noteStack],
				width: "290px",
				delay: 1400
			});
		}
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
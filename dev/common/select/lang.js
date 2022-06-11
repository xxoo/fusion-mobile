'use strict';
define(['common/fusion/fusion'], function (fusion) {
	let chs = {
		ok: '确定',
		clear: '清除',
		choose: '请选择'
	},
		cht = {
			ok: '確定',
			clear: '清除',
			choose: '請選擇'
		},
		eng = {
			ok: 'OK',
			clear: 'Clear',
			choose: 'Choose'
		};
	return fusion.getLang({
		zh: chs,
		'zh-CN': chs,
		'zh-TW': cht,
		'zh-HK': cht,
		en: eng,
		'en-US': eng,
		'en-AU': eng,
		'en-CA': eng,
		'en-IN': eng,
		'en-NZ': eng,
		'en-ZA': eng,
		'en-GB': eng
	});
});
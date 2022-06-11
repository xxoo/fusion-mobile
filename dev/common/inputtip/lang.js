'use strict';
define(['common/fusion/fusion'], function (fusion) {
	let chs = '请检查此字段',
		cht = '請檢查此字段',
		eng = 'Please recheck this field';
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
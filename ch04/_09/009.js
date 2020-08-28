function spiderLinks(currentUrl, body, nesting) {
	if (nesting === 0) {
		return Promise.resolve();
	}

	const links = utilities.getPageLinks(currentUrl, body);
	const promises = links.map(link => spider(link, nesting - 1));

	return Promise.all(promises);
}
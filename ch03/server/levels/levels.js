function create3Links() {
	const relativePath = document.title;

	for (let i = 1; i <= 3; i++) {
		const a = document.createElement('a');
		const link = document.createTextNode(`${relativePath}-${i}`);
		a.appendChild(link);

		a.href = `http://localhost:3000/${relativePath}-${i}`;

		document.body.appendChild(a);

		const br = document.createElement("br");
		document.body.appendChild(br.cloneNode(true));
	}
}
//setTimeout(create3Links, 3000);
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('levels'));

// levels
app.get('/1', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1.html'));
	}, 1000);
});

app.get('/1-1', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-1.html'))
	}, 3000);
});
app.get('/1-1-1', (req, res) => {
	setTimeout(()=> {
		res.sendFile(path.join(__dirname + '/levels/1-1-1.html'));
	}, 2000);
});
app.get('/1-1-2', (req, res) => {
	setTimeout(()=> {
		res.sendFile(path.join(__dirname + '/levels/1-1-2.html'));
	}, 6000);
});
app.get('/1-1-3', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-1-3.html'));
	}, 2000);
});

app.get('/1-2', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-2.html'));
	}, 3000);
});
app.get('/1-2-1', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-2-1.html'));
	}, 1000);
});
app.get('/1-2-2', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-2-2.html'));
	}, 3000);
});
app.get('/1-2-3', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-2-3.html'));
	}, 4000);
});

app.get('/1-3', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-3.html'));
	}, 2500);
});
app.get('/1-3-1', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-3-1.html'));
	}, 4300);
});
app.get('/1-3-2', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-3-1.html'));
	}, 5000);
});
app.get('/1-3-3', (req, res) => {
	setTimeout(() => {
		res.sendFile(path.join(__dirname + '/levels/1-3-3.html'));
	}, 10000);
});

app.listen(port, () => {
	console.log(`example app listening at http://localhost:${port}`);
});
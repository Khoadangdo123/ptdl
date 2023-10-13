const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Papa = require('papaparse');
const cors = require('cors');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


app.use(cors());
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const filePath = `uploads/${file.originalname}`;
  const data = fs.readFileSync(filePath, 'utf8');
  const parsedData = Papa.parse(data, { header: true });

	

  const newData = parsedData.data.map((row, index) => 
		
		// ({
		// 	...row,
		// 	[req.body.newColumnName]: propertyValue
		// })

		{
			if (index === 0) {
				return { ...row, [req.body.newColumnName]: '' };
			} else {
				return { ...row, [req.body.newColumnName]: '' };
			}
		}
	);

  const newCSV = Papa.unparse(newData);
	fs.writeFileSync(filePath, newCSV);
	// fs.unlinkSync(filePath);

  res.send('Column added successfully');
});

app.post('/addValue', upload.single('file'), (req, res) => {
	const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }
	const filePath = `uploads/${file.originalname}`;
	const data = fs.readFileSync(filePath, 'utf8');
  const parsedData = Papa.parse(data, { header: true });

	const newData = parsedData.data.map((row, index) => {
		if (row['Order ID'] === req.body.dataValue) {
			return (
				{
					...row,
					[req.body.dataColoumn]: req.body.dataNew
				}
			)
		} else {
			return row;
		}
	});

  const newCSV = Papa.unparse(newData);
	fs.writeFileSync(filePath, newCSV);
	// fs.unlinkSync(filePath);

	res.send(parsedData)
})

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
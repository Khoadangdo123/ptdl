const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Papa = require('papaparse');
const csv = require('csv-parser');
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
});

app.post('/deleteValue', upload.single('file'), (req, res) => {
	const file = req.file;

	if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }
	const filePath = `uploads/${file.originalname}`;
	const data = fs.readFileSync(filePath, 'utf8');
  const parsedData = Papa.parse(data, { header: true });

	const newData = parsedData.data.map((row, index) => {
		if (row['Order ID'] === req.body.dataDelete) {
			return (
				{
					...row,
					[req.body.dataColoumn]: ''
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
});

// app.post('/deleteRow', upload.single('file'), (req, res) => {
// 	const uploadedFile = req.file;
// 	const columnNameToDelete = req.body.columnName;

//   const rows = [];
// 	let header = null;
// 	fs.createReadStream(uploadedFile.path) // Provide the correct path to your CSV file
// 		.pipe(csv())
// 		.on('data', (row) => {
// 			if (!header) {
//         header = Object.keys(row);
//       }
//       delete row[columnNameToDelete];
//       rows.push(row);
// 		})
// 		.on('end', () => {
// 			const csvData = [header, ...rows.map(row => Object.values(row))];
// 			fs.writeFileSync('data.csv', csvData.map(row => row.join(',')).join('\n')); // Write back to the CSV file
// 			res.json(csvData.map(row =>  row.join(',')))
// 			// res.json({ message: `Column "${columnNameToDelete}" deleted successfully` });
// 		});
// });

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
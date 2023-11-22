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
// Code Đã Xong Phần này
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const filePath = `uploads/${file.originalname}`;
  const data = fs.readFileSync(filePath, 'utf8');
	const dataCheck = await req.body.newColumnName;
  const parsedData = Papa.parse(data, { header: true });

	const valueKey = parsedData.meta.fields;

	
	function findAbsoluteString(inputString, stringArray) {
		return stringArray.includes(inputString);
	}
	
	const found = await findAbsoluteString(dataCheck, valueKey);
	
	if (found) {
		res.json({
			message: 'Bạn Đã Nhập Thêm Thuộc Tính Trùng'
		})
	} else {
		const newData = parsedData.data.map((row, index) => 
		
			{
				if (index === 0 || !(row === req.body.newColumnName)) {
					return { ...row, [req.body.newColumnName]: '' };
				} else {
					return { ...row, [req.body.newColumnName]: '' };
				}
			}
		);

		const newCSV = Papa.unparse(newData);
		fs.writeFileSync(filePath, newCSV);
		res.json({
			message: 'Cập nhật thành công'
		})
	}


	// const newCSV = Papa.unparse(newData);
	// fs.writeFileSync(filePath, newCSV);
	// fs.unlinkSync(filePath);

});

app.post('/addValue', upload.single('file'), (req, res) => {
	try {

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
				return {
					...row
				}
			}
		});
	
	
		const newCSV = Papa.unparse(newData);
		fs.writeFileSync(filePath, newCSV);
		// fs.unlinkSync(filePath);

		const found = parsedData.data.filter(obj => obj['Order ID'] === req.body.dataValue);
		
		let regEx = /^\d+$/;
		if (regEx.test(found[0]['Order ID'])) {
	
			res.json({
				message: 'Đã Cập Nhật Thành công'
			})
		} else {

			res.json({
				message: 'Cập Nhật Thất bại'
			})
		}
	
		// res.send(typeof found[0]['Order ID'])
	} catch (error) {
		res.json({
			message: 'Cập Nhật Thất bại'
		})
	}	

})


app.post('/addValueAll', upload.single('file'), (req, res) => {
	try {

		const file = req.file;
		if (!file) {
			res.status(400).send('No file uploaded');
			return;
		}
		const filePath = `uploads/${file.originalname}`;
		const data = fs.readFileSync(filePath, 'utf8');
		const parsedData = Papa.parse(data, { header: true });
		const dataCheck = req.body.dataColoumn;


		const valueKey = parsedData.meta.fields;

	
		function findAbsoluteString(inputString, stringArray) {
			return stringArray.includes(inputString);
		}
		const found = findAbsoluteString(dataCheck, valueKey);

		if (found) {
			const newData = parsedData.data.map((row, index) => {
				return (
					{
						...row,
						[req.body.dataColoumn]: req.body.dataNew
					}
				)
			});

			const newCSV = Papa.unparse(newData);
			fs.writeFileSync(filePath, newCSV);

			res.json({
				message: 'success'
			})
			// fs.unlinkSync(filePath);
		} else {
			res.json({
				message: 'Không tìm thấy cột thêm'
			})
		}
	
	} catch (error) {
		res.json({
			message: error.message
		})
	}	

})


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
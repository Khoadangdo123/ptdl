const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Papa = require('papaparse');
const csv = require('csv-parser');
const brain = require('brain.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
const tf = require('@tensorflow/tfjs');

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

app.post('/train', bodyParser.json(), (req, res) => {
	
	const trainingData = [];
	const newPriceEach = parseFloat(req.body.newPrice); 

	console.log(newPriceEach)

	fs.createReadStream('./uploads/predict.csv')
  .pipe(csv())
  .on('data', (row) => {
    const priceEach = parseFloat(row['Price Each']);
    const quantityOrdered = parseFloat(row['Quantity Ordered']);

    trainingData.push({ input: { priceEach }, output: { quantityOrdered } });
  })
  .on('end', () => {
    // Create and configure a neural network
    const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

    // Train the neural network
    net.train(trainingData, {
      iterations: 1000,
      log: true, // Log tiến trình đào tạo vào console
      errorThresh: 0.005,  // Dừng đào tạo khi sai số đạt ngưỡng này
      logPeriod: 100, // Log tiến trình mỗi 100 lần lặp
    });

    // Make predictions for new data
    const output = net.run({ priceEach: newPriceEach });

    res.json({
			valuePredict: output.quantityOrdered
		});
  });
});

app.post('/trainTongGiaTien', bodyParser.json(), (req, res) => {
	
	const trainingData = [];
	// const newPriceEach = parseFloat(req.body.newPrice); // Replace with your new input
	const valueQuantityName = parseInt(req.body.predictQuantity);

	console.log(valueQuantityName)

	// console.log()

	fs.createReadStream('./uploads/predict.csv')
	.pipe(csv())
	.on('data', (row) => {
		const sumEach = parseFloat(row['Price Each']) * parseFloat(row['Quantity Ordered']);
		const quantityOrdered = parseFloat(row['Quantity Ordered']);

		// Check for NaN or undefined values in numeric attributes
		if (!isNaN(sumEach) && !isNaN(quantityOrdered)) {
			trainingData.push({
				input: {
					quantityOrdered,
					// Add more attributes here
				},
				output: {
					sumEach,
					// Add more outputs here
				},
			});
		} else {
			console.warn('Invalid or missing numeric values:', row);
		}
	})
	.on('end', () => {
		// Create and configure a neural network
		const net = new brain.NeuralNetwork({ hiddenLayers: [3] });

		// Check if there is valid training data
		if (trainingData.length > 0) {
			// Train the neural network
			net.train(trainingData, {
				learningRate: 0.01,
				iterations: 1000,
				log: true,
				errorThresh: 0.005,
				logPeriod: 100
			});

			// Make predictions for new data
			const output = net.run({ quantityOrdered: valueQuantityName });

			res.json({
				valuePredict: output.sumEach,
				// Add more predicted values here
			});
		} else {
			res.status(500).json({ error: 'No valid training data.' });
		}
	});
});

app.post('/trainDiaChi', bodyParser.json(), (req, res) => {
	const trainingData = [];

	const valueProductNameData = req.body.valueProductPredictNew;
// Load your CSV file and populate training data
	fs.createReadStream('./uploads/predict.csv')
		.pipe(csv())
		.on('data', (row) => {
			const product = row['Product'];
			const purchaseAddress = row['Purchase Address'];

			// Convert the strings to arrays of characters
			const inputArray = product.split('');
			const outputArray = purchaseAddress.split('');

			trainingData.push({
				input: inputArray,
				output: outputArray,
			});
		})
		.on('end', () => {
			// Create and configure an LSTM neural network
			const net = new brain.recurrent.LSTM();

			// Check if there is valid training data
			if (trainingData.length > 0) {
				net.train(trainingData, {
					learningRate: 0.01,
					iterations: 1000,
					log: true,
					errorThresh: 0.005,
					logPeriod: 100,
				});

				// Make predictions for new data
				// const sampleProduct = valueProductNameData;
				const inputArray = valueProductNameData.split('');
				// console.log(inputArray)
				const output = net.run(inputArray);

				// Convert the output array to a string
				// const predictedPurchaseAddress = Object.keys(output).reduce((maxKey, key) => (output[key] > output[maxKey] ? key : maxKey), '');

				// console.log('Predicted Purchase Address:', output);
				res.json({
					valuePredict: output
				})
			} else {
				console.error('No valid training data.');
			}
		});
});

app.post('/trainSanPham', bodyParser.json(), (req, res) => {
	
// Function to decode lengths back to categorical values
	function decodeLength(encodedLength, categoryArray) {
		return categoryArray[encodedLength];
	}

	// Read data from CSV file and train the model
	const trainingData = [];
	const productCategories = []; // Assuming 'Product' is a categorical variable
	const purchaseAddressCategories = []; // Assuming 'Purchase Address' is a categorical variable

	const inputNewPriceEach = parseFloat(req.body.newPriceEach);


	fs.createReadStream('./uploads/predict.csv')
		.pipe(csv())
		.on('data', (row) => {
			const priceEach = parseFloat(row['Price Each']);
			const product = row['Product'];
			const purchaseAddress = row['Purchase Address'];

			// Populate category arrays
			if (!productCategories.includes(product)) {
				productCategories.push(product);
			}

			if (!purchaseAddressCategories.includes(purchaseAddress)) {
				purchaseAddressCategories.push(purchaseAddress);
			}

			trainingData.push({
				input: { priceEach },
				output: { product: productCategories.indexOf(product), purchaseAddress: purchaseAddressCategories.indexOf(purchaseAddress) },
			});
		})
		.on('end', () => {
			// Convert training data to TensorFlow tensors
			const xs = tf.tensor2d(trainingData.map(data => [data.input.priceEach]));
			const ys = tf.tensor2d(trainingData.map(data => [data.output.product, data.output.purchaseAddress]));

			// Define the model
			const model = tf.sequential();
			model.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' }));
			model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

			// Compile the model
			model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

			// Train the model
			model.fit(xs, ys, { epochs: 100 }).then(() => {
				// Model has been trained
				// You can make predictions or evaluate the model here

				// Make predictions for new data
				const newPriceEach = inputNewPriceEach;

				const prediction = model.predict(tf.tensor2d([[newPriceEach]]));
				const [predictedEncodedProduct, predictedEncodedPurchaseAddress] = prediction.argMax(1).dataSync();

				// console.log('Predicted Product:', decodeLength(predictedEncodedProduct, productCategories));
				// console.log('Predicted Purchase Address:', decodeLength(predictedEncodedPurchaseAddress, purchaseAddressCategories));

				res.json({
					valuePredictProduct: decodeLength(predictedEncodedProduct, productCategories)
				})
			});
		});	

})

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
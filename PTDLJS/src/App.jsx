import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import './styles/inputStyles.css';
import './App.css'

function App() {

  const [newColumnName, setNewColumnName] = useState('');
  const [columnData, setColumnData] = useState('');
  const [dataValue, setDataValue] = useState('');
  const [dataNew, setDataNew] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [csvDataNeed, setCsvDataNeed] = useState(null);

  const [nameData, setNameData] = useState('');
  const [nameDataChange, setNameDataChange] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setNameData(file.name)

    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        complete: (result) => {
          setCsvData(result.data);
        },
      });
    };

    reader.readAsText(file);
  };

  const handleFileUploadChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setNameDataChange(file.name)

    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        complete: (result) => {
          setCsvDataNeed(result.data);
        },
      });
    };

    reader.readAsText(file);
  };

  const generateRandomValue = () => {
    // Generate a random value (you can customize this based on your requirements)
    return Math.floor(Math.random() * 100);
  };

  const handleAddColumn = () => {
    if (csvData && newColumnName) {

      const randomValue = generateRandomValue(); 

      const formData = new FormData();


      const DataNewBase = new Blob([Papa.unparse(csvData)], { type: 'text/csv' });
      console.log(DataNewBase);

      formData.append('file', new Blob([Papa.unparse(csvData)], { type: 'text/csv' }), nameData);
      formData.append('newColumnName', newColumnName);
      formData.append('newValue', randomValue);
      formData.append('dataLength', csvData.length - 1);

      axios.post('http://localhost:3001/upload', formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error adding column:', error);
        });
    }``
  };

  const addValue = () => {

    const formData = new FormData();

    formData.append('file', new Blob([Papa.unparse(csvDataNeed)], { type: 'text/csv' }), nameDataChange);
    formData.append('dataColoumn', columnData);
    formData.append('dataValue', dataValue);
    formData.append('dataNew', dataNew);
    formData.append('dataLength', csvDataNeed.length - 1);

    axios.post('http://localhost:3001/addValue', formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error adding column:', error);
        });
  }

  return (
    <>
      <div
        className='text_title_center'
      >
        <h1
          style={{
            color: 'black'
          }}
        >
          Phần mềm nhập thêm dữ liệu mà người yêu cầu cần dùng
        </h1>
      </div>
      <div>

        <h1 style={{
          textAlign: 'center'
        }}>
          Thêm dữ liệu vào bảng phân tích dữ liệu về bán hàng
        </h1>

        {/* Upload CSV */}
        <div
          style={{
            paddingLeft: 20,
            width: 560,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <h2>Tải tệp CSV cần thêm cột</h2>
            <input
              className='input_chosen_file'
              type="file" 
              onChange={handleFileUpload}
              style={{
                marginTop: 30,
                height: 50
              }}
            />
          </div>
          <h2>Thêm cột mới vào</h2>
          <input
            className='input_new_column'
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Thêm tên vào cột mới"
          />
          <br />
          <button
            className='button_add_column'
            onClick={handleAddColumn}
          >
            Thêm giá trị vào cột mới
          </button>
        </div>

        <br />
        {/* Them gia tri vao cot va file */}
        <h1>
          Thêm giá trị vào cột cần thêm
        </h1>
        <div style={{
          width: 500,
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <h5
            style={{
              marginLeft: 40
            }}
          >
            File cần giá trị
          </h5>
          <div style={{
            textAlign: 'center'
          }}>
            <input
              type="file"
              onChange={handleFileUploadChange}
              style={{
                marginTop: 23
              }}
            />
          </div>
        </div>
        <br />
        <div style={{
          width: 1000,
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <span>
            Nhập tên cột cần thêm
          </span>
          <input
            className='input_add_value'
            placeholder='Tên cột mới'
            type="text"
            onChange={(e) => setColumnData(e.target.value)}
          />
        </div>
        <br />
        <div style={{
          width: 1000,
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <span>
            Nhập Số Id cần thêm
          </span>
          <input
            className='input_add_value'
            placeholder='Tên id cần thêm'
            type="text"
            onChange={(e) => setDataValue(e.target.value)}
          />
        </div>
        <br />
        <div style={{
          width: 1000,
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <span>
            Nhập giá trị cần nhập
          </span>
          <input
            className='input_add_value'
            placeholder='Tên giá trị cần nhập'
            type="text"
            onChange={(e) => setDataNew(e.target.value)}  
          />
        </div>
        <br />
        <button
          className='hover_button_add_value'
          style={{
            marginLeft: 80,
            background: '#5D12D2',
            color: 'white'
          }}
          onClick={addValue}
        >
          Thêm giá giá trị
        </button>
      </div>
    </>
  );
}

export default App

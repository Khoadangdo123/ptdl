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
  const [csvDataUpdated, setCsvDataUpdated] = useState(null)

  const [nameData, setNameData] = useState('');
  const [nameDataChange, setNameDataChange] = useState('');
  const [updatedNameDataChange, setUpdatedNameChange] = useState('');

  const [updatedColumnData, setUpdatedColumnData] = useState('');
  const [updatedDataValue, setUpdatedDataValue] = useState('');
  const [updatedDataNew, setUpdatedDataNew] = useState('');

  const [deleteDataChange, setDeleteDataChange] = useState('');
  const [deleteNameDataChange, setDeleteNameDataChange] = useState('');
  const [deleteColumn, setDeleteColumn] = useState('')
  const [fileDelete, setFileDelete] = useState(null);


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

  const handleFileUpdatedUploadChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setUpdatedNameChange(file.name)

    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        complete: (result) => {
          setCsvDataUpdated(result.data);
        },
      });
    };

    reader.readAsText(file);
  }

  const handleFileDeleteChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // setDeleteNameDataChange(file.name)
    setDeleteNameDataChange(file.name)

    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        complete: (result) => {
          setFileDelete(result.data);
        },
      });
    };

    reader.readAsText(file);
  }

  const deleteValue = () => {

    const formData = new FormData();

    formData.append('file', new Blob([Papa.unparse(fileDelete)], { type: 'text/csv' }), deleteNameDataChange);
    formData.append('dataColoumn', deleteColumn);
    formData.append('dataDelete', deleteDataChange);

    axios.post('http://localhost:3001/deleteValue', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error adding column', error)
      })

  }

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
  };

  const updatedValue = () => {

    const formData = new FormData();

    formData.append('file', new Blob([Papa.unparse(csvDataUpdated)], { type: 'text/csv' }), updatedNameDataChange);
    formData.append('dataColoumn', updatedColumnData);
    formData.append('dataValue', updatedDataValue);
    formData.append('dataNew', updatedDataNew);
    formData.append('dataLength', csvDataUpdated.length - 1);

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
        {/* Them gia tri vao cot va file vaf cap nhat file */}
        <div style={{
          display: 'flex',
          width: '100%'
        }}>
          <div 
            style={{
            width: '50%'
          }}>
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
          <div
            style={{
              width: '50%'
            }}
          >
            <h1
              style={{
                color: 'blue'
              }}
            >
              Cập nhật giá trị cột cần
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
                File cần cập nhật
              </h5>
              <div style={{
                textAlign: 'center'
              }}>
                <input
                  type="file"
                  onChange={handleFileUpdatedUploadChange}
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
                Nhập tên cột cần cập nhật
              </span>
              <input
                className='input_add_value'
                placeholder='Tên cột cập nhật'
                type="text"
                onChange={(e) => setUpdatedColumnData(e.target.value)}
              />
            </div>
            <br />
            <div style={{
              width: 1000,
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <span>
                Nhập Số Id cần cập nhật
              </span>
              <input
                className='input_add_value'
                placeholder='Tên id cần cập nhật'
                type="text"
                onChange={(e) => setUpdatedDataValue(e.target.value)}
              />
            </div>
            <br />
            <div style={{
              width: 1000,
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <span>
                Nhập giá trị cần cập nhật
              </span>
              <input
                className='input_add_value'
                placeholder='Tên giá trị cần cập nhật'
                type="text"
                onChange={(e) => setUpdatedDataNew(e.target.value)}  
              />
            </div>
            <br />
            <button
              className='hover_button_add_value'
              style={{
                marginLeft: 80,
                background: '#02c8f9',
                color: 'black'
              }}
              onClick={updatedValue}
            >
              Cập nhật giá trị
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1
          style={{
            color: 'red'
          }}
        >
          Giá trị cột cần xóa
        </h1>
        <div>
          <div
            style={{
              display: 'flex'

            }}
          >
            <h5
              style={{
                marginLeft: 40
              }}
            >
              File cần xóa
            </h5>
            <div>
              <input
                type="file"
                onChange={handleFileDeleteChange}
                style={{
                  marginTop: 23,
                  marginLeft: 20
                }}
              />
            </div>
          </div>
          <div
            style={{
              marginLeft: 40,
            }}
          >
            <span>Cột cần xóa</span>
            <input
              className='input_chosen_file'
              style={{
                marginLeft: 30,
                height: 24
              }}
              type="text"
              onChange={(e) => setDeleteColumn(e.target.value)}
              placeholder="Tên cột xóa"
            />
          </div>
          <div
            style={{
              marginLeft: 40,
              marginTop: 20
            }}
          >
            <span>Id cần xóa</span>
            <input
              className='input_chosen_file'
              style={{
                marginLeft: 41,
                height: 24
              }}
              type="text"
              onChange={(e) => setDeleteDataChange(e.target.value)}
              placeholder="Tên id xóa"
            />
          </div>
          
          <button
            style={{
              background: 'red',
              color: 'white',
              marginLeft: 40,
              marginTop: 20
            }}
            onClick={deleteValue}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default App

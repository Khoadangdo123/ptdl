import { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import './styles/inputStyles.css';
import './App.css'

function App() {

  // NOTE: state Error Message
  // Code tiền xử lý
  const [nameColNew, setNameColNew] = useState(false);
  const [fileErrorAdd, setFileErrorAdd] = useState(false);

  // Error Thêm giá trị
  const [fileAddValue, setFileAddValue] = useState(false);
  const [nameColError, setNameColError] = useState(false);
  const [idColAddError, setIdColAddError] = useState(false);
  const [valueColError, setValueColError] = useState(false);
  const [idFormatAdd, setIdFormatAdd] = useState(false);
  const [errorData, setErrorData] = useState(false);

  // Error Cập nhật giá trị
  const [fileUpdatedError, setFileUpdatedError] = useState(false);
  const [nameUpdatedError, setNameUpdatedError] = useState(false);
  const [idUpdatedError, setIdUpdatedError] = useState(false);
  const [valueUpdatedError, setValueUpdatedError] = useState(false);
  const [idFormat, setIdFormat] = useState(false);

  // Error Xóa giá trị
  const [fileDeleteError, setFileDeleteError] = useState(false);
  const [errorColDelete, setErrorColDelete] = useState(false);
  const [errorIdDelete, setErrorIdDelete] = useState(false);
  const [errorIdDeleteFormat, setErrorIdDeleteFormat] = useState(false);


  const [dataNameColError, setDataNameColError] = useState(false);
  const [errorName, setErrorName] = useState(false);

  // Code dùng để sử dụng các chức năng thêm cột và giá trị
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

  const [fileNameAddAll, setFileNameAddAll] = useState('');
  const [fileAddAllValue, setFileAddAllValue] = useState(null);
  const [dataAddAll, setDataAddAll] = useState('');
  const [dataValueAll, setDataValueAll] = useState('');


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

  const handleFileAddAllChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setFileNameAddAll(file.name)

    reader.onload = (event) => {
      const text = event.target.result;
      Papa.parse(text, {
        complete: (result) => {
          setFileAddAllValue(result.data);
        },
      });
    };

    reader.readAsText(file);
  }

  const deleteValue = () => {

    let regEx = /^\d+$/;

    if (fileDelete !== null && deleteColumn !== '' && deleteDataChange !== '') {
      if (regEx.test(deleteDataChange) && deleteDataChange.length === 6) {
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
          });
        setFileDeleteError(false);
        setErrorColDelete(false);
        setErrorIdDelete(false);
        setErrorIdDeleteFormat(false);
      } else {
        setErrorIdDeleteFormat(true)
      }
    } else {
      if (fileDelete === null) {
        setFileDeleteError(true);
      } else {
        setFileDeleteError(false);
      }
      if (deleteColumn === '') {
        setErrorColDelete(true);
      } else {
        setErrorColDelete(false)
      }
      if (deleteDataChange === '') {
        setErrorIdDelete(true);
      } else {
        setErrorIdDelete(false)
      }
    }

  }

  const generateRandomValue = () => {
    // Generate a random value (you can customize this based on your requirements)
    return Math.floor(Math.random() * 100);
  };

  const handleAddColumn = () => {
    // console.log(!(csvData === null))
    if (!(csvData === null)) {
      // Code kiểm tra number
      let idPattern = /^\d+$/;

      const randomValue = generateRandomValue(); 

      const formData = new FormData();


      const DataNewBase = new Blob([Papa.unparse(csvData)], { type: 'text/csv' });
      console.log(DataNewBase);

      formData.append('file', new Blob([Papa.unparse(csvData)], { type: 'text/csv' }), nameData);
      formData.append('newColumnName', newColumnName);
      formData.append('newValue', randomValue);
      formData.append('dataLength', csvData.length - 1);

      if (!idPattern.test(newColumnName)) {
        axios.post('http://localhost:3001/upload', formData)
          .then(response => {
            alert(response.data.message);
            // console.log(response)
          })
          .catch(error => {
            console.error('Error adding column:', error);
          });
        setNameColNew(false);
      } else {
        setNameColNew(true);
      }
      setFileErrorAdd(false)
    } else {
      setFileErrorAdd(true)
    }
    // console.log(nameColNew);
  };

  // Fix: Đang sửa code này
  const addValue = () => {

    let regEx = /^\d+$/;

    if (
      columnData !== '' 
      && dataValue !== '' 
      && dataNew !== ''
      && columnData !== 'null' 
      && dataValue !== 'null' 
      && dataNew !== 'null'
      && columnData !== 'NaN' 
      && dataValue !== 'NaN' 
      && dataNew !== 'NaN'
      && csvDataNeed !== null) {

      if (regEx.test(dataValue) && dataValue.length === 6) {

        const formData = new FormData();
  
        formData.append('file', new Blob([Papa.unparse(csvDataNeed)], { type: 'text/csv' }), nameDataChange);
        formData.append('dataColoumn', columnData);
        formData.append('dataValue', dataValue);
        formData.append('dataNew', dataNew);
        formData.append('dataLength', csvDataNeed.length - 1);
  
        axios.post('http://localhost:3001/addValue', formData)
          .then(response => {
            // if ('Không Có Id') {
              
            // }
            alert(response.data.message);

            // console.log(response.data);
          })
          .catch(error => {
            console.error('Error adding column:', error);
          });
  
        setFileAddValue(false);
        setNameColError(false);
        setIdColAddError(false);
        setValueColError(false);
        setIdFormat(false);
        setErrorData(false)
        setIdFormatAdd(false)
        // if (dataValue !== '236742') {
          
        // } else {
        //   setErrorData(true);
        // }
      } else {
        setIdFormatAdd(true)
      }
    } else {

      if (csvDataNeed === null) {
        setFileAddValue(true);
      } else {
        setFileAddValue(false);
      }
      if (
        columnData === ''
        || columnData === 'null'
        || columnData === 'NaN'
      ) {
        setNameColError(true);
      } else {
        setNameColError(false);
      }
      if (
        dataValue === ''
        || dataValue === 'null'
        || dataValue === 'NaN'
      ) {
        setIdColAddError(true);
      } else {
        setIdColAddError(false);
      }
      if (
        dataNew === ''
        || dataNew === 'null'
        || dataNew === 'NaN'
        ) {
        setValueColError(true);
      } else {
        setValueColError(false);
      }

    }
  };

  const addAllValue = () => {

    if (dataAddAll !== '' && dataValueAll !== '' && fileAddAllValue !== null) {

      const formData = new FormData();
    
      formData.append('file', new Blob([Papa.unparse(fileAddAllValue)], { type: 'text/csv' }), fileNameAddAll);
      formData.append('dataColoumn', dataAddAll);
      formData.append('dataNew', dataValueAll);
  
      axios.post('http://localhost:3001/addValueAll', formData)
        .then(response => {
          // if ('Không Có Id') {
            
          // }
          alert(response.data.message);
  
          // console.log(response.data);
        })
        .catch(error => {
          console.error('Error adding column:', error);
        });
    } else {
      alert('Bạn không được để trống ô')
    }
  }

  const updatedValue = () => {
    let regEx = /^\d+$/;

    if (
      csvDataUpdated !== null 
      && updatedColumnData !== '' 
      && updatedDataValue !== '' 
      && updatedDataNew !== ''
      && updatedColumnData !== 'null' 
      && updatedDataValue !== 'null' 
      && updatedDataNew !== 'null'
      && updatedColumnData !== 'NaN' 
      && updatedDataValue !== 'NaN' 
      && updatedDataNew !== 'NaN'
    ) {

      if (regEx.test(updatedDataValue) && updatedDataValue.length === 6) {

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

        setFileUpdatedError(false);
        setNameUpdatedError(false);
        setIdUpdatedError(false);
        setValueUpdatedError(false);
        setIdFormat(false);
      } else {
        setIdFormat(true);
      }
    } else {
      if (csvDataUpdated === null) {
        setFileUpdatedError(true);
      } else {
        setFileUpdatedError(false);
      }
      if (
        updatedColumnData === ''
        || updatedColumnData === 'null'
        || updatedColumnData === 'NaN'
      ) {
        setNameUpdatedError(true);
      } else {
        setNameUpdatedError(false);
      }
      if (
        updatedDataValue === ''
        || updatedDataValue === 'null'
        || updatedDataValue === 'NaN'
        ) {
        setIdUpdatedError(true);
      } else {
        setIdUpdatedError(false);
      }
      if (
        updatedDataNew === ''
        || updatedDataNew === 'null'
        || updatedDataNew === 'NaN'
        ) {
        setValueUpdatedError(true);
      } else {
        setValueUpdatedError(false);
      }
    }

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
            width: 800,
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
            {
              fileErrorAdd ? (
                <>
                  <br />
                  <p
                    style={{
                      color: 'red',
                      fontWeight: 1000,
                    }}
                  >
                    Cần thêm file vào
                  </p>
                </>
              ) : (
                <>
                </>
              )
            }
          </div>
          <h2>Thêm cột mới vào</h2>
          <input
            className='input_new_column'
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Thêm tên vào cột mới"
          />
          {
            nameColNew ? (
              <>
                <p>
                  Id bạn nhập không phù hợp
                </p> 
              </>
            ) : (
              ""
            )
          }
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
              width: 800,
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
              <div>
                {
                  fileAddValue ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Bạn cần nhập file
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
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
              <div>
                {
                  nameColError ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Giá trị cột mới chưa nhập hoặc để dữ liệu null hoặc NaN
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
              </div>
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
              <div>
                {
                  idColAddError ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Id bạn đã nhập trộng hoặc sai dữ liệu null hoặc NaN
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
                {
                  idFormatAdd ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Id bạn đã sai
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
                {
                  errorData ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Id bạn không tìm thấy
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
              </div>
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
              <div>
                {
                  valueColError ? (
                    <>
                      <p
                        style={{
                          fontWeight: 1000,
                          color: 'red'
                        }}
                      >
                        Giá trị nhập vào để trống hoặc dữ liệu null và NaN
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
              </div>
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
              width: 700,
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
              <div>
                {
                  fileUpdatedError ? (
                    <>
                      <p 
                        style={{
                          fontWeight: 1000,
                          fontSize: 18,
                          color: 'red'
                        }}
                      >
                        File của bạn nhập sai
                      </p>
                    </>
                  ) : (
                    <>
                    </>
                  )
                }
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
            <div>
              {
                nameUpdatedError ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        fontSize: 18,
                        color: 'red'
                      }}
                    >
                      Tên cột nhập của bạn không được để trống hoặc giá trị null NaN
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
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
            <div>
              {
                idUpdatedError ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        fontSize: 18,
                        color: 'red'
                      }}
                    >
                      Id bạn phải nhập hoặc không để giá trị NaN null
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
              {
                idFormat ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        fontSize: 18,
                        color: 'red'
                      }}
                    >
                      Id bạn nhập sai
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
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
            <div>
              {
                valueUpdatedError ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        fontSize: 18,
                        color: 'red'
                      }}
                    >
                      Giá trị cập nhật bạn bỏ trống hoặc không để null NaN 
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
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
            <div>
              {
                fileDeleteError ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        color: 'red'
                      }}
                    >
                      Cần Bạn nhập thêm file cần xóa
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
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
            <div>
              {
                errorColDelete ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        color: 'red'
                      }}
                    >
                      Bạn để trống cột cần xóa 
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
            </div>
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
            <div>
              {
                errorIdDelete ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        color: 'red'
                      }}
                    >
                      Bạn để trống id cần xóa
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
              {
                errorIdDeleteFormat ? (
                  <>
                    <p
                      style={{
                        fontWeight: 1000,
                        color: 'red'
                      }}
                    >
                      Bạn cần nhập id có 6 chữ số
                    </p>
                  </>
                ) : (
                  <>
                  </>
                )
              }
            </div>
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
      {/* Code tiếp Phần thêm tất cả */}
      <div>
        <h1
          style={{
            color: 'green'
          }}
        >
          Nhập giá trị của cột
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
              File cần nhập giá trị
            </h5>
            <div>
              <input
                type="file"
                onChange={handleFileAddAllChange}
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
            <span>Cột cần thêm</span>
            <input
              className='input_chosen_file'
              style={{
                marginLeft: 30,
                height: 24
              }}
              type="text"
              onChange={(e) => setDataAddAll(e.target.value)}
              placeholder="Cột cần thêm"
            />
          </div>
          <div
            style={{
              marginLeft: 40,
              marginTop: 20
            }}
          >
            <span>Nhập giá trị cần thêm</span>
            <input
              className='input_chosen_file'
              style={{
                marginLeft: 41,
                height: 24
              }}
              type="text"
              onChange={(e) => setDataValueAll(e.target.value)}
              placeholder="Giá trị cần thêm"
            />
            
          </div>
          <button
            style={{
              background: 'green',
              color: 'white',
              marginLeft: 40,
              marginTop: 20
            }}
            onClick={addAllValue}
          >
            Thêm vào tất cả giá trị
          </button>
        </div>
      </div>
    </>
  );
}

export default App

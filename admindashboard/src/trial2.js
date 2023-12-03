import './App.css';
import React, { useState, useEffect, Fragment } from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import { RxUpdate } from 'react-icons/rx';
import 'react-responsive-modal/styles.css';
import ReactPaginate from 'react-paginate';
import EditableRow from './EditableRow';

const TableComponent = () => {
  const [userData, setUserdata] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [globalFilterText, setGlobalFilterText] = useState('');
  useEffect(() => {
    const getData = async () => {
      const reqData = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );
      const resData = await reqData.json();
      setUserdata(resData);
    };
    getData();
  }, []);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [edituserDataId, setEdituserDataId] = useState(null);

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: edituserDataId,
      name: editFormData.name,
      email: editFormData.email,
      role: editFormData.role,
    };

    const newContacts = [...userData];

    const index = userData.findIndex(
      (getusers) => getusers.id === edituserDataId
    );

    newContacts[index] = editedContact;

    setUserdata(newContacts);
    setEdituserDataId(null);
  };

  const handleEditClick = (event,getusers) => {
    event.preventDefault();
    console.log(event);
    setEdituserDataId(getusers.id);

    const formValues = {
      name: getusers.name,
      email: getusers.email,
      role: getusers.role,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEdituserDataId(null);
  };



  const [pagenumber, setPagenumber] = useState(0);
  const perpage = 10;
  const pageclick = pagenumber * perpage;
  const countpage = Math.ceil(userData.length / perpage);

  const handleDelete = (id) => {
    const newlist = userData.filter((x, li) => {
      return li !== id;
    });
    setUserdata(newlist);
  };

  const handleBulkDelete = () => {
    const newData = userData.filter((row) => !selectedRows.includes(row.id));
    setUserdata(newData);
    setSelectedRows([]);
  };

  const handleCheckbox = (rowId, email) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
    const newData = userData.map((row) => {
      if (row.id === rowId) {
        return { ...row, email };
      }
      return row;
    });
    setUserdata(newData);
  };

  const changePage = ({ selected }) => {
    setPagenumber(selected);
  };

  const handleGlobalFilter = (e) => {
    const value = e.target.value || '';
    setGlobalFilterText(value);
  };

  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(globalFilterText.toLowerCase())
    );
  });

  return (
    <div className="Container">
      <div className="toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="search"
            onChange={handleGlobalFilter}
            value={globalFilterText}
          />
          <button className="search-icon">Search</button>
        </div>

        <div className="delete-all">
          <button
            className="del-all-btn"
            onClick={() => {
              handleBulkDelete();
            }}
          >
            Delete Rows
          </button>
        </div>
      </div>
      <form onSubmit={handleEditFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="allselect"
                  checked={!userData.some((user) => user?.isChecked !== true)}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData
              .slice(pageclick, pageclick + perpage)
              .map((getusers, index) => (
                <Fragment>
                  <tr key={getusers.id}>
                    <td>
                      {' '}
                      <input
                        type="checkbox"
                        name={getusers.name}
                        checked={selectedRows.includes(getusers.id)}
                        onChange={() =>
                          handleCheckbox(getusers.id, getusers.email)
                        }
                      />
                    </td>
                    {edituserDataId === index ? (
                      <EditableRow
                        editFormData={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleCancelClick={handleCancelClick}
                      />
                    ) : (
                      <>
                        <td>{getusers.id}</td>
                        <td>{getusers.name}</td>
                        <td>{getusers.email}</td>
                        <td>{getusers.role}</td>
                        <td>
                          <span className="edit-btn">
                            <BsFillPencilFill
                              onClick={(event) =>
                                handleEditClick(event, getusers)
                              }
                            />
                          </span>
                          <span className="delete-btn">
                            <BsFillTrashFill
                              onClick={() => handleDelete(index)}
                            />
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                </Fragment>
              ))}
          </tbody>
        </table>
      </form>
      <div className="Pagination">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel="..."
          pageCount={countpage}
          onPageChange={changePage}
          containerClassName={'paginationBttns'}
          previousLinkClassName={'previousBttn'}
          nextLinkClassName={'nextBttn'}
          pageClassName={'currentPage'}
          activeClassName={'paginationActive'}
          disabledClassName={'paginationDisabled'}
        />
      </div>
    </div>
  );
};

export default TableComponent;

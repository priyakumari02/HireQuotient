import './App.css';
import React, { useState, useEffect } from 'react';
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs';
import 'react-responsive-modal/styles.css';
import ReactPaginate from 'react-paginate';
import { Modal } from 'react-responsive-modal';

const TableComponent = () => {
  const [userData, setUserdata] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
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

  const [pagenumber, setPagenumber] = useState(0);
  const perpage = 10;
  const pageclick = pagenumber * perpage;
  const countpage = Math.ceil(userData.length / perpage);

  const handleDelete = (id) => {
    const newlist = userData.filter((li) => li.id !== id);
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

  const blankuser = {
    name: '',
    email: '',
    role: '',
  };

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('Add');
  const [user, setUser] = useState(blankuser);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    setAction('Add');
  };

  

  const handleEdit = (index) => {
    console.log('index', index);
    setAction('Edit');
    const selectedUser = userData.find((x, i) => i === index);
    setUser(selectedUser);
    setEditIndex(index);
    onOpenModal();
  };

  const updateUser = () => {
    const newusers = userData.map((x, i) => {
      if (i === editIndex) {
        x = user;
      }
      return x;
    });
    setUserdata(newusers);
    setUserdata(blankuser);
    setEditIndex(null);
    onCloseModal();
  };
 
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
              <tr key={index}>
                <td>
                  {' '}
                  <input
                    type="checkbox"
                    name={getusers.name}
                    checked={selectedRows.includes(getusers.id)}
                    onChange={() => handleCheckbox(getusers.id, getusers.email)}
                  />
                </td>
                <td>{getusers.id}</td>
                <td>{getusers.name}</td>
                <td>{getusers.email}</td>
                <td>{getusers.role}</td>
                <td>
                  <span className="edit-btn">
                    <BsFillPencilFill onClick={() => handleEdit(index)} />
                  </span>
                  <span className="delete-btn">
                    <BsFillTrashFill
                      onClick={() => handleDelete(getusers.id)}
                    />
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal open={open} onClose={onCloseModal} center>
        <h2>{action} User</h2>
        {/* <p>{JSON.stringify(user)}</p> */}
        <div className="form">
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
          <label htmlFor="">Email</label>
          <input
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <label htmlFor="">Role</label>
          <input
            name=""
            id=""
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          ></input>
          {action === 'Edit' && (
            <button className="update-btn" onClick={() => updateUser()}>
              Update
            </button>
          )}
        </div>
      </Modal>
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

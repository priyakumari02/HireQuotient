// import './App.css';
// import "D:/Intern Project/node_modules/bootstrap/dist/css/bootstrap.min.css";
// function App() {
//   return (
//     <div className="App">
//      <h1>Hello</h1>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import {Users} from "./users";

const TableComponent = () => {
 const [search, setSearch] = useState('');
 const [data, setData] = useState([]);
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);
 const [selected, setSelected] = useState([]);
 const [isEditing, setIsEditing] = useState(false);
 const [currentEdit, setCurrentEdit] = useState(null);

 const handlePageChange = (type) => {
    switch (type) {
      case 'first':
        setPage(1);
        break;
      case 'prev':
        setPage(page - 1);
        break;
      case 'next':
        setPage(page + 1);
        break;
      case 'last':
        setPage(Math.ceil(total / 10));
        break;
      default:
        break;
    }
 };
  
 const handleEdit = (index) => {
  setEditableUser(userData[index]);
  setOpen(true);
 };

 const handleChange = (e) => {
  setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
 };
 
 const handleSelect = (id) => {
    const newSelected = [...selected];
    const index = newSelected.indexOf(id);
    if (index === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(index, 1);
    }
    setSelected(newSelected);
 };

 const handleSelectAll = () => {
    const newSelected = data.slice(page - 1, page).map((row) => row.id);
    setSelected(newSelected);
 };

 const handleDelete = () => {
    setData(data.filter((row) => !selected.includes(row.id)));
    setSelected([]);
 };

 const handleBulkDelete = () => {
    setData([]);
    setSelected([]);
 };

 const handleSearch = (e) => {
    setSearch(e.target.value);
 };

 const handleEdit = (id) => {
    const index = data.findIndex((row) => row.id === id);
    setCurrentEdit(data[index]);
    setIsEditing(true);
 };

 const handleSave = () => {
    const newData = [...data];
    newData[data.findIndex((row) => row.id === currentEdit.id)] = currentEdit;
    setData(newData);
    setIsEditing(false);
 };

 useEffect(() => {
    const newData = [];
    for (let i = 0; i < 50; i++) {
      newData.push({ id: i + 1, name: `Name ${i + 1}`, email: `email${i + 1}@example.com` });
    }
    setData(newData);
    setTotal(newData.length);
 }, []);

 const startIndex = (page - 1) * 10;
 const endIndex = startIndex + 10;
 const pageData = data.slice(startIndex, endIndex);

 return (
    <div>
      <div className="toolbar">
        <div className="search-bar">
          <input type="text" placeholder="Search" onChange={handleSearch} />
          <button className="search-icon">Search</button>
        </div>
        <button onClick={handleBulkDelete}>Delete All</button>
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleSelectAll} /></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((row) => (
            <tr key={row.id}>
              <td><input type="checkbox" onChange={() => handleSelect(row.id)} /></td>
              
              <td>{isEditing && currentEdit?.id === row.id ? <input type="text" defaultValue={row.name} onChange={(e) => setCurrentEdit({ ...currentEdit, name: e.target.value })} /> : row.name}</td>
              <td>{isEditing && currentEdit?.id === row.id ? <input type="text" defaultValue={row.email} onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })} /> : row.email}</td>
              <td>
                {isEditing && currentEdit?.id === row.id ? (
                 <button onClick={handleSave}>Save</button>
                ) : (
                 <>
                    <button onClick={() => handleEdit(row.id)}>Edit</button>
                    <button onClick={() => handleDelete(row.id)}>Delete</button>
                 </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange('first')}>First</button>
        <button onClick={() => handlePageChange('prev')}>Prev</button>
        <button onClick={() => handlePageChange('next')}>Next</button>
        <button onClick={() => handlePageChange('last')}>Last</button>
      </div>
    </div>
 );
};

export default TableComponent;

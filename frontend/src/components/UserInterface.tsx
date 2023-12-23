import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserInterfaceProps {
  backendName: string; //go
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [updateUser, setUpdateUser] = useState({ id: '', name: '', email: '' });

  // Define styles based on the backend name
  const backgroundColors: { [key: string]: string } = {
    go: 'bg-cyan-500',
  };

  const buttonColors: { [key: string]: string } = {
    go: 'bg-cyan-700 hover:bg-blue-600',
  };

  const bgColor = backgroundColors[backendName as keyof typeof backgroundColors] || 'bg-gray-200';
  const btnColor = buttonColors[backendName as keyof typeof buttonColors] || 'bg-gray-500 hover:bg-gray-600';

  // Fetch all users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/${backendName}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [backendName, apiUrl]);

  // Create a new user
  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/${backendName}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: '', email: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Update a user
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/${backendName}/users/${updateUser.id}`, { name: updateUser.name, email: updateUser.email });
      setUpdateUser({ id: '', name: '', email: '' });
      setUsers(
        users.map((user) => {
          if (user.id === parseInt(updateUser.id)) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a user
  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`${apiUrl}/api/${backendName}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <div className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-4 my-4 rounded shadow`}>
      <img src={`/${backendName}logo.svg`} alt={`${backendName} Logo`} className="w-20 h-20 mb-6 mx-auto" />
      <h2 className="text-xl font-bold text-center text-white mb-6">{`${backendName.charAt(0).toUpperCase() + backendName.slice(1)} Backend`}</h2>

      {/* Create user */}
      <form onSubmit={createUser} className="mb-6 p-4 bg-blue-100 rounded shadow">
        <input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Add User
        </button>
      </form>

      {/* Update user */}
      <form onSubmit={handleUpdateUser} className="mb-6 p-4 bg-blue-100 rounded shadow">
      <input
          placeholder="User Id"
          value={updateUser.id}
          onChange={(e) => setUpdateUser({ ...updateUser, id: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="New Name"
          value={updateUser.name}
          onChange={(e) => setUpdateUser({ ...updateUser, name: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <input
          placeholder="New Email"
          value={updateUser.email}
          onChange={(e) => setUpdateUser({ ...updateUser, email: e.target.value })}
          className="mb-2 w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
          Update User
        </button>
      </form>

      {/* display users */}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <CardComponent card={user} />
            <button onClick={() => deleteUser(user.id)} className={`${btnColor} text-white py-2 px-4 rounded`}>
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInterface;

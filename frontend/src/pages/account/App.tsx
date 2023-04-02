import React, { useState, useEffect } from 'react';
import RoomInfo from './RoomInfo';
import backgroundImage from './images/background.jpg';
import profilePicture from './images/profile.png';
import './account.css';

interface RoomInfo {
    id: number;
    name: string;
}

interface UserInfo {
    name: string;
    email: string;
    bio: string;
    rooms: RoomInfo[];
}

const user: UserInfo = {
    name: 'Davin Tristan Lesson',
    email: 'email@email.com',
    bio: 'Student of Mikroskil University Medan Computer Science',
    rooms: [
        { id: 1, name: 'Room 1' },
        { id: 2, name: 'Room 2' },
        { id: 3, name: 'Room 3' },
        { id: 4, name: 'Room 4' },
    ],
};

const App: React.FC = () => {
    // const [user, setUser] = useState<UserInfo | null>(null);

    // useEffect(() => {
    //     fetch('/api/user')
    //         .then((response) => response.json())
    //         .then((data) => setUser(data));
    // }, []);

    // if (!user) {
    //     return <div>Loading...</div>;
    // }

    const [editNameOpen, setEditNameOpen] = useState(false);
    const [editEmailOpen, setEditEmailOpen] = useState(false);
    const [editBioOpen, setEditBioOpen] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [newEmail, setNewEmail] = useState(user.email);
    const [newBio, setNewBio] = useState(user.bio);
    const [roomColors, setRoomColors] = useState<string[]>([]);


    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBio(event.target.value);
    };

    const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        user.name = newName;
        setEditNameOpen(false);
    };

    const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        user.email = newEmail;
        setEditEmailOpen(false);
    };

    const handleBioSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        user.bio = newBio;
        setEditBioOpen(false);
    };

    useEffect(() => {
        const colors = user.rooms.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        setRoomColors(colors);
    }, []);

    return (
        <>
            <div className="backImage">
                <img src={backgroundImage} alt="Background" />
            </div>
            <div className="profileImage">
                <div className="pic">
                    <img src={profilePicture} alt="Profile" />
                </div>
            </div>
            <div className="description">
                <div className="useProfile">
                    <h1>
                        <button className="editButton" onClick={() => setEditNameOpen(!editNameOpen)}></button>
                        {user.name}
                    </h1>
                    {editNameOpen && (
                        <form onSubmit={handleNameSubmit}>
                            <input type="text" value={newName} onChange={handleNameChange} className="form-input" />
                            <button className="save-btn" type="submit">Save</button>
                            <button className="cancel-btn" onClick={() => setEditNameOpen(false)}>Cancel</button>
                        </form>
                    )}
                    <h3>
                        <button className="editButton" onClick={() => setEditEmailOpen(!editEmailOpen)}></button>
                        {user.email}
                    </h3>
                    {editEmailOpen && (
                        <form onSubmit={handleEmailSubmit}>
                            <input type="text" value={newEmail} onChange={handleEmailChange} className="form-input" />
                            <button className="save-btn" type="submit">Save</button>
                            <button className="cancel-btn" onClick={() => setEditEmailOpen(false)}>Cancel</button>
                        </form>
                    )}
                    <p>
                        <button className="editButton" onClick={() => setEditBioOpen(!editBioOpen)}></button>
                        {user.bio}
                    </p>
                    {editBioOpen && (
                        <form onSubmit={handleBioSubmit}>
                            <input type="text" value={newBio} onChange={handleBioChange} className="form-input" />
                            <button className="save-btn" type="submit">Save</button>
                            <button className="cancel-btn" onClick={() => setEditBioOpen(false)}>Cancel</button>
                        </form>
                    )}
                </div>
                <div className="info">
                    <div className="title">
                        <h3>Ruangan Saya</h3>
                    </div>
                    <div className="roomItem">
                        {user.rooms.map((room, index) => (
                            <RoomInfo key={room.id} name={room.name} color={roomColors[index]} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="button">
                <button>Delete Account</button>
            </div>
        </>
    );
};

export default App;
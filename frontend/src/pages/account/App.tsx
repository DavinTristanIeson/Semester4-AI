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

    const [roomColors, setRoomColors] = useState<string[]>([]);

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
                    <h1>{user.name}</h1>
                    <h3>{user.email}</h3>
                    <p>{user.bio}</p>
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
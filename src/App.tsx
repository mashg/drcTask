import { Table } from './Table.tsx';
import { useEffect, useState } from 'react';
import { fetchApiUsers, User } from './api-readonly-file.ts';

function App() {
    const [users, setUsers] = useState<User[]>();

    useEffect(() => {
        fetchApiUsers().then(setUsers);
    }, []);

    const defaultLimit = 25; // Set a valid default limit value

    return (
        <>
            {users && (
                <div className="user-count">
                    The number of users is: {users.length}
                </div>
            )}
            <Table
                data={users ?? []}
                defaultLimit={defaultLimit}
                columns={[
                    {id: 'id', title: 'ID', render: _ => _.id},
                    {id: 'firstname', title: 'First name', render: _ => _.firstname},
                    {id: 'lastname', title: 'Last name', render: _ => _.lastname},
                    {id: 'country', title: 'Country', render: _ => _.country},
                ]}
            />
        </>
    );
}

export default App;

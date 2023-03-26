import { useParams } from 'react-router-dom';

function App(){
    const { id } = useParams();
    return <>
    <h1>Chat: {id}</h1>
    </>
}

export default App;
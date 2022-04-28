import './App.css';
import {Main} from './components'
import {Route, Routes} from "react-router-dom";

function App() {

    return (
        <div>
            <Routes>
                <Route path="/" element={<Main/>}/>
            </Routes>
        </div>
    );
}

export default App;

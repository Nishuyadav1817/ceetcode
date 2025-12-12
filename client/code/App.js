import React from "react";
import ReactDOM from "react-dom/client"
import Index from "./index"
import { Provider } from 'react-redux';
import {store} from './store'
function App(){
    return(
        <Provider store={store}>
        <Index></Index>
        </Provider>
    )
}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<App></App>)
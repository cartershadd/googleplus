import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import profileMainPage from './Profiles/profilePageMain';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AlbumPage from "./Profiles/AlbumPage";
import FriendList from "./Profiles/FriendList";
import EditPage from "./Profiles/EditPage";

function App() {
    return (
        <div className="app">
            <Router>
                <Switch>
                    <Route exact path="/" component={profileMainPage}/>
                    <Route exact path="/photos/:id" component={AlbumPage}/>
                    <Route exact path="/friends/:id" component={FriendList}/>
                    <Route exact path="/edit/:id" component={EditPage}/>
                </Switch>
            </Router>
        </div>
    );
}

export default App;

import React, {Component} from 'react';
import Card from "react-bootstrap/Card";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import Button from "react-bootstrap/Button";

class Login extends Component {
    state = {
        isSignedIn: false
    };

    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            // firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    componentDidMount() {
        this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
            (user) => this.setState({isSignedIn: !!user})
        );
    }

    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
        this.unregisterAuthObserver();
    }


    render() {
        return (
            <Card className="login-wrapper">
                <Card.Body>
                    {this.state.isSignedIn ?
                        <div className="login-container">
                            <img className="display-pic" src={firebase.auth().currentUser.photoURL}
                                 alt="display-pic"/>
                            <div className="wrapper-btn-word">
                                <p className="login-greeting">Welcome {firebase.auth().currentUser.displayName}! <br></br>You
                                    are now signed-in!</p>
                                <Button size="sm" className="logout"
                                        onClick={() => firebase.auth().signOut()}>Sign-out</Button>
                            </div>
                        </div>
                        :
                        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                    }
                </Card.Body>
            </Card>
        );
    }
}

export default Login;

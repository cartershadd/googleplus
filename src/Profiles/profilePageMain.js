import React, {Component} from 'react';
import Footer from "./Footer";
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {db} from "../firebase";
import {LinkContainer} from "react-router-bootstrap";
import firebase from "firebase";

class ProfilePageMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileList: [],
            isSignedIn: false,
        }
    }

    componentDidMount() {
        console.log(firebase.auth().currentUser)
        db.collection('userData').get().then((querySnapshot) => {
            let userList = [];
            querySnapshot.forEach((doc) => {
                let user = doc.data();
                user.id = doc.id;
                userList.push(user);
            });
            this.setState({profileList: userList});
        });
    }

    render() {
        return (
            <div className="profile-wrapper">
                {this.state.profileList.map((profile, index) =>
                    <Card key={index} className="profile" style={{width: '20rem'}}>
                        <Card.Img variant="top" src={profile.backgroundImg}/>
                        <img className="profile-circle" alt="profile-img" src={profile.mainImg}/>
                        <Card.Body>
                            <Card.Title>{profile.name}</Card.Title>
                            <Card.Text>
                                {profile.about}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem>{profile.job}</ListGroupItem>
                            <ListGroupItem>{profile.home}</ListGroupItem>
                            <ListGroupItem>{profile.quote}</ListGroupItem>
                        </ListGroup>
                        <Card.Body>
                            <LinkContainer to={`/photos/${profile.id}`}>
                                <Card.Link>Photos</Card.Link>
                            </LinkContainer>

                            <LinkContainer to={`/friends/${profile.id}`}>
                                <Card.Link>Friends</Card.Link>
                            </LinkContainer>
                            {firebase.auth().currentUser != null && profile.id === firebase.auth().currentUser.uid ?
                                <LinkContainer to={`/edit/${profile.id}`}>
                                <Card.Link>
                                    Edit Profile
                                </Card.Link>
                                </LinkContainer>
                                :
                                <div></div>
                            }
                        </Card.Body>
                    </Card>
                )}
                <Footer/>
            </div>
        )
    }
}

export default ProfilePageMain;

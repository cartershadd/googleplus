import React, {Component} from 'react';
import Carousel from "react-bootstrap/Carousel";
import {db} from "../firebase";

class AlbumPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                photos: []
            }
        }
    }

    componentDidMount() {
        db.collection('userData').doc(this.props.match.params.id).get().then((doc) => {
            if (doc.exists) {
                let user = doc.data();
                console.log(user)
                this.setState({user: user});
            }
        })
    }

    render() {
        return (
            <Carousel>
                {this.state.user.photos.map((photoUrl, index) => (
                    <Carousel.Item key={index}>
                        <img
                            id="carousel-photo"
                            className="d-block"
                            src={photoUrl}
                            alt="slideshow img"
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        )
    }
}

export default AlbumPage;

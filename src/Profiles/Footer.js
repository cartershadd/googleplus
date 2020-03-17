import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Search from "./Search";
import Login from "./Login";

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <CardGroup>
                    <Card>
                        <Card.Header>Find more friends below...</Card.Header>
                        <div className='wrapper-comp'>
                            <Search/>
                            <Login/>
                        </div>
                        <Card.Footer className="text-muted">Copyright by No One</Card.Footer>
                    </Card>
                </CardGroup>
            </div>
        );
    }
}

export default Footer;

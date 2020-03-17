import React, {Component} from 'react';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

class Search extends Component {
    state = {
        text: '',
        profileList: [],
        filteredProfileList: [],
        showNoResults: false,
    };

    Search = (searchTerm) => {
        let filteredProfileList = this.state.profileList.filter(profile =>
            profile.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
        this.setState({filteredProfileList: filteredProfileList});
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.Search(this.refs.searchForm.value);
    };

    render() {
        return (
            <div className="search-wrapper">
                <Card.Body>
                    <Form onSubmit={this.onSubmit}>
                        <InputGroup>
                            <Form.Control
                                id="searchForm"
                                ref="searchForm"
                                type="text"
                                name="text"
                                placeholder="Search..."
                            />
                            <InputGroup.Append>
                                <Button type="submit" value="Search" variant="primary">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>

                    <div className="search-results">
                        {this.state.filteredProfileList.map((profile, index) => {
                            return <Card key={index} className="profile" style={{width: '20rem'}}>
                                <Card.Img variant="top" src={profile.img[1]}/>
                                <img className="profile-circle" alt="profile-img" src={profile.img[0]}/>
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
                                    <Card.Link href="#">{profile.photos}</Card.Link>
                                    <Card.Link href="#">{profile.fList}</Card.Link>
                                </Card.Body>
                            </Card>
                        })}
                        {this.showNoResults
                            ? <div className="no-results">No results.</div>
                            : <div/>
                        }
                    </div>
                </Card.Body>
            </div>
        );
    }
}

export default Search;

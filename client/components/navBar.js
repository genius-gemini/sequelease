import React from "react";
import { Menu, Container, Icon } from "semantic-ui-react";

const Navbar = props => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item as="a" header onClick={props.handleShowClick}>
        {props.visible ? "Hide" : "Show"} DB Structure
      </Menu.Item>
      <Menu.Item as="a" header>
        SQLEase
      </Menu.Item>
      <Menu.Item as="a">Home</Menu.Item>
    </Container>
  </Menu>
);

export default Navbar;

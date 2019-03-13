import React from "react";
import { Menu, Container } from "semantic-ui-react";

const Navbar = () => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item as="a" header>
        SQLEase
      </Menu.Item>
      <Menu.Item as="a">Home</Menu.Item>
    </Container>
  </Menu>
);

export default Navbar;

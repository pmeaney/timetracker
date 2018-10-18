// import '../scss/bootstrap4Styles/bootstrapCompileConfig.scss';

// import React from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <div>
        <Navbar color="faded" light>
          <NavbarBrand href="/" className="mr-auto">reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="/components/">Components</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}


// import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

// export default class Example extends React.Component {
//   render() {
//     return (
//       <Form>
//         <FormGroup row>
//           <Label for="exampleEmail" sm={2}>Email</Label>
//           <Col sm={10}>
//             <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
//           </Col>
//         </FormGroup>
//         <FormGroup row>
//           <Label for="examplePassword" sm={2}>Password</Label>
//           <Col sm={10}>
//             <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
//           </Col>
//         </FormGroup>
//         <FormGroup row>
//           <Label for="exampleSelect" sm={2}>Select</Label>
//           <Col sm={10}>
//             <Input type="select" name="select" id="exampleSelect" />
//           </Col>
//         </FormGroup>
//         <FormGroup row>
//           <Label for="exampleSelectMulti" sm={2}>Select Multiple</Label>
//           <Col sm={10}>
//             <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple>
//               <option>1</option>
//               <option>2</option>
//               <option>3</option>
//               <option>4</option>
//               <option>5</option>
//             </Input>
//           </Col>
//         </FormGroup>
//         <FormGroup row>
//           <Label for="exampleText" sm={2}>Text Area</Label>
//           <Col sm={10}>
//             <Input type="textarea" name="text" id="exampleText" />
//           </Col>
//         </FormGroup>
        
//         <FormGroup row>
//           <Label for="exampleFile" sm={2}>File</Label>
//           <Col sm={10}>
//             <Input type="file" name="file" id="exampleFile" />
//             <FormText color="muted">
//               This is some placeholder block-level help text for the above input.
//               It's a bit lighter and easily wraps to a new line.
//             </FormText>
//           </Col>
//         </FormGroup>
//         <FormGroup tag="fieldset" row>
//           <legend className="col-form-label col-sm-2">Radio Buttons</legend>
//           <Col sm={10}>
//             <FormGroup check>
//               <Label check>
//                 <Input type="radio" name="radio2" />{' '}
//                 Option one is this and that—be sure to include why it's great
//               </Label>
//             </FormGroup>
//             <FormGroup check>
//               <Label check>
//                 <Input type="radio" name="radio2" />{' '}
//                 Option two can be something else and selecting it will deselect option one
//               </Label>
//             </FormGroup>
//             <FormGroup check disabled>
//               <Label check>
//                 <Input type="radio" name="radio2" disabled />{' '}
//                 Option three is disabled
//               </Label>
//             </FormGroup>
//           </Col>
//         </FormGroup>
//         <FormGroup row>
//           <Label for="checkbox2" sm={2}>Checkbox</Label>
//           <Col sm={{ size: 10 }}>
//             <FormGroup check>
//               <Label check>
//                 <Input type="checkbox" id="checkbox2" />{' '}
//                 Check me out
//               </Label>
//             </FormGroup>
//           </Col>
//         </FormGroup>
//         <FormGroup check row>
//           <Col sm={{ size: 10, offset: 2 }}>
//             <Button>Submit</Button>
//           </Col>
//         </FormGroup>
//       </Form>
//     );
//   }
// }

// import {
//   Collapse,
//   Navbar,
//   NavbarToggler,
//   NavbarBrand,
//   Nav,
//   NavItem,
//   NavLink,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem
// } from 'reactstrap';

// import React from 'react';

// export default class ExampleNavbar extends React.Component {
//   constructor(props) {
//     super(props);

//     this.toggle = this.toggle.bind(this);
//     this.state = {
//       isOpen: false
//     };
//   }
//   toggle() {
//     this.setState({
//       isOpen: !this.state.isOpen
//     });
//   }
//   render() {
//     return (
//       <div>
//         <Navbar color="light" light expand="md">
//           <NavbarBrand href="/">reactstrap</NavbarBrand>
//           <NavbarToggler onClick={this.toggle} />
//           <Collapse isOpen={this.state.isOpen} navbar>
//             <Nav className="ml-auto" navbar>
//               <NavItem>
//                 <NavLink href="/components/">Components</NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
//               </NavItem>
//               <UncontrolledDropdown nav inNavbar>
//                 <DropdownToggle nav caret>
//                   Options
//                 </DropdownToggle>
//                 <DropdownMenu right>
//                   <DropdownItem>
//                     Option 1
//                   </DropdownItem>
//                   <DropdownItem>
//                     Option 2
//                   </DropdownItem>
//                   <DropdownItem divider />
//                   <DropdownItem>
//                     Reset
//                   </DropdownItem>
//                 </DropdownMenu>
//               </UncontrolledDropdown>
//             </Nav>
//           </Collapse>
//         </Navbar>
//       </div>
//     );
//   }
// }
import React from 'react'
// import Reactstrap from "reactstrap";
import { Card, CardHeader, Button, Collapse, CardBody } from "reactstrap"
import 'bootstrap/dist/css/bootstrap.min.css';

class CollapseVisualComponent extends React.Component {
  constructor(props) {
    super(props);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.state = {
      accordion: [true, false, false],
    };
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  render() {
    return (
      <div className='wrapper'>
        <div id="accordion">
          <Card className="mb-0">
            <CardHeader id="headingOne">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                <h5 className="m-0 p-0">Collapsible Group Item #1</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
              <CardBody>
                1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </CardBody>
            </Collapse>
          </Card>
          <Card className="mb-0">
            <CardHeader id="headingTwo">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseTwo">
                <h5 className="m-0 p-0">Collapsible Group Item #2</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseTwo">
              <CardBody>
                2. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </CardBody>
            </Collapse>
          </Card>
          <Card className="mb-0">
            <CardHeader id="headingThree">
              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]} aria-controls="collapseThree">
                <h5 className="m-0 p-0">Collapsible Group Item #3</h5>
              </Button>
            </CardHeader>
            <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseThree">
              <CardBody>
                3. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </CardBody>
            </Collapse>
          </Card>
        </div>
      </div>
    );
  }

}

export default CollapseVisualComponent
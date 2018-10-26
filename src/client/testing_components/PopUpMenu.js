import React, { Component } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import '../../scss/primeReact/styles.sass'

const icon_taskList = <span className="redBox"></span>

export class PopUpMenu extends Component {

  constructor() {
    super();
    this.state = {
      items: [
        {
          label: 'Options',
          items: [
            { label: 'Task List', icon: icon_taskList } //, command: () => { window.location.hash = "/fileupload";
            // Soon, need to make this version below into a function.  The function will show/hide viewport and on show, will load fresh data from API
            // { label: 'Task List', icon: 'pi pi-fw pi-plus', command: () => { window.location.hash = "/fileupload";
            // { label: 'Delete', icon: 'pi pi-fw pi-trash', url: 'http://primetek.com.tr' }
          ]
        },
        {
          label: 'Account',
          items: [{ label: 'Options', icon: 'pi pi-fw pi-cog', command: () => { window.location.hash = "/"; } },
          { label: 'Sign Out', icon: 'pi pi-fw pi-power-off' }]
        }
      ]
    };
  }

  render() {
    return (
      <div>
          <Menu model={this.state.items} popup={true} ref={el => this.menu = el} />
          <Button label="Show" icon="pi pi-bars" onClick={(event) => this.menu.toggle(event)} />
      </div>
    )
  }
}

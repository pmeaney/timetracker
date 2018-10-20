import '../scss/bulma_sass/bulma.sass'
import React from 'react';

// NOTE: DUPLICATE THIS, AND THEN CHANGE OUT THE MAIN CONTAINING CARD FOR A MESSAGE
  // -- It has the [X] button build in already
// https://bulma.io/documentation/components/message/
const Example = (props) => {
  return (
    <div class="container topSpacing">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Some info box
    </p>
          <a href="#" class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fas fa-angle-down" aria-hidden="true">X</i>
            </span>
          </a>
        </header>
        <div class="card-content">
          <div class="content">
      <h1 class="title">Some title</h1>
      <div class="columns overflowXYScroll makeFixedColumnHeight">
        <div class="column makeFixedColumnWidth">
                <div class="box">Charlie {window.testInfo}
          </div>
        </div>
        <div class="column makeFixedColumnWidth">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Some info about project </p>
                  </header>
                  <div class="card-content smallSpacing">
                    <div class="content">
                      <p>
                        Date: 10/18/2018
                        <br/>
                        Time: 8am - 5pm
                      </p>
                    </div>
                  </div>
                  <footer class="card-footer">
                    <a href="#" class="card-footer-item">Clock in</a>
                    <a href="#" class="card-footer-item">More Info</a>
                  </footer>
                </div>
        </div>
        <div class="column makeFixedColumnWidth">
          <div class="box">Patona</div>
        </div>
        <div class="column makeFixedColumnWidth">
          <div class="box">Lady</div>
        </div>
        <div class="column makeFixedColumnWidth">
          <div class="box">Lady</div>
        </div>
      </div>
          </div>
        </div>
        {/* <footer class="card-footer">
          <a href="#" class="card-footer-item">Submit</a>
          <a href="#" class="card-footer-item">Edit</a>
          <a href="#" class="card-footer-item">Delete</a>
        </footer> */}
      </div>

    </div>
    )
}

export default Example
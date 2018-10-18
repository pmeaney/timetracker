import '../scss/bulma_sass/bulma.sass'
import React from 'react';

const Example = (props) => {
  return (
    <div class="container">

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
      <h1 class="title">Orale Carnale!</h1>
      <div class="columns">
        <div class="column">
          <div class="box">Charlie
          </div>
        </div>
        <div class="column">
          <div class="box">Paco</div>
        </div>
        <div class="column">
          <div class="box">Patona</div>
        </div>
        <div class="column">
          <div class="box">Lady</div>
        </div>
      </div>
          </div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">Submit</a>
          <a href="#" class="card-footer-item">Edit</a>
          <a href="#" class="card-footer-item">Delete</a>
        </footer>
      </div>

    </div>
    )
}

export default Example
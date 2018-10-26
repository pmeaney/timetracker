import React from 'react';

/* 
A tasklist generates multiple card components-- up to 10.
Each card represents one of the 10 upcoming tasks to complete.

Each card needs to become component which we pass props into.
*/
const TaskList = (props) => {
  return (
      <article className="message topSpacing">
        <div className="message-header">
          <p>Task List</p>
          <button className="delete" aria-label="delete"></button>
        </div>
        <div className="message-body">
          <div className="columns overflowXYScroll makeFixedColumnHeight">
            <div className="column makeFixedColumnWidth">
              <div className="box">Charlie {window.testInfo}
              </div>
            </div>
            <div className="column makeFixedColumnWidth">
              <div className="card">
                <header className="card-header">
                  <p className="card-header-title">
                    Some info about project </p>
                </header>
                <div className="card-content smallSpacing">
                  <div className="content">
                    <p>
                      Date: 10/18/2018
                        <br />
                      Time: 8am - 5pm
                      </p>
                  </div>
                </div>
                <footer className="card-footer">
                  <a href="#" className="card-footer-item">Clock in</a>
                  <a href="#" className="card-footer-item">More Info</a>
                </footer>
              </div>
            </div>
            <div className="column makeFixedColumnWidth">
              <div className="box">Patona</div>
            </div>
            <div className="column makeFixedColumnWidth">
              <div className="box">Lady</div>
            </div>
            <div className="column makeFixedColumnWidth">
              <div className="box">Lady</div>
            </div>
          </div>
        </div>
      </article>
  )
}

export default TaskList
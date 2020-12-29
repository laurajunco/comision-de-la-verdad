import React, { Component } from 'react';
import SeccionMapa from './SeccionMapa';
import SeccionTopRutas from './SeccionTopRutas';

class App extends Component {

  render() {
    return (
      <div className="App">  
        <SeccionMapa/>
         {/* <SeccionTopRutas/> */}
      </div>
    )
  }
}

export default App;

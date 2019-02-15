import * as React from 'react';
import Container from './Container';

class App extends React.Component {
  public render() {

    return (
      <div className="App">
        <p style={{maxWidth: '600px'}}>Below is an example of drag and drop using the existing react-dnd HTML5 backend.</p>
        
        <Container />
      </div>
    );
  }
}

export default App;

import AppHeader from './todoList/AppHeader';

function App() {
  return (
    <div className="quick-list-app">
      
      <AppHeader /> 

      <ul className="items-list">
          <li className="todo-item">to</li>
          <li className="todo-item">be</li>
          <li className="todo-item">finished</li>
      </ul>

      <div className="action-section">
          <button className="remove-btn"> remove</button>
          <button className="add-btn">Add</button>
      </div>
    </div>
  );
}

export default App;

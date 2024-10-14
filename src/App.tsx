import './styles/App.css'
import CircuitBoard from './components/CircuitBoard';
import DraggableResizableSquare from './components/DraggableResizableSquare'

export default function App() {
  return (
    <main>
      <h1>Debug the Circuit Board</h1>
      <CircuitBoard />
      <DraggableResizableSquare />
    </main>
  );
}
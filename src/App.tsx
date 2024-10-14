import './styles/App.css'
import CircuitBoard from './components/CircuitBoard';
import Pad from './components/Pad'

export default function App() {
  return (
    <main>
      <h1>Debug the Circuit Board</h1>
      <CircuitBoard />
      <Pad />
    </main>
  );
}
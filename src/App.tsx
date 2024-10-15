import './styles/App.css'
import CircuitBoard from './components/CircuitBoard';
import Pad from './components/Pad'
import PadManager from './components/PadManager'

export default function App() {
  return (
    <main>
      <h1>Debug the Circuit Board</h1>
      <CircuitBoard />
      <PadManager /> {/* Use the PadManager component */}
    </main>
  );
}
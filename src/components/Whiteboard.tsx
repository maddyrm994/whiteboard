import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { database } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { useParams } from 'react-router-dom';
import { auth } from '../firebase';
import jsPDF from 'jspdf';
import './Whiteboard.css';

interface LineObject {
  tool: string;
  color: string;
  brushSize: number;
  points: number[];
}

interface Cursor {
  x: number;
  y: number;
}

const Whiteboard: React.FC = () => {
  const stageRef = useRef<any>(null);
  const [lines, setLines] = useState<LineObject[]>([]);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [eraserSize, setEraserSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [cursors, setCursors] = useState<{ [key: string]: Cursor }>({});
  const { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    const linesRef = ref(database, `sessions/${sessionId}/lines`);
    onValue(linesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLines(data);
      }
    });

    const cursorsRef = ref(database, `sessions/${sessionId}/cursors`);
    onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCursors(data);
      }
    });
  }, [sessionId]);

  const handleMouseDown = (e: any) => {
    const { offsetX, offsetY } = e.evt;
    setIsDrawing(true);
    if (isErasing) {
      const newLine = { tool: 'eraser', color: '#FFFFFF', brushSize: eraserSize, points: [offsetX, offsetY] };
      setLines([...lines, newLine]);
      set(ref(database, `sessions/${sessionId}/lines`), [...lines, newLine]);
    } else {
      const newLine = { tool: 'pen', color, brushSize, points: [offsetX, offsetY] };
      setLines([...lines, newLine]);
      set(ref(database, `sessions/${sessionId}/lines`), [...lines, newLine]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.evt;
    const updatedLines = lines.slice();
    let lastLine = updatedLines[updatedLines.length - 1];
    lastLine.points = lastLine.points.concat([offsetX, offsetY]);
    setLines(updatedLines.concat());
    set(ref(database, `sessions/${sessionId}/lines`), updatedLines.concat());

    const cursor = { x: offsetX, y: offsetY };
    const user = auth.currentUser?.uid;
    if (user) {
      set(ref(database, `sessions/${sessionId}/cursors/${user}`), cursor);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setIsErasing(false);
  };

  const handleBrushSizeChange = (newSize: number) => {
    setBrushSize(newSize);
    setIsErasing(false);
  };

  const handleEraserSizeChange = (newSize: number) => {
    setEraserSize(newSize);
    setIsErasing(true);
  };

  const handleSaveImage = () => {
    const width = stageRef.current.width();
    const height = stageRef.current.height();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const stage = stageRef.current.getStage();
    const stageData = stage.toDataURL({ pixelRatio: 1 });
    const img = new Image();
    img.src = stageData;
    img.onload = () => {
      context?.drawImage(img, 0, 0, width, height);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', [width, height]);
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('whiteboard_image.pdf');
    };
  };

  const handleUndo = () => {
    const updatedLines = lines.slice(0, -1);
    setLines(updatedLines);
    set(ref(database, `sessions/${sessionId}/lines`), updatedLines);
  };

  return (
    <div className="container mt-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <button className="btn btn-primary" onClick={handleUndo}>Undo</button>
              </li>
              <li className="nav-item mx-2 border-start border-secondary"></li>
              <li className="nav-item mx-2">
                <input type="color" className="form-control form-control-color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
              </li>
              <li className="nav-item mx-2">
                <div className="input-group">
                  <span className="input-group-text">Brush Size</span>
                  <input type="range" className="form-range" min={1} max={20} value={brushSize} onChange={(e) => handleBrushSizeChange(parseInt(e.target.value))} />
                </div>
              </li>
              <li className="nav-item mx-2 border-start border-secondary"></li>
              <li className="nav-item mx-2">
                <div className="input-group">
                  <span className="input-group-text">Eraser Size</span>
                  <input type="range" className="form-range" min={5} max={30} value={eraserSize} onChange={(e) => handleEraserSizeChange(parseInt(e.target.value))} />
                </div>
              </li>
              <li className="nav-item mx-2">
                <button className="btn btn-success" onClick={handleSaveImage}>Save as PDF</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="whiteboard-wrapper">
            <Stage
              width={700}
              height={500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              ref={stageRef}
              className="whiteboard-canvas"
            >
              <Layer>
                {lines.map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke={line.color}
                    strokeWidth={line.tool === 'eraser' ? line.brushSize * 2 : line.brushSize}
                    tension={0.5}
                    lineCap="round"
                    globalCompositeOperation={
                      line.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                ))}
                {Object.keys(cursors).map((key) => (
                  <Circle
                    key={key}
                    x={cursors[key].x}
                    y={cursors[key].y}
                    radius={5}
                    fill="red"
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
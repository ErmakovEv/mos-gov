import React, { useRef, useEffect, useState } from "react";
import initialData from "./data";

interface Item {
  name: string;
  mainSkills: string[];
  otherSkills: string[];
}

const drawFirstCircle = (
  items: Item[],
  radius: number,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // очищаем canvas перед рисованием
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const textWidth = 100; // ширина текста
  const startAngle = -Math.PI / 2; // угол начала, 12 часов
  const lineHeight = 14; // высота строки
  const totalItems = items.length;
  const angleStep = (2 * Math.PI) / totalItems;

  // очищаем canvas перед рисованием
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach((item, index) => {
    const angle = startAngle + index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // рассчитываем угловое смещение для текста
    const textAngle = angle; // смещение текста на 90 градусов влево

    // измеряем ширину текста
    const measuredTextWidth = ctx.measureText(item.name).width;

    // рассчитываем координаты для текста
    const textX = centerX + radius * 1.6 * Math.cos(angle); // учитываем ширину текста
    const textY = centerY + 18 + radius * 1.5 * Math.sin(angle); // учитываем ширину текста

    // если текст не помещается в указанную ширину, переносим его на следующую строку
    if (measuredTextWidth > textWidth) {
      const words = item.name.split(" ");

      let line = "";
      let linesCount = 0;
      words.reverse().forEach((word) => {
        console.log(words, word);
        const testLine = line.length ? line + " " + word : word;
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > textWidth && line.length > 0) {
          ctx.fillText(
            line.split(" ").reverse().join(" "),
            textX,
            textY - linesCount * lineHeight,
            textWidth
          ); // учитываем межстрочный интервал
          line = word;
          linesCount++;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, textX, textY - linesCount * lineHeight, textWidth); // учитываем межстрочный интервал
    } else {
      // рисуем текст
      ctx.font = "12px Arial"; // Устанавливаем стиль шрифта и размер
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.name, textX, textY);
    }

    // рисуем круг
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
  });
};

const Canvas: React.FC = () => {
  const [items] = useState<Item[]>(initialData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawFirstCircle(items, 100, canvas);
    }

    // if (!canvas) return;

    // const ctx = canvas.getContext('2d');
    // if (!ctx) return;

    // // Очищаем canvas перед рисованием
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // // Рисуем первую окружность
    // ctx.beginPath();
    // ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    // ctx.fillStyle = 'blue';
    // ctx.fill();

    // // Рисуем вторую окружность
    // ctx.beginPath();
    // ctx.arc(400, 400, 50, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red';
    // ctx.fill();

    // // Рисуем кривую Безье, если есть начальная и конечная точки
    // if (startPoint && endPoint) {
    //   ctx.beginPath();
    //   ctx.moveTo(startPoint.x, startPoint.y);
    //   ctx.bezierCurveTo(
    //     startPoint.x + (endPoint.x - startPoint.x) / 2,
    //     startPoint.y,
    //     endPoint.x - (endPoint.x - startPoint.x) / 2,
    //     endPoint.y,
    //     endPoint.x,
    //     endPoint.y
    //   );
    //   ctx.strokeStyle = 'green';
    //   ctx.stroke();
    // }
  }, [items]);

  const handleCircleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Проверяем, щелкнул ли пользователь внутри одного из кругов
    if (isInsideCircle(x, y, 100, 100, 50)) {
      // Рисуем кривую Безье от центра первого круга к центру второго
      setStartPoint({ x: 100, y: 100 });
      setEndPoint({ x: 400, y: 400 });
    } else if (isInsideCircle(x, y, 400, 400, 50)) {
      // Рисуем кривую Безье от центра второго круга к центру первого
      setStartPoint({ x: 400, y: 400 });
      setEndPoint({ x: 100, y: 100 });
    }
  };

  // Функция для определения, находится ли точка внутри круга
  const isInsideCircle = (
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const distanceSq = (x - centerX) ** 2 + (y - centerY) ** 2;
    return distanceSq <= radius ** 2;
  };

  /*
  const angle = startAngle + index * angleStep;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  const textWidth = 50; // ширина текста
  const textHeight = 30; // ширина текста
  const startAngle = -Math.PI / 2; // угол начала, 12 часов
  const lineHeight = 10; // высота строки
  const totalItems = items.length;
  const angleStep = (2 * Math.PI) / totalItems;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
*/

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth / 1.5} // Учитываем ширину рамки слева и справа
      height={window.innerHeight / 1.5} // Учитываем высоту рамки сверху и снизу
      onClick={handleCircleClick}
      style={{ border: "1px solid black" }}
    />
  );
};

export default Canvas;

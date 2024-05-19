import React from "react";
import { useDrop } from "react-dnd";
import Event from "./Event";
import { ItemTypes } from "./ItemTypes";
import { eventColors } from "../constants/eventColors";

function Datacell({ resourceIndex, dayIndex, clickedCells, setClickedCells }) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item) => moveEvent(item, resourceIndex, dayIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleCellClick = () => {
    const updatedClickedCells = [...clickedCells];
    const clickedCellIndex = updatedClickedCells.findIndex(
      (cell) =>
        cell.resourceIndex === resourceIndex && cell.dayIndex === dayIndex
    );

    if (clickedCellIndex !== -1) {
      const existingCell = updatedClickedCells[clickedCellIndex];
      existingCell.labels.push({
        label: `Event ${existingCell.labels.length + 1}`,
        width: 1,
        startDay: dayIndex,
        endDay: dayIndex,
      });
      setClickedCells(updatedClickedCells);
      saveToLocalStorage(updatedClickedCells);
    } else {
      const newCell = {
        resourceIndex,
        dayIndex,
        labels: [
          { label: "Event 1", width: 1, id: new Date().getTime().toString() },
        ],
      };
      setClickedCells([...clickedCells, newCell]);
      saveToLocalStorage([...clickedCells, newCell]);
    }
  };

  const moveEvent = (item, toResourceIndex, toDayIndex) => {
    const fromCellIndex = clickedCells.findIndex(
      (cell) =>
        cell.resourceIndex === item.resourceIndex &&
        cell.dayIndex === item.dayIndex
    );
    const toCellIndex = clickedCells.findIndex(
      (cell) =>
        cell.resourceIndex === toResourceIndex && cell.dayIndex === toDayIndex
    );

    if (fromCellIndex !== -1) {
      const updatedClickedCells = [...clickedCells];
      const fromCell = updatedClickedCells[fromCellIndex];
      const [movedLabel] = fromCell.labels.splice(item.labelIndex, 1);

      if (toCellIndex !== -1) {
        const toCell = updatedClickedCells[toCellIndex];
        toCell.labels.push(movedLabel);
      } else {
        updatedClickedCells.push({
          resourceIndex: toResourceIndex,
          dayIndex: toDayIndex,
          labels: [movedLabel],
        });
      }

      setClickedCells(updatedClickedCells); // Update state
      saveToLocalStorage(updatedClickedCells); // Pass the updated clickedCells
    }
  };

  return (
    <td
      className={`border border-[#CCCCCC] p-7 relative min-w-10 ${
        isOver ? "bg-gray-200" : ""
      }`}
      onClick={handleCellClick}
      ref={drop}
    >
      {clickedCells
        .filter(
          (cell) =>
            cell.resourceIndex === resourceIndex && cell.dayIndex === dayIndex
        )
        .map((cell, index) =>
          cell.labels.map((labelObj, labelIndex) => (
            <Event
              key={labelIndex}
              resourceIndex={resourceIndex}
              dayIndex={dayIndex}
              labelIndex={labelIndex}
              label={labelObj.label}
              width={labelObj.width}
              startDay={labelObj.startDay}
              endDay={labelObj.endDay}
              setClickedCells={setClickedCells}
              clickedCells={clickedCells}
              color={eventColors[resourceIndex % eventColors.length]}
            />
          ))
        )}
    </td>
  );
}

const saveToLocalStorage = (clickedCells) => {
  const updatedEvents = clickedCells.filter((cell) => cell.labels.length > 0);
  if (updatedEvents.length === 0) {
    localStorage.removeItem("events");
  } else {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  }
};

export default Datacell;

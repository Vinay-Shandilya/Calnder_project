import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ItemTypes } from "./ItemTypes";

const eventColors = [
  "bg-blue-500",
  "bg-red-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-gray-500",
  "bg-black-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-brown-500",
  "bg-deep-purple-500",
];

const Event = ({
  resourceIndex,
  dayIndex,
  labelIndex,
  label,
  width,
  setClickedCells,
  clickedCells,
  color,
}) => {
  const [dummyState, setDummyState] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { resourceIndex, dayIndex, labelIndex, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      console.log(
        `Deleting event at index ${index} from cell at resourceIndex: ${resourceIndex}, dayIndex: ${dayIndex}`
      );

      const updatedClickedCells = clickedCells.map((cell) => {
        if (
          cell.dayIndex === dayIndex &&
          cell.resourceIndex === resourceIndex
        ) {
          const updatedLabels = cell.labels.filter((_, i) => i !== index);
          console.log("Updated Labels after deletion:", updatedLabels); // Debug log
          return { ...cell, labels: updatedLabels };
        }
        return cell;
      });

      console.log("Updated Clicked Cells after deletion:", updatedClickedCells); // Debug log

      setClickedCells(updatedClickedCells);
      saveToLocalStorage(updatedClickedCells, index);

      toast.success("Event deleted successfully!");
    }
  };

  return (
    <div
      className="cursor-move flex justify-center items-center h-full whitespace-nowrap relative"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className={`relative ${color} p-2 rounded`}
        style={{ width: `${width * 100}%` }}
      >
        {label}
        <button
          onClick={() => handleDelete(labelIndex)} // Make sure labelIndex is correct
          className="absolute right-1 top-0 text-red-500 text-xs pb-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const saveToLocalStorage = (clickedCells, index) => {
  const updatedEvents = clickedCells.map((cell) => ({
    ...cell,
    labels: cell.labels.filter((_, i) => i !== index),
  }));

  // Remove any cells with no labels
  const filteredEvents = updatedEvents.filter((cell) => cell.labels.length > 0);

  if (filteredEvents.length === 0) {
    localStorage.removeItem("events");
  } else {
    localStorage.setItem("events", JSON.stringify(filteredEvents));
  }
};

export default Event;

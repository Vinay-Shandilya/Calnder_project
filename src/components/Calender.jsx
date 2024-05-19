// src/Calendar.jsx
import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Header from "./Header";
import Datacell from "./DataCell";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [clickedCells, setClickedCells] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({
    resourceIndex: null,
    dayIndex: null,
    label: "",
  });

  useEffect(() => {
    const firstDayOfMonth = startOfMonth(selectedDate);
    const lastDayOfMonth = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
    setDaysInMonth(daysInMonth);
  }, [selectedDate]);

  const handleMonthChange = (month, year) => {
    setSelectedDate(new Date(year, month));
  };

  const handleCellClick = (resourceIndex, dayIndex) => {
    setDialogData({ resourceIndex, dayIndex, label: "" });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    const updatedClickedCells = [...clickedCells];
    const { resourceIndex, dayIndex, label } = dialogData;
    const clickedCellIndex = updatedClickedCells.findIndex(
      (cell) =>
        cell.resourceIndex === resourceIndex && cell.dayIndex === dayIndex
    );

    if (clickedCellIndex !== -1) {
      // If the cell already has an event, add the new event below the previous one
      const existingCell = updatedClickedCells[clickedCellIndex];
      const newEvent = { label, width: 1 };
      existingCell.labels.push(newEvent);
      updatedClickedCells[clickedCellIndex] = existingCell;
    } else {
      // If the cell doesn't have any event yet, create a new cell
      const newCell = {
        resourceIndex,
        dayIndex,
        labels: [{ label, width: 1 }],
      };
      updatedClickedCells.push(newCell);
    }

    setClickedCells(updatedClickedCells);
    saveToLocalStorage(updatedClickedCells);
    setIsDialogOpen(false);
  };

  const saveToLocalStorage = (clickedCells) => {
    localStorage.setItem("events", JSON.stringify(clickedCells));
  };

  const resource = [
    "Resource A",
    "Resource B",
    "Resource C",
    "Resource D",
    "Resource E",
    "Resource F",
    "Resource G",
    "Resource H",
    "Resource I",
    "Resource J",
    "Resource K",
    "Resource L",
    "Resource M",
    "Resource N",
    "Resource O",
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <Header onMonthChange={handleMonthChange} />
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-500 w-full">
          <thead>
            <tr>
              <th className="border border-[#CCCCCC] pr-[100px] min-w-[202px] sticky left-0 bg-white z-10"></th>
              {daysInMonth.map((day, index) => (
                <th
                  key={index}
                  className={`border border-[#CCCCCC] pr-6 w-[100px] text-nowrap font-normal text-sm p-1 ${
                    isToday(day) ? "bg-yellow-200" : ""
                  }`}
                >
                  {format(day, "d EEE", { locale: enUS })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resource.map((res, resourceIndex) => (
              <tr key={resourceIndex}>
                <td className="border border-[#CCCCCC] text-start text-nowrap p-4 sticky left-0 bg-white z-10">
                  {res}
                </td>
                {daysInMonth.map((day, dayIndex) => (
                  <Datacell
                    key={dayIndex}
                    resourceIndex={resourceIndex}
                    dayIndex={dayIndex}
                    clickedCells={clickedCells}
                    setClickedCells={setClickedCells}
                    onCellClick={handleCellClick}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Label"
            type="text"
            fullWidth
            value={dialogData.label}
            onChange={(e) =>
              setDialogData({ ...dialogData, label: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent}>Save</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </DndProvider>
  );
}

export default Calendar;

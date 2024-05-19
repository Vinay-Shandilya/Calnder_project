import React, { useState } from "react";
import { format, addMonths, subMonths, isToday } from "date-fns";
import Calendar from "react-calendar";

function Header({ onMonthChange }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    onMonthChange(new Date().getMonth(), new Date().getFullYear());
  };

  const handlePrevMonthClick = () => {
    const prevMonth = subMonths(selectedDate, 1);
    setSelectedDate(prevMonth);
    onMonthChange(prevMonth.getMonth(), prevMonth.getFullYear());
  };

  const handleNextMonthClick = () => {
    const nextMonth = addMonths(selectedDate, 1);
    setSelectedDate(nextMonth);
    onMonthChange(nextMonth.getMonth(), nextMonth.getFullYear());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    onMonthChange(date.getMonth(), date.getFullYear());
  };

  return (
    <div className="flex flex-row bg-[#f1f1f1] justify-between border-b-2">
      <div
        className="p-2 text-[#007aff] text-2xl font-normal relative cursor-pointer"
        onClick={toggleCalendar}
      >
        {format(selectedDate, "MMMM yyyy")}
      </div>
      <div className="flex flex-row items-center justify-center mr-3">
        <span
          className="text-[#007aff] px-1 text-2xl font-medium cursor-pointer"
          onClick={handlePrevMonthClick}
        >
          {"<"}
        </span>
        <span
          className="text-[#007aff] px-1 text-md font-medium mt-1 cursor-pointer"
          onClick={handleTodayClick}
          style={{ color: isToday(selectedDate) ? "blue" : "#007aff" }}
        >
          Today
        </span>
        <span
          className="text-[#007aff] px-1 text-2xl font-medium cursor-pointer"
          onClick={handleNextMonthClick}
        >
          {">"}
        </span>
      </div>
      {showCalendar && (
        <div className="absolute bg-white left-2 top-[59px] z-50 border border-[#CCCCCC] rounded-md w-64 h-52">
          <Calendar onChange={handleDateClick} value={selectedDate} />
        </div>
      )}
    </div>
  );
}

export default Header;
